---
layout: post
---

Chef, And Terrible Things
===

![How I Feel](/assets/blog_content/chef_terrible/moe_proud.gif)

Idempotent XML Edits
===

This is a case of doing non-idiomatic things, but still getting to do them
naturally, with minimal pain.

At Globus, I've been managing a Jenkins server which runs builds, and hitting a
bit of a problem:
Jenkins consumes a monolithic config file at `~jenkins/config.xml` which mixes
static data and descriptors for content which we want to be modifiable, like
views and slave server configurations.

There are basically two ways, in idiomatic Chef recipes, to handle a system
which behaves like this:

  1. Ignore the file, only generating it with `:create_if_missing` style
  directives, never modifying existing content

  2. Template the whole file, necessarily destroying the possibility of editing
  any of this content outside of Chef

Of these two, the
[jenkins cookbook](https://supermarket.chef.io/cookbooks/jenkins) does it the
first way, but, fool that I was, I decided in 2013 to try to manage this config
directly with a template.
That did not go so well, but I really wanted that in order to control things
like the list of github usernames which can admin the server (via Jenkins'
github-oauth authentication).
This is data which already existed in large part on our Chef server, and the
duplication in static Jenkins config was both unweildy, and a pain point
when team members join or leave the organization.

Having suffered from both approaches to this config blob, I wanted some flow by
which my cookbook could essentially ''upsert'' specific values into the XML doc
and trigger service restarts on updates.

Raw Ruby in Chef
===

A feature of Chef which users are generally familiar with is the possibility of
using Ruby Blocks as the values of `not_if` or `only_if` guards.
Generally, this might be used something like

<pre class="prettyprint"><code class="language-rb">execute "runme" do
  cwd     "/var/scripts/"
  cmd     "./runme.sh"
  not_if  { ::File.exists?('/var/scripts/.dontrun') }
end
</code></pre>

However, since an arbitrary block can be used, this can also be used to do much
more sophisticated checks.
Try this one on for size:

<pre class="prettyprint"><code class="language-rb">github_client_id = 'abc123'
github_client_id_xpath = '/hudson/securityRealm/clientID'
conf_file = ::File.join(node['jenkins']['master']['home'], 'config.xml')
ruby_block "update #{conf_file}" do
  block do
    require 'nokogiri'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }

    github_client_id_node = xml_object.at_xpath(github_client_id_xpath)
    github_client_id_node.content = github_client_id

    File.write(conf_file, xml_object.to_xml)
  end
  not_if do
    require 'nokogiri'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }
    github_client_id_node = xml_object.at_xpath(github_client_id_xpath)
    next github_client_id_node.content == github_client_id
  end
end
</code></pre>

This executes an xpath query for the value at `/hudson/securityRealm/clientID/`
and checks it against `abc123` before executing the block content.
Note that if the guard raises an error, the entire `chef-client` run will fail.

Of course, doing this directly in the `ruby_block` resource means that there
will be some amount of code duplication between the guard and the `block`
attribute.
It's tempting to try to write an LWRP which looks something like this

<pre class="prettyprint"><code class="language-rb">conf_file = ::File.join(node['jenkins']['master']['home'], 'config.xml')

xpath_upsert ::File.join(node['jenkins']['master']['home'], 'config.xml') do
  file    conf_file
  values(
    '/hudson/securityRealm/clientID' => 'abc123'
  )
end
</code></pre>

However, doing so only works for cases in which we're setting `<node>.content`,
which is Nokogiri's attribute for raw string content between opening and
closing XML tags.
It works for the GitHub client ID because the xml looks like this:

<pre class="prettyprint"><code class="language-xml">&lt;hudson&gt;
  &lt;securityRealm&gt;
    &lt;clientID&gt;abc123&lt;/clientID&gt;
  &lt;/securityRealm&gt;
&lt;/hudson&gt;
</code></pre>

But XML encodings of hashes, lists, sets, and other structures could have very
different representations.
Importantly, more sophisticated structures have much more sophisticated
equivalence checks.
An `xpath_upsert` resource might work for setting content on explicitly
designated elements, but what about setting values for something like this?

<pre class="prettyprint"><code class="language-xml">&lt;hudson&gt;
  &lt;authorizationStrategy&gt;
    &lt;rootACL&gt;
      &lt;adminUserNameList&gt;
        &lt;string&gt;alice&lt;/string&gt;
        &lt;string&gt;eve&lt;/string&gt;
        &lt;string&gt;bob&lt;/string&gt;
      &lt;/adminUserNameList&gt;
    &lt;/rootACL&gt;
  &lt;/authorizationStrategy&gt;
&lt;/hudson&gt;
</code></pre>

When we look at controlling these values with a raw `ruby_block` resource
(which is the solution I opted for), the difficulty becomes clear.

<pre class="prettyprint"><code class="language-rb">admins_xpath = '/hudson/authorizationStrategy/rootACL/adminUserNameList'
admins = []
search('users',
       'groups:jenkinsadmin NOT action:remove') do |user|
  name = user['github_username']
  if name
    admins << name
  end
end

conf_file = ::File.join(node['jenkins']['master']['home'], 'config.xml')
ruby_block "update #{conf_file}" do
  block do
    require 'nokogiri'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }

    admin_list_node = xml_object.at_xpath(admin_list_xpath)
    # clear the admin list
    admin_list_node.children.each do |child|
      child.remove
    end

    # synthesize and inject new nodes
    admins.each do |admin_name|
      newnode = Nokogiri::XML::Node.new('string', xml_object)
      newnode.content = admin_name
      admin_list_node.add_child(newnode)
    end

    File.write(conf_file, xml_object.to_xml)
  end
  not_if do
    require 'nokogiri'
    require 'set'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }
    admin_nodes = xml_object.at_xpath(admin_list_xpath).children
    observed_admins = Set.new(
      admin_nodes.collect { |node|
        node.content
      }
    )

    next Set.new(admins) == observed_admins
  end
end
</code></pre>

Because the check relies on the semantics of the XML data, not just its
structure -- i.e. the children of the `adminUserNameList` are a set, not an
ordered list -- it's difficult to encode the check and replacement logic in a
meaningful way that an `xpath_upsert` style resource could handle.
In fact, it's possible to construct (in some cases convoluted) examples to show
that it is impossible to do so without eventually passing blocks to the
`xpath_upsert`.
At that point, all we're really doing is saving ourselves a few
`require 'nokogiri'` directives, and it's not really worth creating an LWRP
just for that.

Ultimately, the code below is, modulo a few small details, what we're running,
and its been working well.
Jenkins doesn't munge this data, and it doesn't damage the running Jenkins
server.
It may not be the most elegant solution, but you've got to love that Chef even
lets me do this.

<pre class="prettyprint linenums"><code class="language-rb"># install nokogiri for XML editing capabilities
# we need to load and traverse the Jenkins config to modify specific elements
# in this recipe, and nokogiri will serve as our XPath bindings and XML
# transformation tool
chef_gem "nokogiri" do
  action        :install
  compile_time  true
end


# Jenkins main config file
conf_file = ::File.join(node['jenkins']['master']['home'], 'config.xml')

# xpath expressions to fetch/set various parameters
admins_xpath = '/hudson/authorizationStrategy/rootACL/adminUserNameList'
github_client_id_xpath = '/hudson/securityRealm/clientID'
github_client_secret_xpath = '/hudson/securityRealm/clientSecret'

# hiding the actual way we handle these credentials, sorry folks, but I'm
# paranoid
github_client_id = 'abc123'
github_client_secret = 'def456'

# load admin usernames from the users data bag
# aware that "Data Bags Are A Code Smell" (https://coderanger.net/data-bags/),
# but replacing this is not yet high priority
admins = []
search('users',
       'groups:jenkinsadmin NOT action:remove') do |user|
  name = user['github_username']
  if name
    admins << name
  end
end


# giant crazy ruby block because we can't template the whole config file
ruby_block "update #{conf_file}" do
  block do
    require 'nokogiri'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }

    admin_list_node = xml_object.at_xpath(admin_list_xpath)
    # clear the admin list
    admin_list_node.children.each do |child|
      child.remove
    end

    # synthesize and inject new nodes
    admins.each do |admin_name|
      newnode = Nokogiri::XML::Node.new('string', xml_object)
      newnode.content = admin_name
      admin_list_node.add_child(newnode)
    end

    # github client ID and secret can just be edited in-place
    github_client_id_node = xml_object.at_xpath(github_client_id_xpath)
    github_client_id_node.content = github_client_id
    github_client_secret_node = xml_object.at_xpath(github_client_secret_xpath)
    github_client_secret_node.content = github_client_secret

    File.write(conf_file, xml_object.to_xml)
  end
  not_if do
    require 'nokogiri'
    require 'set'
    xml_object = File.open(conf_file) { |f| Nokogiri::XML(f) }

    # compare admin usernames
    admin_nodes = xml_object.at_xpath(admin_list_xpath).children
    observed_admins = Set.new(
      admin_nodes.collect { |node|
        node.content
      }
    )

    if Set.new(admins) != observed_admins
      next false
    end

    # compare github client ID
    github_client_id_node = xml_object.at_xpath(github_client_id_xpath)
    if github_client_id_node.content != github_client_id
      next false
    end

    # compare github client secret
    github_client_secret_node = xml_object.at_xpath(github_client_secret_xpath)
    if github_client_secret_node.content != github_client_secret
      next false
    end

    next true
  end

  notifies :restart, 'service[jenkins]'
end
</code></pre>

It's cool!
It works!
It's definitely gross.

/* highlight with HighlightJS */
hljs.highlightAll();

/* on-load customization; mark images as fluid */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#main-content img').forEach(function(elem) {
      elem.classList.add("img-fluid");
  });
});

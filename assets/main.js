/* highlight with HighlightJS */
hljs.highlightAll();

function setColorSchemeCallback() {
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.getElementById("hljs-css-link").href = "/assets/hljs/theme-light.min.css";
    } else {
      document.getElementById("hljs-css-link").href = "/assets/hljs/theme-dark.min.css";
    }
  }
}

/* on-load customization */
document.addEventListener('DOMContentLoaded', function() {
  // if we can detect light-mode, switch out hljs theme
  if (window.matchMedia) {
    setColorSchemeCallback();
    var prefQuery = window.matchMedia('(prefers-color-scheme: light)');
    prefQuery.addEventListener("change", setColorSchemeCallback);
  }
});

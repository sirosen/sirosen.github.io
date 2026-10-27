/* highlight with HighlightJS */
hljs.highlightAll();

/*
 * color theme: "auto" follows the system preference, "light" and "dark" force
 * a theme via data-theme on <html> (see styles.scss)
 */
var THEMES = ["auto", "light", "dark"];
var THEME_LABELS = {
  auto: "◐",
  light: "☀︎",
  dark: "☾",
};
// media queries for the hljs theme <link>s; "auto" matches header.html
var HLJS_MEDIA = {
  auto: {dark: "screen and (prefers-color-scheme: dark)", light: "print, (prefers-color-scheme: light)"},
  light: {dark: "not all", light: "all"},
  dark: {dark: "screen", light: "print"},
};

// localStorage can throw in some privacy modes, so fall back to "auto"
function getStoredTheme() {
  try {
    var theme = localStorage.getItem("theme");
    return THEMES.indexOf(theme) >= 0 ? theme : "auto";
  } catch (e) {
    return "auto";
  }
}

function storeTheme(theme) {
  try {
    if (theme === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", theme);
    }
  } catch (e) {}
}

function applyTheme(theme) {
  var root = document.documentElement;
  if (theme === "auto") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = theme;
  }
  document.getElementById("hljs-dark").media = HLJS_MEDIA[theme].dark;
  document.getElementById("hljs-light").media = HLJS_MEDIA[theme].light;
}

function labelThemeToggle(button, theme) {
  button.textContent = THEME_LABELS[theme];
  button.setAttribute("aria-label", "Color theme: " + theme);
}

// this script loads in <head>, so the stored theme applies before first paint
var currentTheme = getStoredTheme();
applyTheme(currentTheme);

document.addEventListener("DOMContentLoaded", function() {
  var button = document.getElementById("theme-toggle");
  labelThemeToggle(button, currentTheme);
  button.hidden = false;

  button.addEventListener("click", function() {
    currentTheme = THEMES[(THEMES.indexOf(currentTheme) + 1) % THEMES.length];
    storeTheme(currentTheme);
    applyTheme(currentTheme);
    labelThemeToggle(button, currentTheme);
  });
});

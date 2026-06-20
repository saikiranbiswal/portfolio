(function () {
  "use strict";

  var storageKey = "portfolio.theme";
  var root = document.documentElement;

  function currentTheme() {
    return root.dataset.theme === "light" ? "light" : "dark";
  }

  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      var next = theme === "dark" ? "light" : "dark";
      button.setAttribute("aria-label", "Switch to " + next + " theme");
      button.setAttribute("title", "Switch to " + next + " theme");
      button.querySelector("span").textContent = theme === "dark" ? "Dark" : "Light";
    }
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme: theme } }));
  }

  function save(theme) {
    try { localStorage.setItem(storageKey, theme); } catch (error) { /* private mode */ }
  }

  function mount() {
    if (document.querySelector("[data-theme-toggle]")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.setAttribute("data-theme-toggle", "");
    button.innerHTML = '<span>Dark</span><i aria-hidden="true"></i>';
    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      save(next);
      apply(next);
    });
    document.body.appendChild(button);
    apply(currentTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
}());

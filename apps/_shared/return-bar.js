/* Return-to-portfolio pill for full-page prototype visits (audit F-A2).
   Inside the Work-page modal the iframe already has its own bar, so the
   pill only renders when the app is the top-level document. */
(function () {
  "use strict";
  if (window.self !== window.top) return;
  if (new URLSearchParams(window.location.search).has("screenshot")) return;
  var a = document.createElement("a");
  a.href = "../../universe.html";
  a.textContent = "← Portfolio";
  a.setAttribute("aria-label", "Back to Sai Kiran Biswal's portfolio");
  a.style.cssText = [
    "position:fixed", "left:14px", "bottom:14px", "z-index:99999",
    "font:500 11px/1 'IBM Plex Mono',ui-monospace,monospace",
    "letter-spacing:.08em", "text-transform:uppercase",
    "color:#f3efe7", "background:#1c1815",
    "border:1px solid rgba(243,239,231,.25)", "border-radius:100px",
    "padding:9px 14px", "text-decoration:none",
    "box-shadow:0 2px 10px rgba(0,0,0,.25)", "opacity:.92"
  ].join(";");
  a.onmouseenter = function () { a.style.opacity = "1"; };
  a.onmouseleave = function () { a.style.opacity = ".92"; };
  function mount() { document.body.appendChild(a); }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();

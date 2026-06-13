/* =========================================================
   inline-editor.js — Visual Inline Editor (CloudPort v3, portfolio)

   Turns a live-rendered public page into a click-to-edit surface, but ONLY
   when it is opened inside the admin's Visual editor pane:
     ?edit=1  AND  window.parent !== window  (running in the admin iframe)

   On the normal live site there is no ?edit=1, so this script is completely
   inert — it wires nothing, changes no DOM, exposes no token, and cannot publish.

   It does NOT save anything itself. Each edit is posted to the admin parent,
   which maps it onto the in-memory content model and into a draft. The admin
   is the only thing that talks to GitHub.

   Editable nodes are tagged by the renderers with:
     data-cms-path="<model-relative path>"     e.g. meta.hero.heading
                                                projects[id=collections-cloud].name
     data-cms-image (+ data-cms-dir="assets/…") on image placeholders
   The model name comes from <body data-cms-model="products|about|contact|labs">.
   ========================================================= */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var inIframe = (function () { try { return window.parent && window.parent !== window; } catch (e) { return false; } })();
  if (params.get("edit") !== "1" || !inIframe) return; // inert on the live site

  /* Read lazily: renderers set data-cms-model during their async hydrate, which
     may run after this script boots. */
  function currentModel() { return document.body.getAttribute("data-cms-model") || null; }

  function post(msg) {
    msg.model = currentModel();
    try { window.parent.postMessage(msg, location.origin); } catch (e) { /* ignore */ }
  }

  function injectStyle() {
    if (document.getElementById("cms-ie-style")) return;
    var s = document.createElement("style");
    s.id = "cms-ie-style";
    s.textContent =
      "[data-cms-path]{outline:1px dashed transparent;outline-offset:3px;border-radius:3px;transition:outline-color .12s,background .12s;cursor:text;}" +
      "[data-cms-path]:hover{outline-color:#b35c2e;background:rgba(179,92,46,.06);}" +
      "[data-cms-path][data-cms-image]{cursor:pointer;}" +
      "[data-cms-path].cms-ie-active{outline:2px solid #b35c2e;background:rgba(179,92,46,.08);}" +
      "[data-cms-path][data-cms-image]:hover{outline-color:#b35c2e;box-shadow:0 0 0 2px rgba(179,92,46,.25) inset;}" +
      ".cms-ie-badge{position:fixed;left:12px;bottom:12px;z-index:99999;font:600 11px/1 ui-monospace,Menlo,monospace;" +
        "letter-spacing:.04em;color:#fff;background:#b35c2e;padding:7px 11px;border-radius:999px;box-shadow:0 6px 18px rgba(88,58,33,.25);}";
    document.head.appendChild(s);
  }

  function badge() {
    if (document.querySelector(".cms-ie-badge")) return;
    var b = document.createElement("div");
    b.className = "cms-ie-badge";
    b.textContent = "✎ Visual edit mode — click text or images";
    document.body.appendChild(b);
  }

  /* A field is multi-line/rich if the renderer marked it so; default single-line. */
  function isMultiline(el) { return el.hasAttribute("data-cms-multiline"); }

  function wireText(el) {
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "false");
    /* Many editable nodes live inside <a> rows — clicking should edit, not navigate. */
    el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); });
    el.addEventListener("focus", function () { el.classList.add("cms-ie-active"); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !isMultiline(el)) { e.preventDefault(); el.blur(); }
    });
    el.addEventListener("blur", function () {
      el.classList.remove("cms-ie-active");
      post({ type: "cms-edit", path: el.getAttribute("data-cms-path"), value: el.innerText.replace(/ /g, " ").trim() });
    });
  }

  function wireImage(el) {
    el.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      post({ type: "cms-edit-image", path: el.getAttribute("data-cms-path"), dir: el.getAttribute("data-cms-dir") || "assets/sections" });
    }, true);
  }

  function wireAll() {
    var nodes = document.querySelectorAll("[data-cms-path]");
    nodes.forEach(function (el) {
      if (el.__cmsWired) return;
      el.__cmsWired = true;
      if (el.hasAttribute("data-cms-image")) wireImage(el);
      else wireText(el);
    });
    post({ type: "cms-ready", count: nodes.length });
  }

  function boot() {
    injectStyle();
    badge();
    wireAll();
    /* Renderers hydrate asynchronously; re-wire as nodes appear. */
    var mo = new MutationObserver(function () { wireAll(); });
    mo.observe(document.body, { childList: true, subtree: true });
    /* Parent can ask us to re-scan after an image swap / reload. */
    window.addEventListener("message", function (e) {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.type === "cms-rescan") wireAll();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}());

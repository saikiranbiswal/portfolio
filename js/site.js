/* =========================================================
   site.js — public showcase logic
   Loads products.json, renders flagship + work grid, wires modal.
   No admin UI here; admin is isolated in admin.html.
   ========================================================= */
(function () {
  "use strict";

  // Embedded fallback so the page still works when opened via file://
  // (browsers block fetch() of local JSON). The admin panel exports a fresh
  // products.json that you paste over the file; this fallback is only a safety net.
  window.__PRODUCTS_FALLBACK__ = null;

  function isPreview() { return new URLSearchParams(location.search).get("preview") === "1"; }
  function injectPreviewBanner() {
    if (!isPreview()) return;
    var b = document.createElement("div");
    b.setAttribute("style","position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;color:#fff;padding:10px 20px;font-size:13px;display:flex;justify-content:space-between;align-items:center;z-index:9999;font-family:monospace;letter-spacing:.04em;");
    b.innerHTML = '<span>📋 PREVIEW — unpublished draft</span><a href="' + location.pathname + '" style="color:#a8d8a8;text-decoration:underline;">Exit preview</a>';
    document.body.appendChild(b);
  }
  async function loadProducts() {
    if (isPreview()) {
      try { var d = localStorage.getItem("cms_preview_products"); if (d) return JSON.parse(d); } catch(e) {}
    }
    try {
      const res = await fetch("products.json", { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (e) { /* file:// or offline */ }
    if (window.__PRODUCTS_FALLBACK__) return window.__PRODUCTS_FALLBACK__;
    throw new Error("Could not load products.json. If testing locally, run a local server (see README) or use the embedded fallback.");
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  function hydrateChrome(meta) {
    /* Replace static nav / cta-band / footer with SCFG-rendered versions
       so products.html is driven by site.json just like the SPAs. */
    const nav = document.querySelector("nav.nav");
    if (nav) nav.outerHTML = SCFG.nav("Work", "products.html", meta);
    const cta = document.querySelector("section.cta-band");
    if (cta) cta.outerHTML = SCFG.ctaBand();
    const ft = document.querySelector("footer.footer");
    if (ft) ft.outerHTML = SCFG.footer(meta);
  }

  function cardShot(p) {
    // Graceful: try the screenshot, fall back to the design's placeholder block.
    return '<img class="shot" src="' + esc(p.screenshot) + '" alt="" ' +
      'onerror="this.outerHTML=\'<span class=&quot;shot&quot; style=&quot;background:var(--paper-2)&quot;></span>\'">';
  }

  // Full-bleed hero image for the flagship card; falls back to the placeholder
  // label block when the featured project has no screenshot set.
  function heroShot(p) {
    var label = esc(p.name.toLowerCase()) + ' — product hero';
    if (!p.screenshot) return '<span class="ph-label">' + label + '</span>';
    return '<img src="' + esc(p.screenshot) + '" alt="" ' +
      'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center" ' +
      'onerror="this.outerHTML=\'<span class=&quot;ph-label&quot;>' + label + '</span>\'">';
  }

  function workRow(p, i, showRole) {
    const mode = p.displayMode || "modal";
    return '' +
      '<a class="work-row" href="#" data-launch="' + esc(p.id) + '" data-mode="' + esc(mode) + '">' +
        '<span class="idx">' + pad(i + 1) + '</span>' +
        '<span class="titles">' +
          '<span class="t">' + esc(p.name) + '</span>' +
          '<span class="d">' + esc(p.description) + '</span>' +
        '</span>' +
        '<span class="meta">' +
          (p.screenshot ? cardShot(p) : '') +
          '<span class="cat">' + esc((p.tags || []).slice(0, 2).join(" · ")) +
            (showRole && p.role ? ' · ' + esc(p.role) : '') + '</span>' +
        '</span>' +
        '<span class="go">' + (mode === "modal" ? "↗" : "→") + '</span>' +
      '</a>';
  }

  function flagshipHTML(p, flip) {
    // Flagships with a caseStudy link straight to the interactive case study;
    // the live app stays one click away inside it.
    const open = p.caseStudy
      ? '<a href="' + esc(p.caseStudy) + '" class="flagship reveal' + (flip ? ' flip' : '') + '">'
      : '<a href="#" class="flagship reveal' + (flip ? ' flip' : '') + '" data-launch="' + esc(p.id) + '" data-mode="' + esc(p.displayMode || "page") + '">';
    return open +
        '<div>' +
          '<div class="tag-row">' +
            (p.tags || []).slice(0, 3).map(t => '<span class="pill">' + esc(t) + '</span>').join("") +
            '<span class="pill pill-int">▸ Interactive</span>' +
          '</div>' +
          '<h3 class="display">' + esc(p.name) + '</h3>' +
          '<p class="body-text">' + esc(p.description) + '</p>' +
          '<div style="margin-top:26px;" class="btn">' +
            (p.caseStudy ? 'Walk the case study' : 'View the full story') +
            ' <span class="arrow">→</span></div>' +
        '</div>' +
        '<div class="flag-img-col">' +
          '<div class="ph">' + heroShot(p) + '</div>' +
          '<p class="figcap" style="margin-top:10px;">FIG. 0' + (flip ? '2' : '1') + ' — ' + esc(p.name.toUpperCase()) + ' · FLAGSHIP CASE STUDY</p>' +
        '</div>' +
      '</a>';
  }
  function flagshipSection(featured) {
    return '' +
      '<div class="sec-head reveal">' +
        '<p class="eyebrow">Flagship case studies</p>' +
        '<span class="count">' + featured.length + ' products, problem → prototype</span>' +
      '</div>' +
      '<div class="flag-stack">' +
        featured.map((p, i) => flagshipHTML(p, i % 2 === 1)).join("") +
      '</div>';
  }

  // ---- Modal ----
  function openModal(p) {
    const modal = document.getElementById("app-modal");
    if (!modal) { window.open(p.path + "index.html", "_blank"); return; }
    document.getElementById("modal-title").textContent = p.name;
    const full = document.getElementById("modal-fullpage");
    full.href = p.path + "index.html";
    const frame = document.getElementById("modal-frame");
    frame.src = p.path + "index.html";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    const modal = document.getElementById("app-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.getElementById("modal-frame").src = "about:blank";
    document.body.style.overflow = "";
  }
  function wireModal(byId) {
    const modal = document.getElementById("app-modal");
    if (modal) {
      modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) closeModal(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
    }
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-launch]");
      if (!a) return;
      e.preventDefault();
      const p = byId[a.getAttribute("data-launch")];
      if (!p) return;
      const mode = a.getAttribute("data-mode") || p.displayMode || "modal";
      if (mode === "modal") openModal(p);
      else if (mode === "link") window.open(p.path + "index.html", "_blank");
      else window.location.href = p.path + "index.html"; // dedicated page
    });
  }

  window.renderShowcase = async function () {
    let data;
    try { data = await loadProducts(); }
    catch (err) {
      const list = document.getElementById("work-list");
      if (list) list.innerHTML = '<p class="body-text" style="padding:24px 0;">' + esc(err.message) + '</p>';
      return;
    }
    hydrateChrome(data.meta || {});
    const byId = {};
    (data.projects || []).forEach(p => { byId[p.id] = p; });

    const showRole = !!(data.meta && data.meta.showRoleOnCards);
    let featured = (data.projects || []).filter(p => p.featured && !p.hidden);
    if (!featured.length) featured = (data.projects || []).filter(p => !p.hidden).slice(0, 1);
    const rest = (data.projects || []).filter(p => !p.hidden && featured.indexOf(p) === -1);

    const fsec = document.getElementById("flagship-section");
    if (fsec && featured.length) fsec.innerHTML = flagshipSection(featured);

    const list = document.getElementById("work-list");
    if (list) list.innerHTML = rest.map((p, i) => workRow(p, i, showRole)).join("");

    const cnt = document.getElementById("work-count");
    if (cnt) cnt.textContent = rest.length + " more working products across lending, banking & AI";

    wireModal(byId);
    if (window.__reveal) window.__reveal();
    injectPreviewBanner();
  };
})();

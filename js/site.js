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

  async function loadProducts() {
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
    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set("wm-name", meta.owner);
    set("wm-role", meta.role);
    set("wm-glyph", meta.glyph || (meta.owner || "S")[0]);
    set("wm-status", meta.status);
    set("f-copy", "© 2026 " + meta.owner + " — Product Portfolio");
    const li = document.getElementById("f-linkedin"); if (li) li.href = meta.linkedin || "#";
    const em = document.getElementById("f-email"); if (em) em.href = "mailto:" + (meta.email || "");
    const rz = document.getElementById("f-resume"); if (rz) rz.href = meta.resume || "assets/resume.pdf";
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
      'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" ' +
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
          '<span class="go">' + (mode === "modal" ? "↗" : "→") + '</span>' +
        '</span>' +
      '</a>';
  }

  function flagshipHTML(p) {
    return '' +
      '<div class="sec-head reveal">' +
        '<p class="eyebrow">Flagship case study</p>' +
        '<span class="count">' + esc(p.year || "") + '</span>' +
      '</div>' +
      '<a href="#" class="flagship reveal" data-launch="' + esc(p.id) + '" data-mode="' + esc(p.displayMode || "page") + '">' +
        '<div>' +
          '<div class="tag-row">' +
            (p.tags || []).slice(0, 3).map(t => '<span class="pill">' + esc(t) + '</span>').join("") +
          '</div>' +
          '<h3 class="display">' + esc(p.name) + '</h3>' +
          '<p class="body-text">' + esc(p.description) + '</p>' +
          '<div style="margin-top:26px;" class="btn">View the full story <span class="arrow">→</span></div>' +
        '</div>' +
        '<div class="ph">' + heroShot(p) + '</div>' +
      '</a>';
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
    const featured = (data.projects || []).find(p => p.featured) || (data.projects || [])[0];
    const rest = (data.projects || []).filter(p => p !== featured);

    const fsec = document.getElementById("flagship-section");
    if (fsec && featured) fsec.innerHTML = flagshipHTML(featured);

    const list = document.getElementById("work-list");
    if (list) list.innerHTML = rest.map((p, i) => workRow(p, i, showRole)).join("");

    const cnt = document.getElementById("work-count");
    if (cnt) cnt.textContent = (data.projects || []).length + " projects across lending, banking & AI";

    wireModal(byId);
    if (window.__reveal) window.__reveal();
  };
})();

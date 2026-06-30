/* =========================================================
   site.js, public showcase logic
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
    if (window.PreviewData) return window.PreviewData.load("products", "content/products.json");
    try {
      const res = await fetch("content/products.json", { cache: "no-store" });
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

  function mark(el, path, opts) {
    if (!el) return el;
    el.setAttribute("data-cms-path", path);
    if (opts && opts.multiline) el.setAttribute("data-cms-multiline", "");
    if (opts && opts.image) { el.setAttribute("data-cms-image", ""); el.setAttribute("data-cms-dir", opts.dir || "assets/sections"); }
    return el;
  }

  function hydrateHero(meta) {
    var h = meta && meta.hero;
    if (!h) return;
    var heroEl = document.querySelector("header.hero");
    if (!heroEl) return;
    var eyebrow = heroEl.querySelector("p.eyebrow");
    if (eyebrow && h.eyebrow != null) {
      eyebrow.innerHTML = esc(h.eyebrow).replace(/·/g, '<span class="dot">·</span>');
      mark(eyebrow, "meta.hero.eyebrow");
    }
    var h1 = heroEl.querySelector("h1.display");
    if (h1 && h.heading != null) {
      h1.innerHTML = String(h.heading).split("\n").filter(Boolean).map(function (line) {
        return '<span class="line"><span>' + line + '</span></span>';
      }).join("");
      mark(h1, "meta.hero.heading", { multiline: true });
    }
    var lead = heroEl.querySelector("p.lead");
    if (lead && h.lead != null) { lead.textContent = h.lead; mark(lead, "meta.hero.lead", { multiline: true }); }
    if (h.stats) {
      var statEls = heroEl.querySelectorAll(".stat");
      h.stats.forEach(function (s, i) {
        if (!statEls[i]) return;
        var numEl = statEls[i].querySelector(".count-num");
        if (numEl) { numEl.setAttribute("data-target", s.n); numEl.textContent = s.n; mark(numEl, "meta.hero.stats." + i + ".n"); }
        var lEl = statEls[i].querySelector(".l");
        if (lEl) { lEl.textContent = s.l; mark(lEl, "meta.hero.stats." + i + ".l"); }
      });
    }
    var col = heroEl.querySelector("p.colophon");
    if (col && h.colophon != null) { col.textContent = h.colophon; mark(col, "meta.hero.colophon"); }
  }

  function hydrateChrome(meta) {
    /* Replace static nav / cta-band / footer with SCFG-rendered versions
       so products.html is driven by site.json just like the SPAs. */
    const nav = document.querySelector("nav.nav");
    if (nav) nav.outerHTML = SCFG.nav("Work", "index.html", meta);
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
    var label = esc(p.name.toLowerCase()) + ', product hero';
    if (!p.screenshot) return '<span class="ph-label">' + label + '</span>';
    return '<img src="' + esc(p.screenshot) + '" alt="" ' +
      'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center" ' +
      'onerror="this.outerHTML=\'<span class=&quot;ph-label&quot;>' + label + '</span>\'">';
  }

  function workRow(p, i, showRole) {
    // rows open the phantom-style project page; the live app launches from there
    return '' +
      '<a class="work-row" href="project.html?id=' + esc(p.id) + '">' +
        '<span class="idx">' + pad(i + 1) + '</span>' +
        '<span class="titles">' +
          '<span class="t" data-cms-path="projects[id=' + esc(p.id) + '].name">' + esc(p.name) + '</span>' +
          '<span class="d" data-cms-path="projects[id=' + esc(p.id) + '].description" data-cms-multiline>' + esc(p.description) + '</span>' +
        '</span>' +
        '<span class="meta">' +
          (p.screenshot ? cardShot(p) : '') +
          '<span class="cat">' + esc((p.tags || []).slice(0, 2).join(" · ")) +
            (showRole && p.role ? ' · ' + esc(p.role) : '') + '</span>' +
        '</span>' +
        '<span class="go">→</span>' +
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
          '<h3 class="display" data-cms-path="projects[id=' + esc(p.id) + '].name">' + esc(p.name) + '</h3>' +
          '<p class="body-text" data-cms-path="projects[id=' + esc(p.id) + '].description" data-cms-multiline>' + esc(p.description) + '</p>' +
          '<div style="margin-top:26px;" class="btn">' +
            (p.caseStudy ? 'Walk the case study' : 'View the full story') +
            ' <span class="arrow">→</span></div>' +
        '</div>' +
        '<div class="flag-img-col">' +
          '<div class="ph" data-cms-path="projects[id=' + esc(p.id) + '].screenshot" data-cms-image data-cms-dir="assets/screenshots">' + heroShot(p) + '</div>' +
          '<p class="figcap" style="margin-top:10px;">FIG. 0' + (flip ? '2' : '1') + ', ' + esc(p.name.toUpperCase()) + ' · FLAGSHIP CASE STUDY</p>' +
        '</div>' +
      '</a>';
  }
  function flagshipSection(featured) {
    return '' +
      '<div class="sec-head reveal">' +
        '<p class="eyebrow">Flagship case study</p>' +
        '<span class="count">' + (featured.length > 1 ? featured.length + ' products, problem → prototype' : 'Problem → domain → AI → MVP → metrics') + '</span>' +
      '</div>' +
      '<div class="flag-stack">' +
        featured.map((p, i) => flagshipHTML(p, i % 2 === 1)).join("") +
      '</div>';
  }

  // Tier 2 supporting card: a case study / interactive prototype, one click deep.
  function supportingCard(p) {
    var href, cta, launch = "";
    if (p.caseStudy) { href = esc(p.caseStudy); cta = "Read the case study"; }
    else { href = "project.html?id=" + esc(p.id); cta = "Open the project"; }
    return '' +
      '<a class="support-card reveal" href="' + href + '"' + launch + '>' +
        '<div class="support-shot ph" data-cms-path="projects[id=' + esc(p.id) + '].screenshot" data-cms-image data-cms-dir="assets/screenshots">' +
          heroShot(p) +
        '</div>' +
        '<div class="support-body">' +
          '<div class="tag-row">' +
            (p.tags || []).slice(0, 3).map(function (t) { return '<span class="pill">' + esc(t) + '</span>'; }).join("") +
          '</div>' +
          '<h3 data-cms-path="projects[id=' + esc(p.id) + '].name">' + esc(p.name) + '</h3>' +
          '<p class="body-text" data-cms-path="projects[id=' + esc(p.id) + '].description" data-cms-multiline>' + esc(p.description) + '</p>' +
          '<span class="support-cta">' + cta + ' <span class="arrow">→</span></span>' +
        '</div>' +
      '</a>';
  }
  function supportingSection(supporting) {
    return '' +
      '<div class="sec-head reveal">' +
        '<p class="eyebrow">Supporting proof</p>' +
        '<span class="count">Case study &amp; interactive prototype</span>' +
      '</div>' +
      '<div class="support-grid">' +
        supporting.map(supportingCard).join("") +
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
    document.body.setAttribute("data-cms-model", "products");
    if (window.SCFG && SCFG.ready) await SCFG.ready;
    let data;
    try { data = await loadProducts(); }
    catch (err) {
      const list = document.getElementById("work-list");
      if (list) list.innerHTML = '<p class="body-text" style="padding:24px 0;">' + esc(err.message) + '</p>';
      return;
    }
    hydrateChrome(data.meta || {});
    hydrateHero(data.meta || {});
    const byId = {};
    (data.projects || []).forEach(p => { byId[p.id] = p; });

    const showRole = !!(data.meta && data.meta.showRoleOnCards);
    const live = (data.projects || []).filter(p => !p.hidden);

    // Three explicit tiers. Tier defaults keep older data working:
    // featured → 1 (flagship), a case study → 2 (supporting), else → 3 (also built).
    function tierOf(p) {
      if (p.tier) return p.tier;
      if (p.featured) return 1;
      if (p.caseStudy) return 2;
      return 3;
    }
    let featured = live.filter(p => tierOf(p) === 1);
    if (!featured.length) featured = live.slice(0, 1);
    const supporting = live.filter(p => tierOf(p) === 2 && featured.indexOf(p) === -1);
    const rest = live.filter(p => featured.indexOf(p) === -1 && supporting.indexOf(p) === -1);

    const fsec = document.getElementById("flagship-section");
    if (fsec && featured.length) fsec.innerHTML = flagshipSection(featured);

    const ssec = document.getElementById("supporting-section");
    if (ssec) ssec.innerHTML = supporting.length ? supportingSection(supporting) : "";

    const list = document.getElementById("work-list");
    if (list) list.innerHTML = rest.map((p, i) => workRow(p, i, showRole)).join("");

    const cnt = document.getElementById("work-count");
    if (cnt) {
      const suffix = (data.meta && data.meta.hero && data.meta.hero.workCountSuffix) || "more working products";
      cnt.textContent = rest.length + " " + suffix;
    }

    wireModal(byId);
    if (window.__reveal) window.__reveal();
    if (window.PreviewData) PreviewData.banner();
  };
})();

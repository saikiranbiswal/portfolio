/* =========================================================
   Labs — app: hash router, view rendering, inline editing,
   and localStorage persistence. Vanilla JS so contentEditable
   stays rock-solid (no framework re-renders fighting the caret).
   ========================================================= */
(function () {
  "use strict";

  var KEY = "labs.model.v3";
  var EDIT_KEY = "labs.editing.v1";

  /* ---- model load / save ---- */
  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
  // Default to the bundled seed; boot() (bottom of file) replaces this with the
  // published labs.json — authoritative each visit — when served over http,
  // falling back to a local draft / the seed for file:// use.
  var model = deepClone(window.LABS_SEED || { meta: {}, labs: [] });

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(model)); } catch (e) {}
    }, 200);
  }

  /* ---- path get/set into the model ---- */
  function getPath(p) {
    var parts = p.split("."), cur = model;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function setPath(p, val) {
    var parts = p.split("."), cur = model;
    for (var i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = val;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /* editable span/heading. tag = element tag, path = model path, cls = classes */
  function ed(tag, path, cls, extra) {
    var v = getPath(path);
    return "<" + tag + ' class="' + (cls || "") + '" data-edit data-path="' + path + '"' +
      (extra || "") + ">" + esc(v) + "</" + tag + ">";
  }

  function labById(id) {
    for (var i = 0; i < model.labs.length; i++) if (model.labs[i].id === id) return { lab: model.labs[i], i: i };
    return null;
  }
  function prodById(lab, pid) {
    for (var j = 0; j < lab.products.length; j++) if (lab.products[j].id === pid) return { p: lab.products[j], j: j };
    return null;
  }
  function pad(n) { return String(n + 1).padStart(2, "0"); }

  /* =====================================================
     NAV + FOOTER (shared chrome)
     ===================================================== */
  function navHTML(active) {
    return '' +
    '<nav class="nav"><div class="nav-inner">' +
      '<a class="wordmark" href="#/">' +
        '<span class="glyph">a</span>' +
        '<span><span class="name">' + esc(model.meta.owner) + '</span><br>' +
        '<span class="role">' + esc(model.meta.role) + '</span></span>' +
      '</a>' +
      '<div class="nav-links">' +
        '<a href="index.html">Work</a>' +
        '<a href="#/" class="' + (active === "labs" ? "active" : "") + '">Labs</a>' +
        '<a href="about.html">About</a>' +
        '<a href="contact.html">Contact</a>' +
        '<span class="nav-status"><span class="pulse"></span> Open to lead PM roles</span>' +
      '</div>' +
    '</div></nav>';
  }
  function footerHTML() {
    return '<footer class="footer"><div class="wrap">' +
      '<p class="big">Built from <em>problem</em> to <em>platform</em> — one lab at a time.</p>' +
      '<span class="fbase">© 2026 ' + esc(model.meta.owner) + ' · Product Portfolio</span>' +
    '</div></footer>';
  }

  /* =====================================================
     LEVEL 1 — Labs index
     ===================================================== */
  function renderIndex() {
    var rows = model.labs.map(function (lab, i) {
      return '<div class="lab-row" data-nav="lab" data-lab="' + lab.id + '">' +
        '<span class="idx">' + pad(i) + '</span>' +
        '<span class="lab-main">' +
          ed("span", "labs." + i + ".name", "lab-name") +
          ed("span", "labs." + i + ".desc", "lab-desc", ' style="display:block"') +
        '</span>' +
        '<span class="lab-side">' +
          '<span class="count-chip">' + lab.products.length + ' products</span>' +
          '<span class="go">→</span>' +
        '</span>' +
      '</div>';
    }).join("");

    return '<div class="view">' + navHTML("labs") +
      '<header class="labs-hero wrap">' +
        '<p class="eyebrow">' + ed("span", "meta.eyebrow", "", "") + '</p>' +
        '<h1 class="display">' + ed("span", "meta.title", "") + '</h1>' +
        '<div class="foot">' +
          '<p class="lead">' + ed("span", "meta.intro", "") + '</p>' +
          '<div class="hero-stats" style="display:flex;gap:42px;flex-wrap:wrap">' +
            statHTML("statLabs", "statLabsLabel") +
            statHTML("statProducts", "statProductsLabel") +
            statHTML("statYears", "statYearsLabel") +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="wrap"><div class="labs-list stagger">' + rows + '</div></div>' +
      footerHTML() +
    '</div>';
  }
  function statHTML(nk, lk) {
    return '<div class="stat" style="min-width:64px">' +
      '<div class="n" style="font-family:var(--serif);font-size:clamp(28px,4vw,44px);line-height:1;letter-spacing:-.02em">' + ed("span", "meta." + nk, "") + '</div>' +
      '<div class="l" style="font-family:var(--mono);font-size:11px;color:var(--muted);letter-spacing:.06em;margin-top:8px;text-transform:uppercase">' + ed("span", "meta." + lk, "") + '</div>' +
    '</div>';
  }

  /* =====================================================
     LEVEL 2 — Lab page
     ===================================================== */
  function renderLab(labId) {
    var found = labById(labId);
    if (!found) return renderIndex();
    var lab = found.lab, i = found.i;

    var cards = lab.products.map(function (p, j) {
      var base = "labs." + i + ".products." + j;
      return '<div class="product-card" data-nav="product" data-lab="' + lab.id + '" data-prod="' + p.id + '">' +
        '<div class="ph"><span class="ph-label">' + esc(p.name.toLowerCase()) + ' — preview</span></div>' +
        '<div class="pc-tags">' + tagsHTML(base, p.tags) + '</div>' +
        ed("div", base + ".name", "pc-name") +
        ed("div", base + ".tagline", "pc-tagline") +
        '<div class="pc-foot">' +
          '<span class="pc-stage">' + ed("span", base + ".stage", "") + '</span>' +
          '<span class="pc-arrow">→</span>' +
        '</div>' +
      '</div>';
    }).join("");

    return '<div class="view">' + navHTML("labs") +
      '<div class="subhead wrap">' +
        '<button class="back-link" data-nav="index">← All labs</button>' +
        '<div class="lab-head">' +
          '<div class="lab-no">Lab ' + pad(i) + ' / ' + pad(model.labs.length - 1) + '</div>' +
          '<h1 class="display">' + ed("span", "labs." + i + ".name", "") + '</h1>' +
          '<p class="lab-blurb">' + ed("span", "labs." + i + ".blurb", "") + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="wrap"><div class="products-grid stagger">' + cards + '</div></div>' +
      footerHTML() +
    '</div>';
  }

  function tagsHTML(base, tags) {
    return tags.map(function (t, k) {
      return ed("span", base + ".tags." + k, "pill");
    }).join("");
  }

  /* =====================================================
     LEVEL 3 — Product page
     ===================================================== */
  function renderProduct(labId, prodId) {
    var f = labById(labId);
    if (!f) return renderIndex();
    var lab = f.lab, i = f.i;
    var pf = prodById(lab, prodId);
    if (!pf) return renderLab(labId);
    var p = pf.p, j = pf.j;
    var base = "labs." + i + ".products." + j;

    /* what -> paragraphs (first one reads as a lead) */
    var paras = String(p.what).split(/\n\n+/).map(function (t, k) {
      return "<p" + (k === 0 ? ' class="lead-p"' : "") + ">" + esc(t) + "</p>";
    }).join("");

    var feats = (p.features || []).map(function (fe, k) {
      return '<li>' +
        '<span class="fi">' + pad(k) + '</span>' +
        '<span class="ft">' +
          ed("strong", base + ".features." + k + ".0", "") +
          ed("span", base + ".features." + k + ".1", "", ' style="display:block"') +
        '</span>' +
      '</li>';
    }).join("");

    var nextIdx = (j + 1) % lab.products.length;
    var nextP = lab.products[nextIdx];

    return '<div class="view">' + navHTML("labs") +
      '<div class="prod wrap">' +
        '<div class="subhead" style="padding-bottom:0">' +
          '<button class="back-link" data-nav="lab" data-lab="' + lab.id + '">← ' + esc(lab.name) + '</button>' +
        '</div>' +

        '<div class="prod-head">' +
          '<div>' +
            '<div class="pt-tags">' + tagsHTML(base, p.tags) + '</div>' +
            '<h1 class="display">' + ed("span", base + ".name", "") + '</h1>' +
            '<p class="pt-tagline">' + ed("span", base + ".tagline", "") + '</p>' +
            '<div class="pt-actions">' +
              '<a class="btn" data-explore href="' + esc(p.url) + '" target="_blank" rel="noopener">Explore ' + esc(p.name) + ' <span class="arrow">→</span></a>' +
            '</div>' +
          '</div>' +
          '<div class="ph prod-cover"><span class="ph-label">' + esc(p.name.toLowerCase()) + ' — product shot</span></div>' +
        '</div>' +

        '<div class="prod-body">' +
          '<div class="prod-about">' +
            '<div class="sec-label">What it does</div>' +
            '<div data-edit data-path="' + base + '.what" data-multiline class="prod-prose">' + paras + '</div>' +
            '<ul class="feature-list">' + feats + '</ul>' +
          '</div>' +

          '<aside class="spec-card">' +
            '<div class="sc-title">At a glance</div>' +
            specRow("Role", base + ".role") +
            specRow("Year", base + ".year") +
            specRow("Stage", base + ".stage2") +
            '<div class="spec-row">' +
              '<div class="k">Stack</div>' +
              '<div class="spec-stack">' + (p.stack || []).map(function (s, k) {
                return ed("span", base + ".stack." + k, "pill");
              }).join("") + '</div>' +
            '</div>' +
            '<div class="spec-row">' +
              '<div class="k">Live at</div>' +
              ed("div", base + ".url", "v", ' style="font-family:var(--mono);font-size:13px;word-break:break-all"') +
            '</div>' +
            '<a class="btn" data-explore href="' + esc(p.url) + '" target="_blank" rel="noopener">Explore the product <span class="arrow">→</span></a>' +
          '</aside>' +
        '</div>' +

        '<div class="prod-next" data-nav="product" data-lab="' + lab.id + '" data-prod="' + nextP.id + '">' +
          '<div><div class="pn-k">Next in ' + esc(lab.name) + '</div>' +
          '<div class="pn-t">' + esc(nextP.name) + '</div></div>' +
          '<span class="go">→</span>' +
        '</div>' +
      '</div>' +
      footerHTML() +
    '</div>';
  }
  function specRow(k, path) {
    return '<div class="spec-row"><div class="k">' + esc(k) + '</div>' + ed("div", path, "v") + '</div>';
  }

  /* =====================================================
     ROUTER
     ===================================================== */
  var app = document.getElementById("app");

  function parseHash() {
    var h = (location.hash || "#/").replace(/^#/, "");
    var parts = h.split("/").filter(Boolean); // ['lab','founder'] etc
    if (parts[0] === "lab" && parts[1]) return { view: "lab", lab: parts[1] };
    if (parts[0] === "product" && parts[1] && parts[2]) return { view: "product", lab: parts[1], prod: parts[2] };
    return { view: "index" };
  }

  function render() {
    var r = parseHash(), html;
    if (r.view === "lab") html = renderLab(r.lab);
    else if (r.view === "product") html = renderProduct(r.lab, r.prod);
    else html = renderIndex();
    app.innerHTML = html;
    applyEditState();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

  /* delegated navigation (ignored when clicking editable text in edit mode) */
  app.addEventListener("click", function (e) {
    if (document.body.classList.contains("editing")) {
      if (e.target.closest('[contenteditable="true"]')) return; // editing text
    }
    if (e.target.closest("[data-explore]")) return; // external link
    var nav = e.target.closest("[data-nav]");
    if (!nav) return;
    var kind = nav.getAttribute("data-nav");
    if (kind === "index") go("#/");
    else if (kind === "lab") go("#/lab/" + nav.getAttribute("data-lab"));
    else if (kind === "product") go("#/product/" + nav.getAttribute("data-lab") + "/" + nav.getAttribute("data-prod"));
  });

  /* =====================================================
     INLINE EDITING
     ===================================================== */
  // Public Labs page is view-only; all editing now happens in the password-gated
  // admin CMS, which publishes labs.json. (Inline-edit machinery kept dormant.)
  var editing = false;

  function applyEditState() {
    document.body.classList.toggle("editing", editing);
    var nodes = app.querySelectorAll("[data-edit]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("contenteditable", editing ? "true" : "false");
    }
    var t = document.getElementById("editLabel");
    if (t) t.textContent = editing ? "Editing — click any text" : "Edit content";
  }

  /* save edits back to model */
  app.addEventListener("input", function (e) {
    var el = e.target.closest("[data-edit]");
    if (!el) return;
    var path = el.getAttribute("data-path");
    if (!path) return;
    var val = el.hasAttribute("data-multiline") ? el.innerText.replace(/\n{3,}/g, "\n\n").trim() : el.innerText;
    setPath(path, val);
    /* keep mirrored fields + explore links live */
    if (/\.url$/.test(path)) {
      var links = app.querySelectorAll("[data-explore]");
      for (var i = 0; i < links.length; i++) links[i].setAttribute("href", val);
    }
    save();
  }, true);

  /* prevent Enter from creating newlines in single-line fields */
  app.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var el = e.target.closest("[data-edit]");
    if (el && !el.hasAttribute("data-multiline")) { e.preventDefault(); el.blur(); }
  });

  /* expose a reset for convenience */
  window.LABS_RESET = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };

  /* ---- boot: load published labs.json as the source of truth ---- */
  function applyFallback() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    model = saved ? JSON.parse(saved) : deepClone(window.LABS_SEED || { meta: {}, labs: [] });
  }
  function boot() {
    fetch("labs.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.labs) { model = j; } else { applyFallback(); } })
      .catch(function () { applyFallback(); })
      .then(function () { render(); });
  }

  window.addEventListener("hashchange", render);
  boot();
})();

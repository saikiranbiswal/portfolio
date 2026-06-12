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
  // Fill a .ph placeholder with the product's uploaded image, or fall back to
  // the design's label block when no image has been set in the CMS.
  function phShot(src, label) {
    if (!src) return '<span class="ph-label">' + esc(label) + '</span>';
    return '<img src="' + esc(src) + '" alt="' + esc(label) + '" ' +
      'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" ' +
      'onerror="this.outerHTML=\'<span class=&quot;ph-label&quot;>' + esc(label) + '</span>\'">';
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
  function navHTML() { return SCFG.nav('Labs', '#/', model.meta); }
  function footerHTML() { return SCFG.footer(model.meta); }

  /* =====================================================
     LEVEL 1 — Labs index
     ===================================================== */
  function renderIndex() {
    /* Flagship labs (a single deep case-study product each) get a featured
       strip; the rest render as the classic discipline list below. */
    var flags = '', rows = '';
    model.labs.forEach(function (lab, i) {
      if (lab.flagship && lab.products[0]) {
        flags += flagCardHTML(lab, i);
      } else {
        rows += '<div class="lab-row" data-nav="lab" data-lab="' + lab.id + '">' +
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
      }
    });

    var flagSection = flags ? (
      '<div class="wrap"><div class="flag-head">' +
        '<p class="eyebrow">Flagship case studies <span class="dot">·</span> problem → prototype</p>' +
        '<span class="flag-sub">Two products, taken end to end — PRD, journey, metrics, architecture, tradeoffs, and a working prototype.</span>' +
      '</div><div class="flag-strip stagger">' + flags + '</div></div>'
    ) : '';

    var listHead = rows ? (
      '<div class="wrap">' +
        '<hr class="divider" style="margin-block:clamp(32px,5vw,56px) 0;">' +
        '<div class="flag-head" style="margin-top:clamp(24px,4vw,42px)">' +
          '<p class="eyebrow">Six discipline labs <span class="dot">·</span> how each layer gets built</p>' +
          '<span class="flag-sub">The craft behind the flagships — six labs, every layer.</span>' +
        '</div></div>'
    ) : '';

    var ctaBand = SCFG.ctaBand();

    return '<div class="view">' + navHTML() +
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
      flagSection +
      listHead +
      '<div class="wrap"><div class="labs-list stagger">' + rows + '</div></div>' +
      ctaBand +
      footerHTML() +
    '</div>';
  }

  /* Flagships with a bespoke, gamified interactive case-study page.
     When present, the flagship card opens this standalone experience instead
     of the in-SPA product view (hybrid: data still lives in labs.json). */
  var EXPERIENCE = {
    "ai-collections": "case-studies/collections-cloud.html",
    "los": "case-studies/lending-os.html"
  };

  function artOf(p, kind) {
    var list = p.artifacts || [];
    for (var k = 0; k < list.length; k++) if (list[k].kind === kind) return list[k];
    return null;
  }

  /* Built-in HTML mini-mockup of the product UI, rendered live inside the
     flagship card (no screenshot needed). Shared .fm-* classes keep both
     flagships reading as one product family. */
  function flagMock(labId) {
    var bar = function (name) {
      return '<div class="fm-bar"><i></i><i></i><i></i><span>' + esc(name) + '</span></div>';
    };
    if (labId === "ai-collections") {
      return '<div class="fm">' + bar("collections cloud") +
        '<div class="fm-body">' +
          '<div class="fm-kpis">' +
            '<div class="fm-kpi"><b>$4.8M</b><span>Recovery</span></div>' +
            '<div class="fm-kpi"><b>78%</b><span>Promise kept</span></div>' +
            '<div class="fm-kpi"><b>128</b><span>At-risk</span></div>' +
          '</div>' +
          '<div class="fm-rows">' +
            '<div class="fm-li"><span class="fm-av">NA</span><span class="fm-nm">Northwind Apparel</span><span class="fm-risk hi">High</span></div>' +
            '<div class="fm-li"><span class="fm-av">BV</span><span class="fm-nm">Brightvale Foods</span><span class="fm-risk md">Med</span></div>' +
          '</div>' +
          '<div class="fm-ai"><span class="fm-ai-tag">AI</span>Next best action · call + 2-installment plan</div>' +
        '</div></div>';
    }
    if (labId === "los") {
      return '<div class="fm">' + bar("lending cloud") +
        '<div class="fm-body">' +
          '<div class="fm-steps">' +
            '<span class="fm-step done">Apply</span><span class="fm-step done">KYC</span>' +
            '<span class="fm-step on">Decision</span><span class="fm-step">Offer</span>' +
          '</div>' +
          '<div class="fm-rows">' +
            '<div class="fm-li"><span class="fm-dot ok"></span><span class="fm-nm">KYC verified</span><span class="fm-meta">2.1s</span></div>' +
            '<div class="fm-li"><span class="fm-dot wait"></span><span class="fm-nm">Income docs</span><span class="fm-meta">1 pending</span></div>' +
          '</div>' +
          '<div class="fm-ai"><span class="fm-ai-tag">TAT</span>Approval turnaround · 4h 12m</div>' +
        '</div></div>';
    }
    return '';
  }

  /* Featured flagship card — a self-contained case study at a glance
     (live mini-mockup, problem→outcome, what it moves, artifacts), linking
     into the full case-study experience. */
  function flagCardHTML(lab, i) {
    var p = lab.products[0];
    var base = "labs." + i + ".products.0";
    var exp = EXPERIENCE[lab.id];
    var ba = artOf(p, "beforeafter");
    var m = artOf(p, "metrics");
    var arts = (p.artifacts || []).map(function (a) {
      return '<span class="flag-chip">' + esc(a.label) + '</span>';
    }).join("");
    var baHTML = ba ? (
      '<div class="flag-ba">' +
        '<div class="flag-ba-row from"><span class="flag-ba-k">From</span><p>' + esc(ba.before) + '</p></div>' +
        '<div class="flag-ba-row to"><span class="flag-ba-k">To</span><p>' + esc(ba.after) + '</p></div>' +
      '</div>'
    ) : '';
    var goalHTML = (m && m.business) ? (
      '<div class="flag-goal"><span class="flag-goal-k">What it moves</span>' +
        '<span class="flag-goal-v">' + esc(m.business) + '</span></div>'
    ) : '';
    var inner =
      '<div class="flag-mock">' + flagMock(lab.id) +
        (exp ? '<span class="flag-interactive">Interactive</span>' : '') + '</div>' +
      '<div class="flag-body">' +
        '<div class="flag-kicker">Case study · ' + esc(p.stage || "") + '</div>' +
        ed("div", "labs." + i + ".name", "flag-name") +
        ed("div", base + ".tagline", "flag-tag") +
        baHTML +
        goalHTML +
        (arts ? '<div class="flag-chips">' + arts + '</div>' : '') +
        '<div class="flag-foot"><span class="flag-cta">' +
          (exp ? 'Open the interactive case study' : 'Open the case study') +
        '</span><span class="go">→</span></div>' +
      '</div>';
    if (exp) {
      return '<a class="flag-card" href="' + exp + '" data-explore>' + inner + '</a>';
    }
    return '<div class="flag-card" data-nav="product" data-lab="' + lab.id + '" data-prod="' + p.id + '">' +
      inner + '</div>';
  }
  function statHTML(nk, lk) {
    var v = getPath("meta." + nk);
    var numStr = String(v || "").replace(/[^0-9]/g, "");
    var targetAttr = numStr ? ' data-target="' + numStr + '"' : '';
    return '<div class="stat" style="min-width:64px">' +
      '<div class="n" style="font-family:var(--serif);font-size:clamp(28px,4vw,44px);line-height:1;letter-spacing:-.02em">' + ed("span", "meta." + nk, "count-num", targetAttr) + '</div>' +
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
        '<div class="ph">' + phShot(p.image, p.name.toLowerCase() + ' — preview') + '</div>' +
        '<div class="pc-tags">' + tagsHTML(base, p.tags) + '</div>' +
        ed("div", base + ".name", "pc-name") +
        ed("div", base + ".tagline", "pc-tagline") +
        '<div class="pc-foot">' +
          '<span class="pc-stage">' + ed("span", base + ".stage", "") + '</span>' +
          '<span class="pc-arrow">→</span>' +
        '</div>' +
      '</div>';
    }).join("");

    return '<div class="view">' + navHTML() +
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

    /* "Next" — within the lab normally; for a flagship single-product lab,
       point at the other flagship case study (cross-sell), else the lab. */
    var nextLab = lab, nextP = lab.products[(j + 1) % lab.products.length];
    if (lab.flagship && lab.products.length === 1) {
      for (var fi = 0; fi < model.labs.length; fi++) {
        var ol = model.labs[fi];
        if (ol.flagship && ol.id !== lab.id && ol.products[0]) { nextLab = ol; nextP = ol.products[0]; break; }
      }
    }

    /* Flagship case studies skip the one-card lab grid — back to the index. */
    var back = lab.flagship
      ? '<button class="back-link" data-nav="index">← All labs</button>'
      : '<button class="back-link" data-nav="lab" data-lab="' + lab.id + '">← ' + esc(lab.name) + '</button>';

    return '<div class="view">' + navHTML() +
      '<div class="prod wrap">' +
        '<div class="subhead" style="padding-bottom:0">' + back + '</div>' +

        '<div class="prod-head">' +
          '<div>' +
            '<div class="pt-tags">' + tagsHTML(base, p.tags) + '</div>' +
            '<h1 class="display">' + ed("span", base + ".name", "") + '</h1>' +
            '<p class="pt-tagline">' + ed("span", base + ".tagline", "") + '</p>' +
            '<div class="pt-actions">' +
              '<a class="btn" data-explore href="' + esc(p.url) + '" target="_blank" rel="noopener">Explore ' + esc(p.name) + ' <span class="arrow">→</span></a>' +
            '</div>' +
          '</div>' +
          '<div class="ph prod-cover">' + phShot(p.image, p.name.toLowerCase() + ' — product shot') + '</div>' +
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

        caseStudyHTML(p, base) +

        '<div class="prod-next" data-nav="product" data-lab="' + nextLab.id + '" data-prod="' + nextP.id + '">' +
          '<div><div class="pn-k">' + (nextLab === lab ? 'Next in ' + esc(lab.name) : 'Next case study') + '</div>' +
          '<div class="pn-t">' + esc(nextP.name) + '</div></div>' +
          '<span class="go">→</span>' +
        '</div>' +
      '</div>' +
      footerHTML() +
    '</div>';
  }

  /* =====================================================
     CASE STUDY — Why / Users / MVP / Artifacts / Testing / Next
     Rendered only when the product carries this richer content.
     ===================================================== */
  function caseStudyHTML(p, base) {
    var blocks = "";

    if (p.why) {
      blocks += csSection("Why it matters", "01",
        '<p class="cs-lead">' + esc(p.why) + '</p>');
    }

    var twoCol = "";
    if (p.users && p.users.length) {
      twoCol += '<div class="cs-col"><div class="cs-col-h">Target users</div><ul class="cs-bullets">' +
        p.users.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join("") + '</ul></div>';
    }
    if (p.mvp && p.mvp.length) {
      twoCol += '<div class="cs-col"><div class="cs-col-h">MVP scope</div><ul class="cs-bullets check">' +
        p.mvp.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join("") + '</ul></div>';
    }
    if (twoCol) blocks += csSection("Who & what ships", "02", '<div class="cs-twocol">' + twoCol + '</div>');

    if (p.artifacts && p.artifacts.length) {
      var arts = p.artifacts.map(artifactHTML).join("");
      blocks += csSection("Product artifacts", "03",
        '<p class="cs-sub">The work behind the product — each artifact tagged with the discipline lab it draws on.</p>' +
        '<div class="artifacts">' + arts + '</div>');
    }

    var close = "";
    if (p.testing) close += '<div class="cs-col"><div class="cs-col-h">What I\'m testing</div><p class="cs-p">' + esc(p.testing) + '</p></div>';
    if (p.next) close += '<div class="cs-col"><div class="cs-col-h">What I\'d build next</div><p class="cs-p">' + esc(p.next) + '</p></div>';
    if (close) blocks += csSection("Hypothesis & next", "04", '<div class="cs-twocol">' + close + '</div>');

    return blocks ? '<div class="case-study">' + blocks + '</div>' : "";
  }

  function csSection(title, no, inner) {
    return '<section class="cs-section">' +
      '<div class="cs-head"><span class="cs-no">' + no + '</span><h2 class="cs-title">' + esc(title) + '</h2></div>' +
      '<div class="cs-content">' + inner + '</div>' +
    '</section>';
  }

  /* Discipline labels → the lab they link back to. */
  var DISCIPLINE_LAB = {
    founder: "founder", analytics: "analytics", ai: "ai",
    architecture: "architecture", data: "data", product: "product"
  };
  function disciplineTags(tags) {
    if (!tags || !tags.length) return "";
    return '<div class="art-tags">' + tags.map(function (t) {
      var id = DISCIPLINE_LAB[String(t).toLowerCase()];
      if (id) return '<span class="pill disc" data-nav="lab" data-lab="' + id + '" title="See the ' + esc(t) + ' lab">' + esc(t) + ' lab ↗</span>';
      return '<span class="pill">' + esc(t) + '</span>';
    }).join("") + '</div>';
  }

  /* One artifact card, rendered by kind. */
  function artifactHTML(a) {
    var body = "";
    switch (a.kind) {
      case "prd":
        body = '<div class="art-prd">' +
          (a.goal ? '<div class="prd-goal"><span class="k">Goal</span><span class="v">' + esc(a.goal) + '</span></div>' : '') +
          '<div class="prd-grid">' +
            prdCol("Users", a.users) +
            prdCol("MVP", a.mvp) +
            prdCol("Non-goals", a.nongoals, true) +
          '</div>' +
        '</div>';
        break;
      case "flow":
        body = '<ol class="flow-steps">' + (a.steps || []).map(function (s, k) {
          return '<li><span class="fs-n">' + pad(k) + '</span><span class="fs-t">' + esc(s) + '</span></li>';
        }).join("") + '</ol>';
        break;
      case "metrics":
        body = '<div class="metric-tree">' +
          '<div class="mt-business"><span class="mt-k">Business metric</span><span class="mt-v">' + esc(a.business) + '</span></div>' +
          '<div class="mt-branch">' +
            '<div class="mt-group"><div class="mt-gh">Drivers</div>' + (a.drivers || []).map(function (x) { return '<div class="mt-node driver">' + esc(x) + '</div>'; }).join("") + '</div>' +
            '<div class="mt-group"><div class="mt-gh">Product metrics</div>' + (a.product || []).map(function (x) { return '<div class="mt-node metric">' + esc(x) + '</div>'; }).join("") + '</div>' +
          '</div>' +
        '</div>';
        break;
      case "workflow":
        body = '<div class="pipeline">' + (a.steps || []).map(function (s, k) {
          return '<span class="pl-step">' + esc(s) + '</span>' +
            (k < a.steps.length - 1 ? '<span class="pl-arrow">→</span>' : '');
        }).join("") + '</div>';
        break;
      case "beforeafter":
        body = '<div class="ba-grid">' +
          '<div class="ba-col before"><div class="ba-k">Before</div><p>' + esc(a.before) + '</p></div>' +
          '<div class="ba-col after"><div class="ba-k">After</div><p>' + esc(a.after) + '</p></div>' +
        '</div>';
        break;
      case "screens":
        body = '<div class="screens-grid">' + (a.items || []).map(function (s, k) {
          var inner = s.img ? '<img src="' + esc(s.img) + '" alt="' + esc(s.name) + '">' : '<span class="scr-n">' + pad(k) + '</span>';
          return '<div class="screen"><div class="ph scr-ph">' + inner + '</div><div class="scr-name">' + esc(s.name) + '</div></div>';
        }).join("") + '</div>';
        break;
      default:
        body = '';
    }
    return '<article class="artifact art-' + esc(a.kind) + '">' +
      '<div class="art-head"><span class="art-label">' + esc(a.label) + '</span>' + disciplineTags(a.tags) + '</div>' +
      body +
    '</article>';
  }
  function prdCol(h, items, danger) {
    if (!items || !items.length) return "";
    return '<div class="prd-col' + (danger ? ' danger' : '') + '"><div class="prd-h">' + esc(h) + '</div><ul>' +
      items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>';
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

  function wireCountUp() {
    var done = new WeakSet();
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (done.has(el)) return;
        done.add(el);
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (!target) return;
        var duration = 900, start = performance.now();
        (function step(now) {
          var p = Math.min((now - start) / duration, 1);
          var ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        })(performance.now());
      });
    }, {threshold: 0.5});
    app.querySelectorAll('.count-num[data-target]').forEach(function(el) { io.observe(el); });
  }

  function render() {
    var r = parseHash(), html;
    if (r.view === "lab") html = renderLab(r.lab);
    else if (r.view === "product") html = renderProduct(r.lab, r.prod);
    else html = renderIndex();
    app.innerHTML = html;
    applyEditState();
    window.scrollTo({ top: 0, behavior: "auto" });
    if (r.view === "index") wireCountUp();
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
    var load = window.PreviewData
      ? window.PreviewData.load("labs", "labs.json")
      : fetch("labs.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; });
    Promise.all([load, (window.SCFG && SCFG.ready) ? SCFG.ready : Promise.resolve()])
      .then(function (values) { return values[0]; })
      .then(function (j) { if (j && j.labs) { model = j; } else { applyFallback(); } })
      .catch(function () { applyFallback(); })
      .then(function () { render(); if (window.PreviewData) PreviewData.banner(); });
  }

  window.addEventListener("hashchange", render);
  boot();
})();

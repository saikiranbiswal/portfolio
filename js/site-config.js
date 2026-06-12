/* =========================================================
   site-config.js — shared nav / footer / CTA renderers
   Load BEFORE page-specific scripts. Access via window.SCFG.
   Data source: site.json (fetched async). SEED is the
   embedded fallback so pages render instantly without waiting.
   ========================================================= */
window.SCFG = (function () {
  "use strict";

  /* ---- SEED (mirrors site.json — updated by admin publish) ---- */
  var SEED = {
    nav: [
      { label: "Work",    href: "products.html" },
      { label: "Labs",    href: "labs.html" },
      { label: "About",   href: "about.html" },
      { label: "Contact", href: "contact.html" }
    ],
    footer: {
      brand: "Building products from <em>problem</em> to <em>platform.</em>",
      copyright: "© {year} Sai Kiran Biswal — Product Portfolio",
      credit: "Designed & built end-to-end",
      columns: [
        {
          heading: "Navigate",
          links: [
            { label: "Work",    href: "products.html" },
            { label: "Labs",    href: "labs.html" },
            { label: "About",   href: "about.html" },
            { label: "Contact", href: "contact.html" }
          ]
        },
        {
          heading: "Case Studies",
          links: [
            { label: "AI Collections Cloud",   href: "case-studies/collections-cloud.html" },
            { label: "LOS — Loan Origination", href: "case-studies/lending-os.html" }
          ]
        }
      ]
    },
    cta: {
      eyebrow:  "Let’s talk",
      heading:  "Building something <em>hard?</em>",
      body:     "I’d like to hear about it.",
      btnLabel: "Get in touch",
      btnHref:  "contact.html"
    },
    colophon: "Set in Newsreader & Inter · Built by hand · No templates"
  };

  var _data = SEED;

  var base = (function () {
    var s = document.currentScript;
    if (s && s.src) {
      var u = new URL(s.src);
      return u.pathname.replace(/js\/site-config\.js.*$/, "");
    }
    return "";
  }());
  var ready = (window.PreviewData
    ? window.PreviewData.load("site", base + "site.json")
    : fetch(base + "site.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }))
    .then(function (d) { if (d) _data = d; return _data; })
    .catch(function () { return _data; });

  /* ---- Helpers ---- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---- nav(active, homeHref, meta) ----
     active  : label matching one of the nav items (e.g. "Work")
     homeHref: wordmark anchor href (e.g. "products.html" or "#/")
     meta    : { glyph, owner, role, status }                      */
  function nav(active, homeHref, meta) {
    meta = meta || {};
    var links = (_data.nav || []).map(function (n) {
      var isActive = n.label.toLowerCase() === (active || "").toLowerCase();
      return '<a href="' + esc(n.href) + '"' + (isActive ? ' class="active"' : '') + '>' + esc(n.label) + '</a>';
    }).join("");
    return '<nav class="nav"><div class="nav-inner">' +
      '<a class="wordmark" href="' + esc(homeHref || "products.html") + '">' +
        '<span class="glyph">' + esc(meta.glyph || "SK") + '</span>' +
        '<span>' +
          '<span class="name">' + esc(meta.owner || "") + '</span><br>' +
          '<span class="role">' + esc(meta.role  || "") + '</span>' +
        '</span>' +
      '</a>' +
      '<div class="nav-links">' +
        links +
        (meta.status ? '<span class="nav-status"><span class="pulse"></span> ' + esc(meta.status) + '</span>' : '') +
      '</div>' +
    '</div></nav>';
  }

  /* ---- footer(meta) ----
     meta: { owner, linkedin, email, resume }   */
  function footer(meta) {
    meta = meta || {};
    var year = new Date().getFullYear();
    var f = _data.footer || {};

    var cols = (f.columns || []).map(function (col) {
      var links = (col.links || []).map(function (l) {
        var ext = l.external ? ' target="_blank" rel="noopener"' : '';
        return '<a href="' + esc(l.href) + '"' + ext + '>' + esc(l.label) + '</a>';
      }).join("");
      return '<div class="footer-col"><h4>' + esc(col.heading) + '</h4>' + links + '</div>';
    }).join("");

    var elsewhere = (meta.linkedin || meta.email || meta.resume)
      ? '<div class="footer-col"><h4>Elsewhere</h4>' +
          (meta.linkedin ? '<a href="' + esc(meta.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' : '') +
          (meta.email    ? '<a href="mailto:' + esc(meta.email) + '">Email</a>' : '') +
          (meta.resume   ? '<a href="' + esc(meta.resume) + '" target="_blank" rel="noopener">Résumé (PDF)</a>' : '') +
        '</div>'
      : '';

    return '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div><p class="big">' + (f.brand || "") + '</p></div>' +
        cols +
        elsewhere +
      '</div>' +
      '<div class="footer-base">' +
        '<span>' + esc((f.copyright || ("© {year} " + (meta.owner || "") + " — Product Portfolio")).replace("{year}", year)) + '</span>' +
        '<span>' + esc(f.credit || "Designed & built end-to-end") + '</span>' +
      '</div>' +
    '</div></footer>';
  }

  /* ---- ctaBand() ---- */
  function ctaBand() {
    var c = _data.cta || {};
    return '<section class="cta-band section">' +
      '<div class="wrap cta">' +
        (c.eyebrow ? '<p class="eyebrow reveal">' + esc(c.eyebrow) + '</p>' : '') +
        '<h2 class="display reveal" style="margin:18px auto 16px;max-width:18ch;">' + (c.heading || "") + '</h2>' +
        (c.body ? '<p class="reveal">' + esc(c.body) + '</p>' : '') +
        '<a href="' + esc(c.btnHref || "contact.html") + '" class="btn reveal" ' +
          'style="margin-top:28px;background:var(--clay-deep);border-color:var(--clay-deep);">' +
          esc(c.btnLabel || "Get in touch") + ' <span class="arrow">→</span>' +
        '</a>' +
      '</div>' +
    '</section>';
  }

  return {
    get data() { return _data; },
    ready: ready,
    nav:    nav,
    footer: footer,
    ctaBand: ctaBand
  };
}());

/* =========================================================
   about.js — renders the About page from about.json + the
   shared site identity (products.json → meta). Markup, classes,
   and inline styles mirror the original hand-authored about.html
   exactly; only the copy is data-driven so the admin CMS can edit it.
   ========================================================= */
(function () {
  "use strict";

  var META_FALLBACK = {
    owner: "Sai Kiran Biswal", role: "Enterprise · AI Product", glyph: "S",
    email: "saikiranbiswal14@gmail.com",
    linkedin: "https://www.linkedin.com/in/sai-kiran-biswal",
    location: "Hyderabad / Bengaluru · Remote",
    resume: "assets/resume.pdf", status: "Open to lead PM roles"
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // Owner-authored fields may contain <em>…</em>; render as trusted HTML.
  function rich(s) { return String(s == null ? "" : s); }

  async function loadJSON(path) {
    try { var r = await fetch(path, { cache: "no-store" }); if (r.ok) return await r.json(); }
    catch (e) {}
    return null;
  }

  function navHTML(meta) {
    return '<nav class="nav"><div class="nav-inner">' +
      '<a class="wordmark" href="products.html">' +
        '<span class="glyph">' + esc(meta.glyph || (meta.owner || "S")[0]) + '</span>' +
        '<span><span class="name">' + esc(meta.owner) + '</span><br>' +
        '<span class="role">' + esc(meta.role) + '</span></span>' +
      '</a>' +
      '<div class="nav-links">' +
        '<a href="products.html">Work</a>' +
        '<a href="labs.html">Labs</a>' +
        '<a href="about.html" class="active">About</a>' +
        '<a href="contact.html">Contact</a>' +
        '<span class="nav-status"><span class="pulse"></span> ' + esc(meta.status) + '</span>' +
      '</div>' +
    '</div></nav>';
  }

  function footerHTML(meta) {
    return '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div><p class="big">Building products from <em>problem</em> to <em>platform.</em></p></div>' +
        '<div class="footer-col"><h4>Navigate</h4>' +
          '<a href="products.html">Work</a><a href="labs.html">Labs</a>' +
          '<a href="about.html">About</a><a href="contact.html">Contact</a></div>' +
        '<div class="footer-col"><h4>Elsewhere</h4>' +
          '<a href="' + esc(meta.linkedin || "#") + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="mailto:' + esc(meta.email || "") + '">Email</a>' +
          '<a href="' + esc(meta.resume || "assets/resume.pdf") + '" target="_blank" rel="noopener">Résumé (PDF)</a></div>' +
      '</div>' +
      '<div class="footer-base"><span>© 2026 ' + esc(meta.owner) + ' — Product Portfolio</span><span>Designed &amp; built end-to-end</span></div>' +
    '</div></footer>';
  }

  function render(meta, d) {
    var paras = (d.hero.paras || []).map(function (p, i) {
      return '<p class="body-text" style="margin-top:' + (i === 0 ? 20 : 16) + 'px;">' + esc(p) + '</p>';
    }).join("");

    var tl = (d.timeline || []).map(function (r) {
      return '<div class="tl-row">' +
        '<div class="yr">' + esc(r.yr) + '</div>' +
        '<div><h4>' + esc(r.h4) + '</h4><div class="org">' + esc(r.org) + '</div><p>' + esc(r.p) + '</p></div>' +
      '</div>';
    }).join("");

    var pr = (d.principles || []).map(function (p) {
      return '<div class="principle" style="background:var(--dark);">' +
        '<div class="n">' + esc(p.n) + '</div>' +
        '<h4 style="color:#f3efe7;">' + esc(p.h4) + '</h4>' +
        '<p style="color:#b4aa99;">' + esc(p.p) + '</p>' +
      '</div>';
    }).join("");

    var sk = (d.skills || []).map(function (c) {
      return '<div><h4>' + esc(c.h) + '</h4><ul>' +
        (c.items || []).map(function (it) { return '<li>' + esc(it) + '</li>'; }).join("") +
      '</ul></div>';
    }).join("");

    return navHTML(meta) +
      '<header class="section wrap" style="padding-bottom:clamp(40px,6vw,72px);">' +
        '<div class="about-hero">' +
          '<div class="reveal">' +
            '<p class="eyebrow">' + esc(d.hero.eyebrow) + '</p>' +
            '<h1 class="display" style="margin-top:20px;max-width:14ch;">' + rich(d.hero.heading) + '</h1>' +
          '</div>' +
          '<div class="ph portrait reveal"><span class="ph-label">portrait</span></div>' +
        '</div>' +
        '<div class="reveal" style="margin-top:clamp(36px,5vw,64px);max-width:62ch;">' +
          '<p class="lead" style="max-width:none;">' + esc(d.hero.lead) + '</p>' + paras +
        '</div>' +
      '</header>' +
      '<section class="section wrap" style="padding-top:0;">' +
        '<div class="sec-head reveal"><p class="eyebrow">' + esc(d.timelineEyebrow) + '</p><span class="count">' + esc(d.timelineCount) + '</span></div>' +
        '<div class="timeline reveal">' + tl + '</div>' +
      '</section>' +
      '<section class="band"><div class="section wrap">' +
        '<div class="sec-head reveal"><p class="eyebrow">' + esc(d.principlesEyebrow) + '</p><span class="count" style="color:#8a8071;">' + esc(d.principlesCount) + '</span></div>' +
        '<div class="principles reveal" style="background:#322a20;border-color:#322a20;">' + pr + '</div>' +
      '</div></section>' +
      '<section class="section wrap">' +
        '<div class="sec-head reveal"><p class="eyebrow">' + esc(d.skillsEyebrow) + '</p><span class="count">' + esc(d.skillsCount) + '</span></div>' +
        '<div class="skill-cols reveal">' + sk + '</div>' +
      '</section>' +
      '<section class="band"><div class="section wrap cta">' +
        '<p class="eyebrow reveal">' + esc(d.cta.eyebrow) + '</p>' +
        '<h2 class="display reveal">' + rich(d.cta.heading) + '</h2>' +
        '<a href="contact.html" class="btn reveal" style="background:var(--clay-deep);border-color:var(--clay-deep);">' + esc(d.cta.btn) + ' <span class="arrow">→</span></a>' +
      '</div></section>' +
      footerHTML(meta);
  }

  (async function () {
    var prod = await loadJSON("products.json");
    var meta = (prod && prod.meta) || META_FALLBACK;
    var d = await loadJSON("about.json");
    var root = document.getElementById("page");
    if (!d) { root.innerHTML = '<p class="body-text" style="padding:80px 24px;">Could not load about.json. Run a local server (see README).</p>'; return; }
    document.title = "About — " + (meta.owner || "");
    root.innerHTML = render(meta, d);
    window.dispatchEvent(new Event("scroll")); // trigger reveal.js on injected content
  })();
})();

/* =========================================================
   about.js — renders the About page from about.json + the
   shared site identity (products.json → meta). Markup, classes,
   and inline styles mirror the original hand-authored about.html
   exactly; only the copy is data-driven so the admin CMS can edit it.
   ========================================================= */
(function () {
  "use strict";

  var META_FALLBACK = {
    owner: "Sai Kiran Biswal", role: "Enterprise · AI Product", glyph: "SK",
    email: "saikiran.biswal@outlook.com",
    linkedin: "https://www.linkedin.com/in/sai-kiran-biswal",
    resume: "assets/resume.pdf", status: "Open to lead PM roles"
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // Owner-authored fields may contain <em>…</em>; render as trusted HTML.
  function rich(s) { return String(s == null ? "" : s); }

  // Fill a .ph placeholder with an uploaded image, or fall back to the label
  // block the design ships with when no image has been set in the CMS.
  function phShot(src, label) {
    if (!src) return '<span class="ph-label">' + esc(label) + '</span>';
    return '<img src="' + esc(src) + '" alt="' + esc(label) + '" ' +
      'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" ' +
      'onerror="this.outerHTML=\'<span class=&quot;ph-label&quot;>' + esc(label) + '</span>\'">';
  }
  // data-cms-path attribute helper for marked-up editable nodes
  function cp(path, opts) {
    var s = ' data-cms-path="' + esc(path) + '"';
    if (opts && opts.multiline) s += ' data-cms-multiline';
    if (opts && opts.image) s += ' data-cms-image data-cms-dir="' + (opts.dir || "assets/sections") + '"';
    return s;
  }

  async function loadJSON(path) {
    if (window.PreviewData) return window.PreviewData.load(path.split("/").pop().replace(".json", ""), path);
    try { var r = await fetch(path, { cache: "no-store" }); if (r.ok) return await r.json(); }
    catch (e) {}
    return null;
  }
  function render(meta, d, featured) {
    featured = featured || [];
    var paras = (d.hero.paras || []).map(function (p, i) {
      return '<p class="body-text"' + cp("hero.paras." + i, { multiline: true }) + ' style="margin-top:' + (i === 0 ? 20 : 16) + 'px;">' + esc(p) + '</p>';
    }).join("");

    var tl = (d.timeline || []).map(function (r, i) {
      return '<div class="tl-row">' +
        '<div class="yr"' + cp("timeline." + i + ".yr") + '>' + esc(r.yr) + '</div>' +
        '<div><h4' + cp("timeline." + i + ".h4") + '>' + esc(r.h4) + '</h4><div class="org"' + cp("timeline." + i + ".org") + '>' + esc(r.org) + '</div><p' + cp("timeline." + i + ".p", { multiline: true }) + '>' + esc(r.p) + '</p></div>' +
      '</div>';
    }).join("");

    var pr = (d.principles || []).map(function (p, i) {
      return '<div class="principle" style="background:var(--dark);">' +
        '<div class="n"' + cp("principles." + i + ".n") + '>' + esc(p.n) + '</div>' +
        '<h4 style="color:#f3efe7;"' + cp("principles." + i + ".h4") + '>' + esc(p.h4) + '</h4>' +
        '<p style="color:#b4aa99;"' + cp("principles." + i + ".p", { multiline: true }) + '>' + esc(p.p) + '</p>' +
      '</div>';
    }).join("");

    var sk = (d.skills || []).map(function (c, i) {
      return '<div><h4' + cp("skills." + i + ".h") + '>' + esc(c.h) + '</h4><ul>' +
        (c.items || []).map(function (it, j) { return '<li' + cp("skills." + i + ".items." + j) + '>' + esc(it) + '</li>'; }).join("") +
      '</ul></div>';
    }).join("");

    return SCFG.nav('About', 'index.html', meta) +
      '<header class="section wrap" style="padding-bottom:clamp(40px,6vw,72px);">' +
        '<div class="about-hero">' +
          '<div class="reveal">' +
            '<p class="eyebrow"' + cp("hero.eyebrow") + '>' + esc(d.hero.eyebrow) + '</p>' +
            '<h1 class="display" style="margin-top:20px;max-width:14ch;"' + cp("hero.heading", { multiline: true }) + '>' + rich(d.hero.heading) + '</h1>' +
          '</div>' +
          '<div class="ph portrait reveal"' + cp("hero.portrait", { image: true, dir: "assets/about" }) + '>' + phShot(d.hero.portrait, "portrait") + '</div>' +
        '</div>' +
        '<div class="reveal" style="margin-top:clamp(36px,5vw,64px);max-width:62ch;">' +
          '<p class="lead" style="max-width:none;"' + cp("hero.lead", { multiline: true }) + '>' + esc(d.hero.lead) + '</p>' + paras +
        '</div>' +
      '</header>' +
      '<section class="section wrap" style="padding-top:0;">' +
        '<div class="sec-head reveal"><p class="eyebrow"' + cp("timelineEyebrow") + '>' + esc(d.timelineEyebrow) + '</p><span class="count"' + cp("timelineCount") + '>' + esc(d.timelineCount) + '</span></div>' +
        '<div class="timeline reveal">' + tl + '</div>' +
      '</section>' +
      '<section class="band"><div class="section wrap">' +
        '<div class="sec-head reveal"><p class="eyebrow"' + cp("principlesEyebrow") + '>' + esc(d.principlesEyebrow) + '</p><span class="count" style="color:#8a8071;"' + cp("principlesCount") + '>' + esc(d.principlesCount) + '</span></div>' +
        '<div class="principles reveal" style="background:#322a20;border-color:#322a20;">' + pr + '</div>' +
      '</div></section>' +
      '<section class="section wrap">' +
        '<div class="sec-head reveal"><p class="eyebrow"' + cp("skillsEyebrow") + '>' + esc(d.skillsEyebrow) + '</p><span class="count"' + cp("skillsCount") + '>' + esc(d.skillsCount) + '</span></div>' +
        '<div class="skill-cols reveal">' + sk + '</div>' +
      '</section>' +
      '<section class="section wrap">' +
        '<div class="sec-head reveal">' +
          '<p class="eyebrow">Proof, not promises</p>' +
          '<span class="count">Two products, taken end to end</span>' +
        '</div>' +
        '<div class="flag-stack reveal">' +
          '<a href="case-studies/collections-cloud.html" class="flagship">' +
            '<div>' +
              '<div class="tag-row"><span class="pill">AI</span><span class="pill">Fintech</span><span class="pill">Collections</span><span class="pill pill-int">▸ Interactive</span></div>' +
              '<h3 class="display" style="font-size:clamp(22px,2.8vw,34px);">AI Collections Cloud</h3>' +
              '<p class="body-text" style="margin-top:10px;">An AI-native recovery platform — collector copilot, risk scoring, next-best-action, and a working prototype.</p>' +
              '<div style="margin-top:20px;" class="btn">Walk the case study <span class="arrow">→</span></div>' +
            '</div>' +
            '<div class="flag-img-col">' +
              '<div class="ph" style="aspect-ratio:16/10;">' + phShot((featured[0] || {}).screenshot, 'AI Collections Cloud — product hero') + '</div>' +
              '<p class="figcap" style="margin-top:10px;">FIG. 01 — AI COLLECTIONS CLOUD · FLAGSHIP CASE STUDY</p>' +
            '</div>' +
          '</a>' +
          '<a href="case-studies/lending-os.html" class="flagship flip">' +
            '<div>' +
              '<div class="tag-row"><span class="pill">Fintech</span><span class="pill">Lending</span><span class="pill">Platform</span><span class="pill pill-int">▸ Interactive</span></div>' +
              '<h3 class="display" style="font-size:clamp(22px,2.8vw,34px);">LOS — Loan Origination System</h3>' +
              '<p class="body-text" style="margin-top:10px;">Guided, state-based loan origination — from application to approval with fewer handoffs and deterministic demo data.</p>' +
              '<div style="margin-top:20px;" class="btn">Walk the case study <span class="arrow">→</span></div>' +
            '</div>' +
            '<div class="flag-img-col">' +
              '<div class="ph" style="aspect-ratio:16/10;">' + phShot((featured[1] || {}).screenshot, 'LOS — Loan Origination System — product hero') + '</div>' +
              '<p class="figcap" style="margin-top:10px;">FIG. 02 — LOS — LOAN ORIGINATION SYSTEM · FLAGSHIP CASE STUDY</p>' +
            '</div>' +
          '</a>' +
        '</div>' +
      '</section>' +
      '<section class="cta-band section">' +
        '<div class="wrap cta reveal">' +
          '<p class="eyebrow"' + cp("cta.eyebrow") + '>' + esc(d.cta.eyebrow) + '</p>' +
          '<h2 class="display" style="margin:18px auto 16px;max-width:18ch;"' + cp("cta.heading", { multiline: true }) + '>' + rich(d.cta.heading) + '</h2>' +
          '<a href="contact.html" class="btn" style="margin-top:28px;background:var(--clay-deep);border-color:var(--clay-deep);"><span' + cp("cta.btn") + '>' + esc(d.cta.btn) + '</span> <span class="arrow">→</span></a>' +
        '</div>' +
      '</section>' +
      SCFG.footer(meta);
  }

  (async function () {
    document.body.setAttribute("data-cms-model", "about");
    if (window.SCFG && SCFG.ready) await SCFG.ready;
    var prod = await loadJSON("content/products.json");
    var meta = (prod && prod.meta) || META_FALLBACK;
    var d = await loadJSON("content/about.json");
    var root = document.getElementById("page");
    if (!d) { root.innerHTML = '<p class="body-text" style="padding:80px 24px;">Could not load about.json. Run a local server (see README).</p>'; return; }
    document.title = "About — " + (meta.owner || "");
    var featured = (prod && prod.projects || []).filter(function(p) { return p.featured; });
    root.innerHTML = render(meta, d, featured);
    if (window.PreviewData) PreviewData.banner();
    window.dispatchEvent(new Event("scroll")); // trigger reveal.js on injected content
  })();
})();

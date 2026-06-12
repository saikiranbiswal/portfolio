/* =========================================================
   contact.js — renders the Contact page from contact.json + the
   shared site identity (products.json → meta). Markup/classes
   mirror the original contact.html; only the copy is data-driven.
   ========================================================= */
(function () {
  "use strict";

  var META_FALLBACK = {
    owner: "Sai Kiran Biswal", role: "Enterprise · AI Product", glyph: "SK",
    email: "saikiranbiswal14@gmail.com",
    linkedin: "https://www.linkedin.com/in/sai-kiran-biswal",
    resume: "assets/resume.pdf", status: "Open to lead PM roles"
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function rich(s) { return String(s == null ? "" : s); }

  async function loadJSON(path) {
    try { var r = await fetch(path, { cache: "no-store" }); if (r.ok) return await r.json(); }
    catch (e) {}
    return null;
  }

  function navHTML(meta) {
    return '<nav class="nav"><div class="nav-inner">' +
      '<a class="wordmark" href="products.html">' +
        '<span class="glyph">' + esc(meta.glyph || "SK") + '</span>' +
        '<span><span class="name">' + esc(meta.owner) + '</span><br>' +
        '<span class="role">' + esc(meta.role) + '</span></span>' +
      '</a>' +
      '<div class="nav-links">' +
        '<a href="products.html">Work</a>' +
        '<a href="labs.html">Labs</a>' +
        '<a href="about.html">About</a>' +
        '<a href="contact.html" class="active">Contact</a>' +
        '<span class="nav-status"><span class="pulse"></span> ' + esc(meta.status) + '</span>' +
      '</div>' +
    '</div></nav>';
  }

  function footerHTML(meta) {
    var year = new Date().getFullYear();
    return '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div><p class="big">Building products from <em>problem</em> to <em>platform.</em></p></div>' +
        '<div class="footer-col"><h4>Navigate</h4>' +
          '<a href="products.html">Work</a><a href="labs.html">Labs</a>' +
          '<a href="about.html">About</a><a href="contact.html">Contact</a></div>' +
        '<div class="footer-col"><h4>Case Studies</h4>' +
          '<a href="case-studies/collections-cloud.html">AI Collections Cloud</a>' +
          '<a href="case-studies/lending-os.html">LOS — Loan Origination</a></div>' +
        '<div class="footer-col"><h4>Elsewhere</h4>' +
          '<a href="' + esc(meta.linkedin || "#") + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="mailto:' + esc(meta.email || "") + '">Email</a>' +
          '<a href="' + esc(meta.resume || "assets/resume.pdf") + '" target="_blank" rel="noopener">Résumé (PDF)</a></div>' +
      '</div>' +
      '<div class="footer-base"><span>© ' + year + ' ' + esc(meta.owner) + ' — Product Portfolio</span><span>Designed &amp; built end-to-end</span></div>' +
    '</div></footer>';
  }

  // Resolve a contact link into href + external flag, honoring shared meta.
  function linkAttrs(l, meta) {
    var href = l.href, external = !!l.external;
    if (l.type === "email") { href = "mailto:" + (meta.email || l.v); }
    else if (l.type === "resume") { href = meta.resume || "assets/resume.pdf"; external = true; }
    var rel = external ? ' target="_blank" rel="noopener"' : '';
    return ' href="' + esc(href || "#") + '"' + rel;
  }

  function render(meta, d) {
    var links = (d.links || []).map(function (l) {
      return '<a' + linkAttrs(l, meta) + ' class="contact-link">' +
        '<div><div class="k">' + esc(l.k) + '</div><div class="v">' + esc(l.v) + '</div></div>' +
        '<span class="go">→</span>' +
      '</a>';
    }).join("");

    var caseStudyRow = '<div class="reveal" style="margin-top:clamp(48px,7vw,80px);padding-top:clamp(28px,4vw,42px);border-top:1px solid var(--line);">' +
      '<p class="eyebrow" style="margin-bottom:14px;">Or start with the work</p>' +
      '<div style="display:flex;gap:16px;flex-wrap:wrap;">' +
        '<a href="case-studies/collections-cloud.html" class="btn btn-ghost">FIG. 01 · AI Collections Cloud <span class="arrow">→</span></a>' +
        '<a href="case-studies/lending-os.html" class="btn btn-ghost">FIG. 02 · LOS — Loan Origination <span class="arrow">→</span></a>' +
      '</div>' +
    '</div>';

    return navHTML(meta) +
      '<main class="wrap section">' +
        '<div class="contact-hero">' +
          '<div class="reveal">' +
            '<p class="eyebrow">' + esc(d.hero.eyebrow) + '</p>' +
            '<h1 class="display" style="margin-top:20px;max-width:13ch;">' + rich(d.hero.heading) + '</h1>' +
            '<p class="body-text" style="margin-top:24px;">' + esc(d.hero.body) + '</p>' +
            '<div style="margin-top:32px;">' +
              '<a href="mailto:' + esc(meta.email || "") + '" class="email-hero" id="email-copy-btn">' + esc(meta.email || "") + '</a>' +
              '<div class="email-toast" id="email-toast"></div>' +
            '</div>' +
          '</div>' +
          '<div class="reveal"><div class="contact-links">' + links + '</div></div>' +
        '</div>' +
        caseStudyRow +
      '</main>' +
      footerHTML(meta);
  }

  (async function () {
    var prod = await loadJSON("products.json");
    var meta = (prod && prod.meta) || META_FALLBACK;
    var d = await loadJSON("contact.json");
    var root = document.getElementById("page");
    if (!d) { root.innerHTML = '<p class="body-text" style="padding:80px 24px;">Could not load contact.json. Run a local server (see README).</p>'; return; }
    document.title = "Contact — " + (meta.owner || "");
    root.innerHTML = render(meta, d);
    window.dispatchEvent(new Event("scroll"));
    var copyBtn = document.getElementById('email-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(meta.email || '').then(function() {
          var toast = document.getElementById('email-toast');
          if (toast) {
            toast.textContent = 'COPIED — NOW WRITE THE HARD PROBLEM';
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 3000);
          }
        }).catch(function() {
          window.location.href = 'mailto:' + (meta.email || '');
        });
      });
    }
  })();
})();

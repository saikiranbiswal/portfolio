/* =========================================================
   contact.js — renders the Contact page from contact.json + the
   shared site identity (products.json → meta). Markup/classes
   mirror the original contact.html; only the copy is data-driven.
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
  function rich(s) { return String(s == null ? "" : s); }

  async function loadJSON(path) {
    if (window.PreviewData) return window.PreviewData.load(path.split("/").pop().replace(".json", ""), path);
    try { var r = await fetch(path, { cache: "no-store" }); if (r.ok) return await r.json(); }
    catch (e) {}
    return null;
  }
  // Resolve a contact link into href + external flag, honoring shared meta.
  function linkAttrs(l, meta) {
    var href = l.href, external = !!l.external;
    if (l.type === "email") { href = "mailto:" + (meta.email || l.v); }
    else if (l.type === "resume") { href = meta.resume || "assets/resume.pdf"; external = true; }
    var rel = external ? ' target="_blank" rel="noopener"' : '';
    return ' href="' + esc(href || "#") + '"' + rel;
  }

  function cp(path, opts) {
    var s = ' data-cms-path="' + esc(path) + '"';
    if (opts && opts.multiline) s += ' data-cms-multiline';
    return s;
  }

  function render(meta, d) {
    var links = (d.links || []).map(function (l, i) {
      return '<a' + linkAttrs(l, meta) + ' class="contact-link">' +
        '<div><div class="k"' + cp("links." + i + ".k") + '>' + esc(l.k) + '</div><div class="v"' + cp("links." + i + ".v") + '>' + esc(l.v) + '</div></div>' +
        '<span class="go">→</span>' +
      '</a>';
    }).join("");

    var w = d.work || {};
    var caseStudyRow = '';
    if (w.visible !== false && (w.links || []).length) {
      caseStudyRow = '<div class="reveal" style="margin-top:clamp(48px,7vw,80px);padding-top:clamp(28px,4vw,42px);border-top:1px solid var(--line);">' +
        '<p class="eyebrow" style="margin-bottom:14px;">' + esc(w.eyebrow || "Or start with the work") + '</p>' +
        '<div style="display:flex;gap:16px;flex-wrap:wrap;">' +
          w.links.map(function (l) {
            return '<a href="' + esc(l.href || "#") + '" class="btn btn-ghost">' + esc(l.label) + ' <span class="arrow">→</span></a>';
          }).join('') +
        '</div>' +
      '</div>';
    }

    return SCFG.nav('Contact', 'index.html', meta) +
      '<main class="wrap section">' +
        '<div class="contact-hero">' +
          '<div class="reveal">' +
            '<p class="eyebrow"' + cp("hero.eyebrow") + '>' + esc(d.hero.eyebrow) + '</p>' +
            '<h1 class="display" style="margin-top:20px;max-width:13ch;"' + cp("hero.heading", { multiline: true }) + '>' + rich(d.hero.heading) + '</h1>' +
            '<p class="body-text" style="margin-top:24px;"' + cp("hero.body", { multiline: true }) + '>' + esc(d.hero.body) + '</p>' +
            '<div style="margin-top:32px;">' +
              '<a href="mailto:' + esc(meta.email || "") + '" class="email-hero" id="email-copy-btn">' + esc(meta.email || "") + '</a>' +
              '<div class="email-toast" id="email-toast"></div>' +
            '</div>' +
          '</div>' +
          '<div class="reveal"><div class="contact-links">' + links + '</div></div>' +
        '</div>' +
        caseStudyRow +
      '</main>' +
      SCFG.footer(meta);
  }

  (async function () {
    document.body.setAttribute("data-cms-model", "contact");
    if (window.SCFG && SCFG.ready) await SCFG.ready;
    var prod = await loadJSON("content/products.json");
    var meta = (prod && prod.meta) || META_FALLBACK;
    var d = await loadJSON("content/contact.json");
    var root = document.getElementById("page");
    if (!d) { root.innerHTML = '<p class="body-text" style="padding:80px 24px;">Could not load contact.json. Run a local server (see README).</p>'; return; }
    document.title = "Contact — " + (meta.owner || "");
    root.innerHTML = render(meta, d);
    if (window.PreviewData) PreviewData.banner();
    window.dispatchEvent(new Event("scroll"));
    var copyBtn = document.getElementById('email-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(meta.email || '').then(function() {
          var toast = document.getElementById('email-toast');
          if (toast) {
            toast.textContent = d.toast || 'COPIED — NOW WRITE THE HARD PROBLEM';
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

/* =========================================================
   sections.js — shared CMS section renderer
   Renders content/pages.json → sections[] entries into native
   portfolio markup (classes from css/styles.css).
   Used by BOTH the public pages (auto-mount) and admin.html
   (live preview pane), so what you preview is what ships.

   Section envelope (see admin/schemas/page-section.schema.json):
     { id, lane: 2|3|4, page: "work"|"labs"|"about"|"contact",
       blockType?   (lane 2)
       layout?, preset?  (lane 3)
       renderer?, fallback?  (lane 4)
       visible: true|false,
       fields: { title, body, eyebrow, image, metrics[], quote{},
                 cta{}, evidence, link{}, cards[] } }
   ========================================================= */
window.CMSSections = (function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Custom renderer registry (lane 4). Coded renderers register here:
       window.CMS_RENDERERS["spherical-gallery"] = function (el, section) {...}
     A renderer receives the mounted element and the section data. */
  window.CMS_RENDERERS = window.CMS_RENDERERS || {};

  /* ---- field fragments ---- */
  function fEyebrow(f) { return f.eyebrow ? '<p class="eyebrow">' + esc(f.eyebrow) + '</p>' : ''; }
  function fTitle(f)   { return f.title ? '<h2 class="display" style="font-size:clamp(28px,4vw,52px);margin:14px 0 18px;">' + esc(f.title) + '</h2>' : ''; }
  function fBody(f)    { return f.body ? String(f.body).split(/\n{2,}|\n/).filter(Boolean).map(function (p) { return '<p class="body-text" style="margin-top:.8em;">' + esc(p) + '</p>'; }).join('') : ''; }
  function fImage(f, alt) {
    return f.image ? '<img src="' + esc(f.image) + '" alt="' + esc(alt || f.title || '') + '" loading="lazy" ' +
      'style="width:100%;border-radius:8px;border:1px solid var(--line);" ' +
      'onerror="this.style.display=\'none\'">' : '';
  }
  function fMetrics(f) {
    var m = f.metrics || [];
    if (!m.length) return '';
    return '<div style="display:flex;gap:clamp(24px,5vw,64px);flex-wrap:wrap;margin:26px 0;">' +
      m.map(function (s) {
        return '<div class="stat"><span class="n">' + esc(s.value) + '</span><br><span class="l">' + esc(s.label) + '</span></div>';
      }).join('') + '</div>';
  }
  function fQuote(f) {
    var q = f.quote;
    if (!q || !q.text) return '';
    return '<blockquote style="border-left:2px solid var(--clay);margin:24px 0;padding:6px 0 6px 18px;">' +
      '<p class="lead" style="font-style:italic;">&ldquo;' + esc(q.text) + '&rdquo;</p>' +
      (q.attribution ? '<p class="mono-meta" style="margin-top:8px;">— ' + esc(q.attribution) + '</p>' : '') +
    '</blockquote>';
  }
  function fEvidence(f) {
    return f.evidence ? '<div style="border:1px solid var(--line);border-radius:8px;padding:16px 18px;margin:22px 0;background:var(--card,rgba(0,0,0,.02));">' +
      '<p class="mono-meta" style="margin-bottom:6px;">EVIDENCE</p><p class="body-text">' + esc(f.evidence) + '</p></div>' : '';
  }
  function fCta(f) {
    var c = f.cta;
    return (c && c.label) ? '<p style="margin-top:26px;"><a class="btn" href="' + esc(c.href || '#') + '">' + esc(c.label) + ' <span class="arrow">→</span></a></p>' : '';
  }
  function fLink(f) {
    var l = f.link;
    return (l && l.href) ? '<p style="margin-top:14px;"><a class="mono-meta" style="color:var(--clay-deep);" href="' + esc(l.href) + '">' + esc(l.label || l.href) + ' ↗</a></p>' : '';
  }
  function fCards(f, cols) {
    var cards = f.cards || [];
    if (!cards.length) return '';
    return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:26px;">' +
      cards.map(function (c) {
        return '<div style="border:1px solid var(--line);border-radius:8px;padding:18px;">' +
          (c.title ? '<h4 style="font-family:var(--serif);font-size:18px;margin-bottom:8px;">' + esc(c.title) + '</h4>' : '') +
          (c.body ? '<p class="body-text" style="font-size:14.5px;">' + esc(c.body) + '</p>' : '') +
        '</div>';
      }).join('') + '</div>';
  }
  function allExtras(f) { return fMetrics(f) + fQuote(f) + fEvidence(f) + fCards(f) + fCta(f) + fLink(f); }

  /* ---- visual presets (lane 3) — inline style on the <section> ---- */
  var PRESETS = {
    "calm-editorial": "",
    "case-study":     "background:var(--paper-2,#f4efe9);",
    "dark-hero":      "background:#16181d;color:#f5f7fa;--muted:#9aa5b4;--ink:#f5f7fa;",
    "minimal-proof":  "border-top:1px solid var(--line);border-bottom:1px solid var(--line);",
    "boardroom":      "background:var(--card,#fff);border-block:1px solid var(--line);"
  };

  /* ---- lane 3 layouts ---- */
  function renderFlexible(section) {
    var f = section.fields || {};
    var inner;
    switch (section.layout) {
      case "split":
        inner = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:clamp(24px,5vw,72px);align-items:center;">' +
          '<div>' + fEyebrow(f) + fTitle(f) + fBody(f) + fMetrics(f) + fQuote(f) + fEvidence(f) + fCta(f) + fLink(f) + '</div>' +
          '<div>' + (fImage(f) || fCards(f)) + '</div>' +
        '</div>';
        break;
      case "metric-led":
        inner = fEyebrow(f) + fMetrics(f) + fTitle(f) + fBody(f) + fImage(f) + fQuote(f) + fEvidence(f) + fCards(f) + fCta(f) + fLink(f);
        break;
      case "card-grid":
        inner = fEyebrow(f) + fTitle(f) + fBody(f) + fCards(f) + fMetrics(f) + fQuote(f) + fEvidence(f) + fCta(f) + fLink(f) + fImage(f);
        break;
      case "full-bleed":
        return '<section class="section cms-section" data-cms-id="' + esc(section.id) + '" style="padding-block:0;' + (PRESETS[section.preset] || '') + '">' +
          (f.image ? '<div style="position:relative;">' + fImage(f) +
            '<div class="wrap" style="padding-block:clamp(40px,7vw,90px);">' : '<div class="wrap section">') +
            fEyebrow(f) + fTitle(f) + fBody(f) + allExtras(f) +
          '</div>' + (f.image ? '</div>' : '') +
        '</section>';
      case "stacked":
      default:
        inner = fEyebrow(f) + fTitle(f) + fBody(f) + fImage(f) + allExtras(f);
    }
    return '<section class="section cms-section" data-cms-id="' + esc(section.id) + '" style="' + (PRESETS[section.preset] || '') + '">' +
      '<div class="wrap">' + inner + '</div></section>';
  }

  /* ---- lane 2 reusable blocks ---- */
  var BLOCKS = {
    "hero-band": function (f) { return fEyebrow(f) + fTitle(f) + (f.body ? '<p class="lead" style="max-width:56ch;">' + esc(f.body) + '</p>' : '') + fCta(f); },
    "metric-strip": function (f) { return fEyebrow(f) + fTitle(f) + fMetrics(f) + fBody(f); },
    "timeline": function (f) {
      var cards = f.cards || [];
      return fEyebrow(f) + fTitle(f) + fBody(f) +
        '<div style="margin-top:26px;">' + cards.map(function (c) {
          return '<div style="display:grid;grid-template-columns:120px 1fr;gap:18px;padding:16px 0;border-top:1px solid var(--line);">' +
            '<span class="mono-meta">' + esc(c.title) + '</span>' +
            '<p class="body-text">' + esc(c.body) + '</p></div>';
        }).join('') + '</div>';
    },
    "card-grid": function (f) { return fEyebrow(f) + fTitle(f) + fBody(f) + fCards(f); },
    "artifact-card": function (f) {
      return '<div style="border:1px solid var(--line);border-radius:10px;padding:clamp(20px,3vw,34px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:center;">' +
        '<div>' + fEyebrow(f) + fTitle(f) + fBody(f) + fLink(f) + '</div>' +
        (f.image ? '<div>' + fImage(f) + '</div>' : '') + '</div>';
    },
    "case-study-section": function (f) { return fEyebrow(f) + fTitle(f) + fBody(f) + fQuote(f) + fEvidence(f) + fMetrics(f) + fImage(f) + fCta(f); },
    "feature-grid": function (f) { return fEyebrow(f) + fTitle(f) + fBody(f) + fCards(f) + fCta(f); }
  };

  function renderBlock(section) {
    var fn = BLOCKS[section.blockType];
    var f = section.fields || {};
    var inner = fn ? fn(f) : '<p class="body-text">Unknown block type: ' + esc(section.blockType) + '</p>';
    return '<section class="section cms-section" data-cms-id="' + esc(section.id) + '"><div class="wrap">' + inner + '</div></section>';
  }

  /* ---- lane 4 custom renderer (markup shell + fallback) ---- */
  function renderCustom(section) {
    var f = section.fields || {};
    var fallback;
    switch (section.fallback) {
      case "hide":         fallback = ''; break;
      case "text-summary": fallback = fTitle(f) + fBody(f) + fLink(f); break;
      case "static-image": fallback = fEyebrow(f) + fTitle(f) + fImage(f) + fBody(f) + fLink(f); break;
      case "simple-card":
      default:
        fallback = '<div style="border:1px solid var(--line);border-radius:10px;padding:28px;">' + fEyebrow(f) + fTitle(f) + fBody(f) + fLink(f) + '</div>';
    }
    return '<section class="section cms-section" data-cms-id="' + esc(section.id) + '" data-cms-renderer="' + esc(section.renderer || '') + '">' +
      '<div class="wrap" data-cms-fallback>' + fallback + '</div></section>';
  }

  function render(section) {
    if (!section || section.visible === false) return '';
    if (section.lane === 2) return renderBlock(section);
    if (section.lane === 4) return renderCustom(section);
    return renderFlexible(section);
  }

  /* After mounting, hand lane-4 sections to their coded renderer if present.
     If no renderer is registered, the fallback markup stays. */
  function activate(rootEl) {
    rootEl.querySelectorAll('[data-cms-renderer]').forEach(function (el) {
      var name = el.getAttribute('data-cms-renderer');
      var fn = window.CMS_RENDERERS[name];
      if (typeof fn !== 'function') return;
      try { fn(el, null); } catch (e) { console.warn('[cms] renderer "' + name + '" failed:', e); }
    });
  }

  /* ---- public-page auto-mount ---- */
  var PAGE_IDS = { "products.html": "work", "labs.html": "labs", "about.html": "about", "contact.html": "contact" };
  function currentPageId() {
    var file = (location.pathname.split('/').pop() || 'index.html');
    return document.body.getAttribute('data-cms-page') || PAGE_IDS[file] || null;
  }

  /* Zone → anchor map. Self-contained so public pages need no extra script;
     mirrors the selectors in admin/screen-registry.js. A section with a known
     `zone` mounts at its anchor; anything else falls back to the default host
     (before the CTA band / footer), preserving the original behavior. */
  var ZONES = {
    work: {
      "after-hero":      { selector: ".hero",      position: "after" },
      "after-work-grid": { selector: "#work-list", position: "after" },
      "before-cta":      { selector: ".cta-band",  position: "before" }
    },
    labs:    { "end-of-page": { selector: "#app",  position: "after" } },
    about:   { "end-of-page": { selector: "#page", position: "after" } },
    contact: { "end-of-page": { selector: "#page", position: "after" } }
  };

  function makeHost(zoneId) {
    var host = document.createElement('div');
    host.setAttribute('data-cms-sections', zoneId || '');
    return host;
  }

  /* Insert `host` relative to a zone's anchor; return true on success. */
  function mountZoneHost(pageId, zoneId, host) {
    var z = ZONES[pageId] && ZONES[pageId][zoneId];
    if (!z) return false;
    var anchor = document.querySelector(z.selector);
    if (!anchor || !anchor.parentNode) return false;
    if (z.position === 'after') anchor.parentNode.insertBefore(host, anchor.nextSibling);
    else anchor.parentNode.insertBefore(host, anchor); // "before"
    return true;
  }

  /* Default host: before the CTA band / footer, else body end (legacy behavior). */
  function mountDefaultHost(host) {
    host.setAttribute('data-cms-sections', 'default');
    var anchor = document.querySelector('.cta-band') || document.querySelector('footer.footer');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(host, anchor);
    else document.body.appendChild(host);
    return host;
  }

  async function mount() {
    var pageId = currentPageId();
    if (!pageId) return;
    var data = window.PreviewData
      ? await window.PreviewData.load('pages', 'content/pages.json')
      : await fetch('content/pages.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    var sections = (data && data.sections || []).filter(function (s) { return s.page === pageId && s.visible !== false; });

    /* Clear any previous mounts (idempotent across re-renders). */
    Array.prototype.forEach.call(document.querySelectorAll('[data-cms-sections]'), function (n) { n.parentNode && n.parentNode.removeChild(n); });
    if (!sections.length) return;

    /* Group by zone, preserving array order within each zone. */
    var byZone = {}, order = [];
    sections.forEach(function (s) {
      var z = s.zone || 'default';
      if (!byZone[z]) { byZone[z] = []; order.push(z); }
      byZone[z].push(s);
    });

    var leftovers = [];
    order.forEach(function (zoneId) {
      if (zoneId === 'default') { leftovers = leftovers.concat(byZone[zoneId]); return; }
      var host = makeHost(zoneId);
      if (mountZoneHost(pageId, zoneId, host)) {
        host.innerHTML = byZone[zoneId].map(render).join('');
        activate(host);
      } else {
        leftovers = leftovers.concat(byZone[zoneId]); // unknown/missing anchor → fallback
      }
    });

    if (leftovers.length) {
      var dflt = mountDefaultHost(makeHost('default'));
      dflt.innerHTML = leftovers.map(render).join('');
      activate(dflt);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();

  return { render: render, mount: mount, activate: activate, BLOCKS: Object.keys(BLOCKS), PRESETS: Object.keys(PRESETS) };
}());

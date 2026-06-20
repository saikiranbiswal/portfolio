/* ============================================================
   Project page renderer — phantom.land-style case study
   Data: products.json (source of truth) + labs.json flagship
   narratives (why / users / mvp / testing / next).
   URL: project.html?id=<project-id>
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // products.json id → [flagship lab id, lab product id] in labs.json
  var FLAGSHIP_MAP = {
    "collections-cloud": ["ai-collections", "collections-cloud"],
    "lending-cloud": ["los", "lending-os"]
  };

  // Hand-curated highlights for working products, derived strictly
  // from each product's own description in products.json.
  var HIGHLIGHTS = {
    "fastag-redesign": [
      "FASTag health diagnostics",
      "Explainable toll-event ledger",
      "Dispute and annual-pass workflows",
      "Fleet and operator controls"
    ],
    "atlas-task-management": [
      "Delivery board and focused views",
      "Owner, blocker, and priority filters",
      "Task creation and detail states",
      "Evidence kept close to execution"
    ],
    "synthesis": [
      "Strategic framework generation",
      "Implications & 30-60-90 action plan",
      "Multi-format export",
      "Fully offline — runs in the browser"
    ],
    "neuralpath": [
      "Concept levels & quizzes",
      "XP, streaks and progression",
      "AI orchestration flows",
      "Learn one level at a time"
    ],
    "dashboard-studio": [
      "Drag-and-drop dashboard builder",
      "KPI cards & charts",
      "Data profiling and theming",
      "Data never leaves the browser"
    ],
    "excel-transformer": [
      "Profile, filter and rename data",
      "Reusable transformation recipes",
      "Audit-ready workbook export",
      "Fully client-side"
    ],
    "excel-merger": [
      "Schema analysis & smart gap-fill",
      "Source lineage tracking",
      "Synthetic data generation",
      "Audit-ready workbook generation"
    ]
  };

  function findFlagship(labs, pid) {
    var m = FLAGSHIP_MAP[pid];
    if (!m || !labs || !labs.labs) return null;
    var lab = labs.labs.find(function (l) { return l.id === m[0]; });
    if (!lab || !lab.products) return null;
    return lab.products.find(function (x) { return x.id === m[1]; }) || null;
  }

  function appUrl(p) { return p.path ? p.path.replace(/\/$/, "") + "/index.html" : null; }

  function heroHTML(p, flag) {
    var kickerType = p.stage === "Flagship"
      ? "Flagship case study"
      : (/strategy/i.test(p.stage || "") ? "Product strategy" : "Working product");
    var kicker = kickerType +
      " · " + (p.year || "");
    var actions = "";
    var live = appUrl(p);
    if (live) {
      actions += '<a class="btn" href="' + esc(live) + '" target="_blank" rel="noopener">See it live <span class="arrow">↗</span></a>';
    }
    if (p.caseStudy) {
      actions += '<a class="btn btn-ghost" href="' + esc(p.caseStudy) + '">Walk the case study <span class="arrow">→</span></a>';
    }
    var disciplines = (p.tags || []).join(" · ");
    var stack = flag && flag.stack ? flag.stack.join(" · ") : null;
    return (
      '<header class="p-hero wrap">' +
        '<p class="eyebrow p-reveal">' + esc(kicker) + "</p>" +
        '<h1 class="p-title p-reveal">' + esc(p.name) + "</h1>" +
        '<p class="p-tagline p-reveal">' + esc((flag && flag.tagline) || p.description || "") + "</p>" +
        '<div class="p-actions p-reveal">' + actions + "</div>" +
        '<dl class="p-meta p-reveal">' +
          "<div><dt>Role</dt><dd>" + esc(p.role || "Product Manager") + "</dd></div>" +
          "<div><dt>Year</dt><dd>" + esc(p.year || "—") + "</dd></div>" +
          "<div><dt>Stage</dt><dd>" + esc(p.stage || "—") + "</dd></div>" +
          "<div><dt>Disciplines</dt><dd>" + esc(disciplines || "—") + "</dd></div>" +
          (stack ? "<div><dt>Built on</dt><dd>" + esc(stack) + "</dd></div>" : "") +
        "</dl>" +
      "</header>"
    );
  }

  function mediaHTML(p) {
    if (!p.screenshot) return "";
    return (
      '<div class="p-media-hero wrap p-reveal">' +
        '<figure class="p-frame">' +
          '<img id="hero-shot" src="' + esc(p.screenshot) + '" alt="' + esc(p.name) + ' — product screenshot">' +
          '<figcaption class="fig">Fig. 01 — ' + esc(p.name) + "</figcaption>" +
        "</figure>" +
      "</div>"
    );
  }

  function aboutHTML(p, flag) {
    var paras = [];
    var highlights = [];
    if (flag) {
      if (flag.why) paras.push(flag.why);
      if (flag.what) paras.push(flag.what);
      highlights = flag.mvp || [];
    } else {
      paras.push(p.description || "");
      paras.push(/strategy/i.test(p.stage || "")
        ? "This entry is deliberately labeled as strategy and requirements work. The downloadable source shows the frame, scope, non-goals, user stories, risks, and evidence trail without implying a shipped national platform."
        : "Like everything in this portfolio, it was built end-to-end as a product manager — from problem discovery through architecture and a working prototype you can open and use."
      );
      highlights = HIGHLIGHTS[p.id] || (p.tags || []);
    }
    var usersHTML = "";
    if (flag && flag.users && flag.users.length) {
      usersHTML =
        '<div class="p-users p-reveal">' +
        flag.users.map(function (u) { return '<span class="p-user">' + esc(u) + "</span>"; }).join("") +
        "</div>";
    }
    var twocol = "";
    if (flag && (flag.testing || flag.next)) {
      twocol =
        '<div class="p-twocol p-reveal">' +
          (flag.testing ? "<div><h3>What I was testing</h3><p>" + esc(flag.testing) + "</p></div>" : "") +
          (flag.next ? "<div><h3>Where it goes next</h3><p>" + esc(flag.next) + "</p></div>" : "") +
        "</div>";
    }
    return (
      '<section class="p-section wrap">' +
        '<div class="p-label p-reveal">About</div>' +
        '<div class="p-about-grid">' +
          '<div class="p-narrative p-reveal">' +
            paras.map(function (t) { return "<p>" + esc(t).replace(/\n\n/g, "</p><p>") + "</p>"; }).join("") +
          "</div>" +
          '<aside class="p-highlights p-reveal"><h3>Highlights</h3><ul>' +
            highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") +
          "</ul></aside>" +
        "</div>" +
        usersHTML + twocol +
      "</section>"
    );
  }

  function featuresHTML(p, flag) {
    var chips = (p.tags || []).slice();
    if (flag && flag.stack) chips = chips.concat(flag.stack);
    chips = chips.filter(function (c, i, a) { return a.indexOf(c) === i; });
    if (!chips.length) return "";
    return (
      '<section class="p-section wrap">' +
        '<div class="p-label p-reveal">Disciplines</div>' +
        '<div class="p-chips p-reveal">' +
          chips.map(function (c) { return '<a class="p-chip" href="labs.html">' + esc(c) + "</a>"; }).join("") +
        "</div>" +
      "</section>"
    );
  }

  function liveHTML(p) {
    var live = appUrl(p);
    if (!live) return "";
    return (
      '<section class="p-section wrap">' +
        '<div class="p-label p-reveal">See it live</div>' +
        '<div class="p-live-frame p-reveal">' +
          '<div class="p-live-bar">' +
            '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
            '<span class="addr">' + esc(live) + "</span>" +
          "</div>" +
          '<iframe id="live-frame" data-src="' + esc(live) + '" title="' + esc(p.name) + ' — live product" loading="lazy"></iframe>' +
        "</div>" +
        '<div class="p-live-note p-reveal">' +
          '<span class="mono-meta">This is the real working product, embedded — not a mock.</span>' +
          '<a class="btn btn-ghost" href="' + esc(live) + '" target="_blank" rel="noopener">Open full screen <span class="arrow">↗</span></a>' +
        "</div>" +
      "</section>"
    );
  }

  function relatedHTML(p, projects) {
    var others = projects.filter(function (x) { return x.id !== p.id; }).slice(0, 3);
    if (!others.length) return "";
    return (
      '<section class="p-section wrap">' +
        '<div class="p-label p-reveal">Related work</div>' +
        '<div class="p-related-grid">' +
          others.map(function (o) {
            return (
              '<a class="p-card p-reveal" href="project.html?id=' + esc(o.id) + '">' +
                '<div class="ph-wrap">' +
                  (o.screenshot ? '<img src="' + esc(o.screenshot) + '" alt="" loading="lazy">' : "") +
                "</div>" +
                "<h3>" + esc(o.name) + "</h3>" +
                '<span class="mono-meta">' + esc((o.tags || []).slice(0, 3).join(" · ")) + "</span>" +
              "</a>"
            );
          }).join("") +
        "</div>" +
        '<div class="p-reveal"><a class="btn btn-ghost" href="products.html">See all work <span class="arrow">→</span></a></div>' +
      "</section>"
    );
  }

  function nextHTML(p, projects) {
    var idx = projects.findIndex(function (x) { return x.id === p.id; });
    var next = projects[(idx + 1) % projects.length];
    if (!next || next.id === p.id) return "";
    return (
      '<a class="p-next" href="project.html?id=' + esc(next.id) + '">' +
        '<div class="wrap">' +
          '<div class="p-label">Next project</div>' +
          '<span class="p-next-name">' + esc(next.name) + ' <span class="arrow">→</span></span>' +
        "</div>" +
      "</a>" +
      '<div class="p-foot"><div class="wrap">' +
        "<span>© " + new Date().getFullYear() + " Sai Kiran Biswal</span>" +
        '<a href="index.html">Return home ↗</a>' +
        '<a href="contact.html">Get in touch →</a>' +
      "</div></div>"
    );
  }

  function setupInteractions() {
    // reveal on scroll
    var revealEls = document.querySelectorAll(".p-reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { return io.observe(el); });
    } else {
      revealEls.forEach(function (el) { return el.classList.add("in"); });
    }

    // gentle parallax on the hero screenshot
    var shot = document.getElementById("hero-shot");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shot && !reduced) {
      var ticking = false;
      window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var r = shot.parentElement.getBoundingClientRect();
          var progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
          shot.style.transform = "translateY(" + ((progress - 0.5) * -36).toFixed(1) + "px) scale(1.06)";
          ticking = false;
        });
      }, { passive: true });
    }

    // lazy-load the live product iframe when it nears the viewport
    var frame = document.getElementById("live-frame");
    if (frame && "IntersectionObserver" in window) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { frame.src = frame.getAttribute("data-src"); fio.disconnect(); }
        });
      }, { rootMargin: "400px" });
      fio.observe(frame);
    } else if (frame) {
      frame.src = frame.getAttribute("data-src");
    }
  }

  Promise.all([
    fetch("content/products.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
    fetch("content/labs.json", { cache: "no-store" }).then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) {
    var data = res[0], labs = res[1];
    var projects = (data && data.projects) || [];
    var id = new URLSearchParams(location.search).get("id");
    var p = projects.find(function (x) { return x.id === id; });
    if (!p) {
      if (id) { location.replace("products.html"); return; }
      p = projects[0];
    }
    var flag = findFlagship(labs, p.id);

    document.title = p.name + " — Sai Kiran Biswal · Product Case Study";

    var root = document.getElementById("project-root");
    root.innerHTML =
      heroHTML(p, flag) +
      mediaHTML(p) +
      aboutHTML(p, flag) +
      featuresHTML(p, flag) +
      liveHTML(p) +
      relatedHTML(p, projects) +
      nextHTML(p, projects);

    setupInteractions();
  }).catch(function (err) {
    console.error("Project page failed to load:", err);
    var root = document.getElementById("project-root");
    root.innerHTML = '<div class="p-loading mono-meta">could not load project — <a href="products.html">back to work</a></div>';
  });
})();

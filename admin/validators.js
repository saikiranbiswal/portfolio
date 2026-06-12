/* =========================================================
   validators.js — CMS validation engine (admin only)
   Loads the JSON schema files in admin/schemas/ and validates:
     - page sections (lanes 2/3/4) against their lane schema
     - projects / case studies / artifacts required fields
     - image paths + internal links (async, best-effort HEAD)
   Returns check lists: [{ label, pass, detail }]
   Publish is blocked when any check with level "error" fails.
   ========================================================= */
window.CMSValidators = (function () {
  "use strict";

  var SCHEMA_FILES = {
    "page-section":     "admin/schemas/page-section.schema.json",
    "flexible-section": "admin/schemas/flexible-section.schema.json",
    "custom-renderer":  "admin/schemas/custom-renderer.schema.json",
    "project":          "admin/schemas/project.schema.json",
    "case-study":       "admin/schemas/case-study.schema.json",
    "artifact":         "admin/schemas/artifact.schema.json"
  };
  var schemas = {};

  function loadSchemas() {
    var names = Object.keys(SCHEMA_FILES);
    return Promise.all(names.map(function (n) {
      return fetch(SCHEMA_FILES[n], { cache: "no-store" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    })).then(function (loaded) {
      names.forEach(function (n, i) { schemas[n] = loaded[i]; });
      return schemas;
    });
  }

  function present(v) {
    if (v == null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).some(function (k) { return present(v[k]); });
    return true;
  }

  function check(label, pass, detail, level) {
    return { label: label, pass: !!pass, detail: detail || "", level: level || "error" };
  }

  /* ---- section validation (sync) ---- */
  function laneSchema(section) {
    if (section.lane === 4) return schemas["custom-renderer"];
    if (section.lane === 3) return schemas["flexible-section"];
    return schemas["page-section"];
  }

  function validateSection(section) {
    var checks = [];
    var env = (schemas["page-section"] || {}).envelope || {};
    var f = section.fields || {};

    checks.push(check("Section id present", present(section.id)));
    checks.push(check("Valid lane (2, 3 or 4)", (env.laneValues || [2, 3, 4]).indexOf(section.lane) !== -1, "lane = " + section.lane));
    checks.push(check("Page placement set", (env.pageValues || []).indexOf(section.page) !== -1, "page = " + (section.page || "(none)")));
    checks.push(check("Title present", present(f.title)));

    if (section.lane === 2) {
      var types = ((schemas["page-section"] || {}).blockTypes || []).map(function (b) { return b.id; });
      var ok = types.indexOf(section.blockType) !== -1;
      checks.push(check("Valid block type", ok, section.blockType || "(none)"));
      if (ok) {
        var bt = (schemas["page-section"].blockTypes).filter(function (b) { return b.id === section.blockType; })[0];
        (bt.requiredFields || []).forEach(function (rf) {
          checks.push(check("Block field: " + rf, present(f[rf])));
        });
      }
    }

    if (section.lane === 3) {
      var fs = schemas["flexible-section"] || { fields: [] };
      (fs.fields || []).forEach(function (fd) {
        if (!fd.required) return;
        var v = fd.id === "layout" ? section.layout : fd.id === "preset" ? section.preset : fd.id === "page" ? section.page : f[fd.id];
        var okOpt = !fd.options || fd.options.indexOf(v) !== -1;
        checks.push(check(fd.label + " set", present(v) && okOpt, String(v || "")));
      });
    }

    if (section.lane === 4) {
      var cs = schemas["custom-renderer"] || { fields: [] };
      checks.push(check("Renderer name set", present(section.renderer), section.renderer || "(none)"));
      var known = (cs.renderers || []);
      checks.push(check("Renderer is registered/known",
        known.indexOf(section.renderer) !== -1 || (window.CMS_RENDERERS && !!window.CMS_RENDERERS[section.renderer]),
        section.renderer || "", "warn"));
      checks.push(check("Fallback mode set", present(section.fallback)));
      checks.push(check("Body present", present(f.body)));
    } else {
      checks.push(check("Body present", present(f.body), "", section.lane === 2 ? "warn" : "error"));
    }

    if (f.cta && (f.cta.label || f.cta.href)) checks.push(check("CTA has label + href", present(f.cta.label) && present(f.cta.href)));
    if (f.link && (f.link.label || f.link.href)) checks.push(check("Link has href", present(f.link.href)));
    if (f.metrics) (f.metrics || []).forEach(function (m, i) {
      checks.push(check("Metric " + (i + 1) + " has value + label", present(m.value) && present(m.label)));
    });
    return checks;
  }

  /* ---- async existence checks: images + internal links ---- */
  function isExternal(url) { return /^https?:\/\//i.test(url || ""); }
  function headOk(path) {
    return fetch(path, { method: "HEAD", cache: "no-store" })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  function collectPaths(section) {
    var f = section.fields || {};
    var images = [], links = [];
    if (f.image && !isExternal(f.image)) images.push(f.image);
    [f.cta, f.link].forEach(function (l) {
      if (l && l.href && !isExternal(l.href) && l.href !== "#" && !/^mailto:/.test(l.href)) links.push(l.href);
    });
    return { images: images, links: links };
  }

  function validateSectionAsync(section) {
    var p = collectPaths(section);
    var jobs = [];
    p.images.forEach(function (img) {
      jobs.push(headOk(img).then(function (ok) { return check("Image exists: " + img, ok, ok ? "" : "404 — upload it or fix the path"); }));
    });
    p.links.forEach(function (href) {
      var clean = href.split("#")[0].split("?")[0];
      if (!clean) return;
      jobs.push(headOk(clean).then(function (ok) { return check("Internal link resolves: " + href, ok, ok ? "" : "target not found", "warn"); }));
    });
    return Promise.all(jobs);
  }

  /* ---- whole-model validation for the publish gate ---- */
  function requiredFieldChecks(schemaName, item, label) {
    var sc = schemas[schemaName];
    var checks = [];
    ((sc && sc.fields) || []).forEach(function (fd) {
      if (!fd.required) return;
      checks.push(check(label + " — " + fd.label, present(item[fd.id]), ""));
    });
    return checks;
  }

  function validateAll(models) {
    var checks = [];
    ((models.pages && models.pages.sections) || []).forEach(function (s, i) {
      validateSection(s).forEach(function (c) {
        c.label = "Section " + (i + 1) + (s.fields && s.fields.title ? " (" + s.fields.title + ")" : "") + ": " + c.label;
        checks.push(c);
      });
    });
    ((models.products && models.products.projects) || []).forEach(function (p) {
      checks = checks.concat(requiredFieldChecks("project", p, 'Project "' + (p.name || p.id || "?") + '"'));
    });
    ((models.caseStudies && models.caseStudies.caseStudies) || []).forEach(function (c) {
      checks = checks.concat(requiredFieldChecks("case-study", c, 'Case study "' + (c.title || c.id || "?") + '"'));
    });
    ((models.artifacts && models.artifacts.artifacts) || []).forEach(function (a) {
      checks = checks.concat(requiredFieldChecks("artifact", a, 'Artifact "' + (a.title || a.id || "?") + '"'));
    });
    var errors = checks.filter(function (c) { return !c.pass && c.level === "error"; });
    var warnings = checks.filter(function (c) { return !c.pass && c.level === "warn"; });
    return { checks: checks, errors: errors, warnings: warnings, blocked: errors.length > 0 };
  }

  return {
    ready: loadSchemas(),
    schemas: function () { return schemas; },
    validateSection: validateSection,
    validateSectionAsync: validateSectionAsync,
    validateAll: validateAll
  };
}());

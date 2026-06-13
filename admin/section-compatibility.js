/* =========================================================
   section-compatibility.js — weighted placement fit engine (admin only)

   window.checkSectionCompatibility({ screenId, zoneId, componentId, fields })
     → { status: "pass"|"warn"|"block", score: 0-100,
         messages: [{ level, text }], breakdown: {...} }

   This is NOT machine learning — it is a transparent weighted decision model
   (a regression-style equation) so the CMS can explain why a placement is
   allowed, warned, or blocked before anything is published.

   Weights (prompt §8):
     30% screen fit + 25% component fit + 20% required-field completeness
     + 15% preview confidence + 10% publish safety
   ========================================================= */
window.checkSectionCompatibility = (function () {
  "use strict";

  function present(v) {
    if (v == null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0 && v.some(function (x) { return present(x); });
    if (typeof v === "object") return Object.keys(v).some(function (k) { return present(v[k]); });
    return true;
  }
  function isHref(h) {
    if (!present(h)) return false;
    h = String(h).trim();
    return /^https?:\/\//i.test(h) || /^mailto:/i.test(h) || h.charAt(0) === "#" ||
      h.charAt(0) === "/" || h.charAt(0) === "." || /\.(html?|pdf)(\?|#|$)/i.test(h) || /^[\w-]+\//.test(h);
  }

  function reg() { return window.PORTFOLIO_COMPONENT_HELPERS; }
  function screens() { return window.PORTFOLIO_SCREEN_REGISTRY_HELPERS; }

  return function checkSectionCompatibility(input) {
    input = input || {};
    var fields = input.fields || {};
    var messages = [];
    var component = reg() ? reg().byId(input.componentId) : null;
    var screen = screens() ? screens().screen(input.screenId) : null;
    var zone = screens() ? screens().zone(input.screenId, input.zoneId) : null;

    /* ---- 30% screen fit ---- */
    var screenFit = 0;
    if (!component) {
      messages.push({ level: "block", text: "Unknown component — cannot place it." });
    } else if (!screen) {
      messages.push({ level: "block", text: "Unknown screen — pick a target page first." });
    } else if ((component.allowedPages || []).indexOf(input.screenId) === -1) {
      messages.push({ level: "block", text: "Blocked: " + component.label + " is not available on the " + screen.label + " screen." });
    } else {
      screenFit = 100;
      messages.push({ level: "pass", text: "Pass: " + component.label + " fits the " + screen.label + " screen." });
    }

    /* ---- 25% component fit (zone) ---- */
    var componentFit = 0;
    if (component && zone) {
      if ((zone.allowedComponents || []).indexOf(component.id) === -1) {
        messages.push({ level: "block", text: "Blocked: " + component.label + " cannot be placed in the “" + zone.label + "” zone." });
      } else {
        componentFit = 100;
        messages.push({ level: "pass", text: "Pass: " + component.label + " can go in “" + zone.label + "”." });
      }
    } else if (component && screen && !zone) {
      messages.push({ level: "block", text: "Pick a zone for " + component.label + "." });
    }

    /* ---- 20% required-field completeness ---- */
    var requiredFit = 0;
    if (component) {
      var req = (component.requiredFields || []).filter(function (k) {
        return k !== "renderer" && k !== "fallback"; // section-level, always set by toSection
      });
      if (!req.length) {
        requiredFit = 100;
      } else {
        var have = req.filter(function (k) { return present(fields[k]); });
        requiredFit = Math.round((have.length / req.length) * 100);
        req.forEach(function (k) {
          if (!present(fields[k])) messages.push({ level: "block", text: "Blocked: required field “" + k + "” is empty." });
        });
        if (have.length === req.length) messages.push({ level: "pass", text: "Pass: all required fields are filled." });
      }
    }

    /* ---- 15% preview confidence ---- */
    var previewConfidence = 0;
    if (component) {
      var hasTitle = present(fields.title);
      var hasBody = present(fields.body);
      var hasVisual = present(fields.image) || present(fields.cards) || present(fields.metrics) || present(fields.quote);
      previewConfidence = (hasTitle ? 45 : 0) + (hasBody ? 25 : 0) + (hasVisual ? 30 : 0);
      if (previewConfidence < 45) messages.push({ level: "warn", text: "Warning: not enough content yet to preview meaningfully." });
    }

    /* ---- 10% publish safety ---- */
    var publishSafety = 100;
    if (component) {
      // image listed as required-but-empty
      if ((component.requiredFields || []).indexOf("image") !== -1 && !present(fields.image)) {
        publishSafety -= 35;
        messages.push({ level: "warn", text: "Warning: image is required but empty — upload one or pick another component." });
      }
      // optional CTA/link present but malformed
      ["cta", "link"].forEach(function (k) {
        var v = fields[k];
        if (v && (present(v.label) || present(v.href)) && !isHref(v.href)) {
          publishSafety -= 25;
          messages.push({ level: "warn", text: "Warning: the " + k.toUpperCase() + " has no valid link — it will render without a working action." });
        }
      });
      // missing optional fields → gentle note (does not lower score below)
      var missingOpt = (component.optionalFields || []).filter(function (k) { return !present(fields[k]); });
      if (missingOpt.length && requiredFit === 100) {
        messages.push({ level: "info", text: "Optional not set: " + missingOpt.join(", ") + " (fine to leave empty)." });
      }
    }
    publishSafety = Math.max(0, publishSafety);

    var breakdown = {
      screenFit: screenFit,
      componentFit: componentFit,
      requiredFields: requiredFit,
      previewConfidence: previewConfidence,
      publishSafety: publishSafety
    };
    var score = Math.round(
      0.30 * screenFit +
      0.25 * componentFit +
      0.20 * requiredFit +
      0.15 * previewConfidence +
      0.10 * publishSafety
    );

    var hasBlock = messages.some(function (m) { return m.level === "block"; });
    var hasWarn = messages.some(function (m) { return m.level === "warn"; });
    var status = hasBlock ? "block" : (hasWarn ? "warn" : "pass");

    return { status: status, score: Math.max(0, Math.min(100, score)), messages: messages, breakdown: breakdown };
  };
}());

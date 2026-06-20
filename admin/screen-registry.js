/* =========================================================
   screen-registry.js — composer screen + zone map (admin only)

   Defines which public screens the Drag-Drop Screen Composer can target
   and which drop zones each screen exposes. A "zone" is a named spot on
   the real page; selector + position tell the public renderer where to
   mount a section (see the mirrored ZONES map in js/sections.js).

   Only screens that map to a REAL public page with safe anchors live here.
   Case Studies remain intentionally absent because they have no shared
   public listing page. Artifacts now has a standalone evidence library.
   ========================================================= */
window.PORTFOLIO_SCREEN_REGISTRY = {
  work: {
    label: "Work",
    file: "products.html",
    pageKey: "work",
    blurb: "Your products landing page — hero, the work list, then the contact CTA.",
    zones: [
      {
        id: "after-hero",
        label: "After hero",
        selector: ".hero",
        position: "after",
        description: "Right under the headline. Good for proof, metrics, and a quick summary.",
        allowedComponents: ["metric-strip", "card-grid", "case-card", "quote-block"]
      },
      {
        id: "after-work-grid",
        label: "After the work list",
        selector: "#work-list",
        position: "after",
        description: "Below the numbered projects. Best for card-like blocks and case teasers.",
        allowedComponents: ["card-grid", "case-card", "metric-strip"]
      },
      {
        id: "before-cta",
        label: "Before the CTA",
        selector: ".cta-band",
        position: "before",
        description: "The last word before the contact band. Good for persuasive proof.",
        allowedComponents: ["quote-block", "metric-strip", "cta-block", "card-grid"]
      }
    ]
  },

  artifacts: {
    label: "Artifacts",
    file: "artifacts.html",
    pageKey: "artifacts",
    blurb: "The evidence library — hero, interactive category browser, artifact grid, then footer.",
    zones: [
      {
        id: "after-hero",
        label: "After hero",
        selector: ".artifact-hero",
        position: "after",
        description: "Between the evidence-library introduction and category browser.",
        allowedComponents: ["metric-strip", "quote-block", "artifact-card", "card-grid"]
      },
      {
        id: "after-artifact-grid",
        label: "After artifact grid",
        selector: "#artifact-grid",
        position: "after",
        description: "After downloadable evidence. Good for provenance or an additional proof note.",
        allowedComponents: ["quote-block", "metric-strip", "cta-block"]
      },
      {
        id: "before-footer",
        label: "Before footer",
        selector: "footer.footer",
        position: "before",
        description: "A closing evidence or contact section.",
        allowedComponents: ["cta-block", "quote-block", "metric-strip"]
      }
    ]
  },

  labs: {
    label: "Labs",
    file: "labs.html",
    pageKey: "labs",
    blurb: "The labs index renders into one container, so it takes one section spot at the end.",
    zones: [
      {
        id: "end-of-page",
        label: "End of page",
        selector: "#app",
        position: "after",
        description: "After the labs content, before the footer. Safe for proof and a closing CTA.",
        allowedComponents: ["metric-strip", "quote-block", "card-grid", "cta-block"]
      }
    ]
  },

  about: {
    label: "About",
    file: "about.html",
    pageKey: "about",
    blurb: "The about page renders into one container, so it takes one section spot at the end.",
    zones: [
      {
        id: "end-of-page",
        label: "End of page",
        selector: "#page",
        position: "after",
        description: "After your story, before the footer. Good for principles, proof, or a CTA.",
        allowedComponents: ["quote-block", "metric-strip", "card-grid", "cta-block"]
      }
    ]
  },

  contact: {
    label: "Contact",
    file: "contact.html",
    pageKey: "contact",
    blurb: "The contact page renders into one container, so it takes one section spot at the end.",
    zones: [
      {
        id: "end-of-page",
        label: "End of page",
        selector: "#page",
        position: "after",
        description: "After the contact details, before the footer. Keep it light.",
        allowedComponents: ["quote-block", "cta-block", "metric-strip"]
      }
    ]
  }
};

/* Convenience lookups used by the composer + compatibility engine. */
window.PORTFOLIO_SCREEN_REGISTRY_HELPERS = {
  screen: function (screenId) { return window.PORTFOLIO_SCREEN_REGISTRY[screenId] || null; },
  zone: function (screenId, zoneId) {
    var s = window.PORTFOLIO_SCREEN_REGISTRY[screenId];
    if (!s) return null;
    return (s.zones || []).filter(function (z) { return z.id === zoneId; })[0] || null;
  },
  screenIds: function () { return Object.keys(window.PORTFOLIO_SCREEN_REGISTRY); }
};

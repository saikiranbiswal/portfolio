/* =========================================================
   component-registry.js — composer component palette (admin only)

   The fixed set of blocks a user can drag into a page zone. Each component
   MAPS ONTO the existing four-lane section model so the generated JSON
   renders unchanged by js/sections.js (CMSSections.render):

     lane 2  → reusable block        → needs `blockType`
     lane 3  → flexible section       → needs `layout` + `preset`
     lane 4  → custom renderer        → needs `renderer` + `fallback`

   `toSection()` turns a component + placement into a section draft that is
   byte-compatible with content/pages.json, plus the composer-only metadata
   `component` and `zone` (additive; ignored by the existing renderer/validators).
   ========================================================= */
window.PORTFOLIO_COMPONENT_REGISTRY = [
  {
    id: "hero-band",
    label: "Hero Band",
    description: "Big intro with title, lead, and a call to action.",
    lane: 2, blockType: "hero-band",
    requiredFields: ["title"],
    optionalFields: ["eyebrow", "body", "cta"],
    allowedPages: ["work", "artifacts", "labs", "about", "contact"]
  },
  {
    id: "card-grid",
    label: "Card Grid",
    description: "Reusable cards for projects, labs, artifacts, or case teasers.",
    lane: 2, blockType: "card-grid",
    requiredFields: ["title", "cards"],
    optionalFields: ["eyebrow", "body", "cta", "link"],
    allowedPages: ["work", "artifacts", "labs", "about", "contact"]
  },
  {
    id: "metric-strip",
    label: "Metric Strip",
    description: "A row of numbers — outcomes, scale, proof.",
    lane: 2, blockType: "metric-strip",
    requiredFields: ["title", "metrics"],
    optionalFields: ["eyebrow", "body"],
    allowedPages: ["work", "artifacts", "labs", "about", "contact"]
  },
  {
    id: "quote-block",
    label: "Quote Block",
    description: "A testimonial or a sharp line of proof.",
    lane: 3, layout: "stacked", preset: "calm-editorial",
    requiredFields: ["quote"],
    optionalFields: ["title", "body"],
    allowedPages: ["work", "artifacts", "labs", "about", "contact"]
  },
  {
    id: "cta-block",
    label: "CTA Block",
    description: "Invite the reader to contact you or view more work.",
    lane: 3, layout: "stacked", preset: "boardroom",
    requiredFields: ["title", "cta"],
    optionalFields: ["body"],
    allowedPages: ["work", "artifacts", "labs", "about", "contact"]
  },
  {
    id: "case-card",
    label: "Case Study Card",
    description: "A compact case-study teaser with proof and a quote.",
    lane: 2, blockType: "case-study-section",
    requiredFields: ["title", "body"],
    optionalFields: ["eyebrow", "quote", "evidence", "metrics", "image", "cta"],
    allowedPages: ["work", "artifacts", "labs"]
  },
  {
    id: "artifact-card",
    label: "Artifact Card",
    description: "A PRD, deck, or doc shown as a linked card with a thumbnail.",
    lane: 2, blockType: "artifact-card",
    requiredFields: ["title", "body"],
    optionalFields: ["eyebrow", "image", "link"],
    allowedPages: ["work", "artifacts", "labs", "about"]
  },
  {
    id: "custom-renderer",
    label: "Custom Renderer",
    description: "Coded interactive markup (e.g. 3D gallery). Powerful but constrained.",
    lane: 4, renderer: "spherical-gallery", fallback: "simple-card",
    requiredFields: ["title", "renderer", "fallback"],
    optionalFields: ["body", "image", "link"],
    allowedPages: ["work", "artifacts", "labs"]
  }
];

window.PORTFOLIO_COMPONENT_HELPERS = {
  byId: function (id) {
    return window.PORTFOLIO_COMPONENT_REGISTRY.filter(function (c) { return c.id === id; })[0] || null;
  },
  forScreen: function (screenId) {
    return window.PORTFOLIO_COMPONENT_REGISTRY.filter(function (c) {
      return (c.allowedPages || []).indexOf(screenId) !== -1;
    });
  },
  /* Build a content/pages.json-compatible section draft from a component + placement.
     Field skeleton seeds only the required fields so the editor starts focused. */
  toSection: function (componentId, screenId, zoneId, idFactory) {
    var c = this.byId(componentId);
    if (!c) return null;
    var FIELD_SEED = {
      title: "", body: "", eyebrow: "", image: "", evidence: "",
      note: "",
      metrics: [{ value: "", label: "" }],
      quote: { text: "", attribution: "" },
      cta: { label: "", href: "" },
      link: { label: "", href: "" },
      cards: [{ title: "", body: "" }]
    };
    var fields = {};
    (c.requiredFields || []).forEach(function (k) {
      if (k === "renderer" || k === "fallback") return; // section-level, not a field
      if (FIELD_SEED[k] !== undefined) fields[k] = JSON.parse(JSON.stringify(FIELD_SEED[k]));
    });
    if (fields.title === undefined) fields.title = "";
    var newId = (typeof idFactory === "function")
      ? idFactory()
      : "section-" + Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36);
    var section = {
      id: newId,
      lane: c.lane,
      page: screenId,
      zone: zoneId,
      component: c.id,
      visible: true,
      fields: fields
    };
    if (c.lane === 2) section.blockType = c.blockType;
    if (c.lane === 3) { section.layout = c.layout; section.preset = c.preset; }
    if (c.lane === 4) { section.renderer = c.renderer; section.fallback = c.fallback; if (section.fields.note === undefined) section.fields.note = ""; }
    return section;
  }
};

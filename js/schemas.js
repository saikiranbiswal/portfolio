/* js/schemas.js — Form schema definitions for the admin FormEngine.
   Pure data. No DOM or model references. Loaded before admin.html's inline script. */
window.SCHEMAS = {

  /* ── Site identity (products.json → meta) ─────────────────────────── */
  site: {
    model: "products",
    sections: [{
      title: "Site identity",
      fields: [
        { row: [{ label: "Owner name", path: "meta.owner" }, { label: "Role / title", path: "meta.role" }] },
        { row: [{ label: "Glyph (nav badge)", path: "meta.glyph" }, { label: "Status", path: "meta.status" }] },
        { row: [{ label: "Email", path: "meta.email" }, { label: "LinkedIn URL", path: "meta.linkedin" }] },
        { html: '<p class="subhint">To edit your visible location, use the <strong>Contact</strong> tab → Contact links → Location.</p>' },
        { row: [
          { label: "Résumé path", path: "meta.resume" },
          { label: "Show role on Work cards", path: "meta.showRoleOnCards",
            select: [{ value: "false", label: "No" }, { value: "true", label: "Yes" }], type: "bool" }
        ]}
      ]
    }]
  },

  /* ── Work (products.json → projects[]) ────────────────────────────── */
  work: {
    model: "products",
    list: {
      path: "projects",
      template: "project",
      addLabel: "+ Add project",
      statePrefix: "work:",
      summary: {
        nameField: "name", featuredField: "featured",
        descField: "description", metaFields: ["tags", "displayMode"]
      },
      item: [
        { label: "Name", path: "name" },
        { label: "Description", path: "description", area: true },
        { row: [{ label: "Tags (comma-separated)", path: "tags", csv: true }, { label: "Role", path: "role" }] },
        { row: [{ label: "Year", path: "year" }, { label: "Stage", path: "stage" }] },
        { row: [
          { label: "Display mode", path: "displayMode", select: ["modal", "page", "link"] },
          { label: "Featured (flagship)", path: "featured",
            select: [{ value: "false", label: "No" }, { value: "true", label: "Yes" }], type: "bool" }
        ]},
        { image: true, label: "Screenshot", path: "screenshot", dir: "assets/screenshots",
          nameFrom: "id",
          where: "Shows as the <strong>thumbnail</strong> beside this project in the Work list. If this project is the <strong>Featured</strong> one (star), the same image also fills the big <strong>flagship hero</strong> at the top of the Work page." },
        { label: "App path (e.g. ./apps/my-app/)", path: "path" },
        { label: "Case study URL (leave blank to use modal/page view)", path: "caseStudy" }
      ]
    }
  },

  /* ── About (about.json) ───────────────────────────────────────────── */
  about: {
    model: "about",
    sections: [
      { title: "Hero", fields: [
        { label: "Eyebrow", path: "hero.eyebrow" },
        { label: "Heading (HTML — &lt;em&gt; allowed)", path: "hero.heading" },
        { image: true, label: "Portrait photo", path: "hero.portrait", dir: "assets/about", name: "portrait",
          where: "Appears as your <strong>portrait photo</strong> at the top of the About page, beside the headline (portrait / 4:5 crop). Leave empty to keep the patterned placeholder." },
        { label: "Lead", path: "hero.lead", area: true },
        { type: "array", path: "hero.paras", template: "para", addLabel: "+ Add paragraph",
          item: [{ type: "textarea-direct" }] }
      ]},
      { title: "Background / timeline", fields: [
        { row: [{ label: "Eyebrow", path: "timelineEyebrow" }, { label: "Count label", path: "timelineCount" }] },
        { type: "array", path: "timeline", template: "timeline", addLabel: "+ Add row",
          item: [
            { row: [{ label: "Years", path: "yr" }, { label: "Role", path: "h4" }] },
            { label: "Organization", path: "org" },
            { label: "Description", path: "p", area: true }
          ]}
      ]},
      { title: "Operating principles", fields: [
        { row: [{ label: "Eyebrow", path: "principlesEyebrow" }, { label: "Count label", path: "principlesCount" }] },
        { type: "array", path: "principles", template: "principle", addLabel: "+ Add principle",
          item: [
            { row: [{ label: "Number", path: "n" }, { label: "Title", path: "h4" }] },
            { label: "Text", path: "p", area: true }
          ]}
      ]},
      { title: "Toolkit / skills", fields: [
        { row: [{ label: "Eyebrow", path: "skillsEyebrow" }, { label: "Count label", path: "skillsCount" }] },
        { type: "array", path: "skills", template: "skill", addLabel: "+ Add column",
          item: [
            { label: "Column heading", path: "h" },
            { label: "Items (one per line)", path: "items", lines: true }
          ]}
      ]},
      { title: "Call to action", fields: [
        { label: "Eyebrow", path: "cta.eyebrow" },
        { label: "Heading", path: "cta.heading" },
        { label: "Button label", path: "cta.btn" }
      ]}
    ]
  },

  /* ── Contact (contact.json) ───────────────────────────────────────── */
  contact: {
    model: "contact",
    sections: [
      { title: "Hero", fields: [
        { label: "Eyebrow", path: "hero.eyebrow" },
        { label: "Heading (HTML — &lt;em&gt; allowed)", path: "hero.heading" },
        { label: "Body", path: "hero.body", area: true }
      ]},
      { title: "Contact links", fields: [
        { type: "array", path: "links", template: "link", addLabel: "+ Add link",
          item: [
            { row: [{ label: "Label", path: "k" }, { label: "Value", path: "v" }] },
            { row: [
              { label: "Type", path: "type", select: [
                { value: "none", label: "Plain link" },
                { value: "email", label: "Email (uses Site email)" },
                { value: "resume", label: "Résumé (uses Site résumé)" }
              ]},
              { label: "Open in new tab", path: "external",
                select: [{ value: "false", label: "No" }, { value: "true", label: "Yes" }], type: "bool" }
            ]},
            { label: "Href (for plain links)", path: "href" }
          ]}
      ]}
    ]
  },

  /* ── Labs (labs.json) ────────────────────────────────────────────── */
  labs: {
    model: "labs",
    sections: [{
      type: "collapsible",
      stateKey: "labsmeta",
      title: "Labs page header",
      fields: [
        { label: "Eyebrow", path: "meta.eyebrow" },
        { label: "Title", path: "meta.title" },
        { label: "Intro", path: "meta.intro", area: true },
        { row: [{ label: "Stat 1 value", path: "meta.statLabs" }, { label: "Stat 1 label", path: "meta.statLabsLabel" }] },
        { row: [{ label: "Stat 2 value", path: "meta.statProducts" }, { label: "Stat 2 label", path: "meta.statProductsLabel" }] },
        { row: [{ label: "Stat 3 value", path: "meta.statYears" }, { label: "Stat 3 label", path: "meta.statYearsLabel" }] }
      ]
    }],
    labsList: {
      path: "labs",
      template: "lab",
      addLabel: "+ Add lab",
      item: [
        { label: "Lab name", path: "name" },
        { label: "Short description", path: "desc", area: true },
        { label: "Blurb", path: "blurb", area: true },
        { type: "nested-list", path: "products", template: "labproduct", addLabel: "+ Add product",
          item: [
            { label: "Name", path: "name" },
            { label: "Tagline", path: "tagline" },
            { label: "What it does", path: "what", area: true },
            { row: [{ label: "Tags (comma-separated)", path: "tags", csv: true }, { label: "Stack (comma-separated)", path: "stack", csv: true }] },
            { row: [{ label: "Role", path: "role" }, { label: "Year", path: "year" }] },
            { row: [{ label: "Stage (card)", path: "stage" }, { label: "Stage (detail)", path: "stage2" }] },
            { label: "Explore URL", path: "url" },
            { image: true, label: "Product image", path: "image", dir: "assets/labs", nameFrom: "id",
              where: "Appears on this product's <strong>card</strong> in its lab, and as the large <strong>hero image</strong> on the product's detail page. Leave empty to keep the patterned placeholder." },
            { type: "feat-list", path: "features" },
            { type: "move-lab" }
          ]}
      ]
    }
  },

  /* ── Config (site.json — nav, footer, CTA, colophon) ─────────────── */
  config: {
    model: "site",
    sections: [
      { title: "Nav items",
        note: "ORDER &amp; LABELS — changes appear instantly on all pages after publish.",
        fields: [
          { type: "array", path: "nav", template: "navitem", addLabel: "+ Add nav item",
            item: [{ row: [{ label: "Label", path: "label" }, { label: "Href", path: "href" }] }] }
        ]},
      { title: "Footer", fields: [
        { label: "Brand tagline (HTML — &lt;em&gt; allowed)", path: "footer.brand", area: true },
        { type: "footer-columns" }
      ]},
      { title: "CTA band", fields: [
        { row: [{ label: "Eyebrow", path: "cta.eyebrow" }, { label: "Body", path: "cta.body" }] },
        { label: "Heading (HTML — &lt;em&gt; allowed)", path: "cta.heading" },
        { row: [{ label: "Button label", path: "cta.btnLabel" }, { label: "Button href", path: "cta.btnHref" }] }
      ]},
      { title: "Colophon", fields: [
        { label: "Colophon line (bottom of Work page)", path: "colophon" }
      ]}
    ]
  }
};

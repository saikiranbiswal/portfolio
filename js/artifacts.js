(function () {
  "use strict";

  var state = { data: null, active: "all" };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function artifactCard(item) {
    var preview = item.preview
      ? '<div class="artifact-preview"><img src="' + esc(item.preview) + '" alt="Preview of ' + esc(item.title) + '"></div>'
      : "";
    // Primary action keeps the visitor in the portfolio: the reader renders
    // the artifact in-site. The source download becomes the secondary action.
    return '<article class="artifact-card' + (item.featured ? ' featured' : '') + (item.preview ? ' has-preview' : '') + '">' +
      preview +
      '<div class="artifact-meta"><span class="artifact-chip">' + esc(item.status) + '</span><span class="artifact-chip">' + esc(item.format) + '</span></div>' +
      '<h3>' + esc(item.title) + '</h3>' +
      '<p class="artifact-project eyebrow">' + esc(item.project) + '</p>' +
      '<p class="artifact-description">' + esc(item.description) + '</p>' +
      '<details class="artifact-proof"><summary>What this demonstrates</summary><p>' + esc(item.proof) + '</p></details>' +
      '<div class="artifact-actions">' +
        '<a class="artifact-link" href="reader.html?id=' + encodeURIComponent(item.id) + '">Read it here →</a>' +
        '<a class="artifact-file-note mono-meta" href="' + esc(item.file) + '" download>Download ↓</a>' +
      '</div>' +
      '</article>';
  }

  function renderTabs() {
    var container = document.getElementById("artifact-tabs");
    container.innerHTML = state.data.tabs.map(function (tab) {
      var selected = tab.id === state.active;
      return '<button class="artifact-tab" id="tab-' + esc(tab.id) + '" role="tab" aria-selected="' + selected + '" aria-controls="tab-explainer" tabindex="' + (selected ? "0" : "-1") + '" data-tab="' + esc(tab.id) + '">' + esc(tab.label) + '</button>';
    }).join("");
  }

  function renderExplainer() {
    var tab = state.data.tabs.find(function (candidate) { return candidate.id === state.active; }) || state.data.tabs[0];
    document.getElementById("tab-kicker").textContent = tab.label + " · Context";
    document.getElementById("tab-title").textContent = tab.title;
    document.getElementById("tab-description").textContent = tab.description;
    document.getElementById("tab-explainer").setAttribute("aria-labelledby", "tab-" + tab.id);
  }

  function renderGrid() {
    var items = state.data.artifacts.filter(function (item) {
      return item.visible !== false && (state.active === "all" || item.category === state.active);
    });
    // Pin featured artifacts to the top of every view, preserving source order otherwise.
    items = items.slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    document.getElementById("artifact-count").textContent = items.length + (items.length === 1 ? " artifact" : " artifacts") + " in this view";
    document.getElementById("artifact-grid").innerHTML = items.length
      ? items.map(artifactCard).join("")
      : '<p class="artifact-empty">No artifacts are available in this category yet.</p>';
  }

  function activate(id, updateHash) {
    if (!state.data.tabs.some(function (tab) { return tab.id === id; })) return;
    state.active = id;
    renderTabs();
    renderExplainer();
    renderGrid();
    if (updateHash) history.replaceState(null, "", id === "all" ? location.pathname : "#" + id);
  }

  function wireTabs() {
    var tabs = document.getElementById("artifact-tabs");
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("[data-tab]");
      if (button) activate(button.dataset.tab, true);
    });
    tabs.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
      var buttons = Array.from(tabs.querySelectorAll("[role=tab]"));
      var current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      var next = current;
      if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      activate(buttons[next].dataset.tab, true);
      document.getElementById("tab-" + buttons[next].dataset.tab).focus();
    });
  }

  async function load() {
    if (window.SCFG && SCFG.ready) await SCFG.ready;
    var response = await fetch("content/artifacts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Artifacts returned " + response.status);
    state.data = await response.json();
    var meta = state.data.meta || {};
    document.getElementById("artifact-eyebrow").textContent = meta.eyebrow || "Evidence library";
    document.getElementById("artifact-title").textContent = meta.title || "Artifacts";
    document.getElementById("artifact-intro").textContent = meta.intro || "";
    document.getElementById("artifact-note").textContent = meta.note || "";

    var nav = document.querySelector("nav.nav");
    if (nav) nav.outerHTML = SCFG.nav("Artifacts", "index.html", { glyph: "SK", owner: "Sai Kiran Biswal", role: "Enterprise · AI Product", status: "Open to lead PM roles" });
    document.getElementById("site-footer").outerHTML = SCFG.footer({
      owner: "Sai Kiran Biswal",
      linkedin: "https://www.linkedin.com/in/sai-kiran-biswal",
      email: "saikiran.biswal@outlook.com",
      resume: "assets/resume.pdf"
    });

    var hash = location.hash.replace("#", "");
    state.active = state.data.tabs.some(function (tab) { return tab.id === hash; }) ? hash : "all";
    wireTabs();
    activate(state.active, false);
  }

  load().catch(function (error) {
    document.getElementById("artifact-intro").textContent = "The evidence library could not be loaded.";
    document.getElementById("artifact-grid").innerHTML = '<p class="artifact-empty">' + esc(error.message) + '</p>';
  });
}());

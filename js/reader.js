/* ============================================================
   Artifact reader — renders pre-extracted artifact JSON inside
   the portfolio so visitors read documents without downloading.
   URL: reader.html?id=<artifact-id>
   Data: content/artifacts.json (metadata) +
         assets/artifacts/content/<id>.json (extracted content,
         produced by tools/extract_artifacts.py)
   ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var root = document.getElementById("reader-root");

  function fail(msg) {
    document.title = "Artifact not found · Sai Kiran Biswal";
    root.innerHTML =
      '<header class="rd-hero">' +
        '<p class="eyebrow">Artifact reader</p>' +
        '<h1 class="display">' + esc(msg) + "</h1>" +
        '<div class="rd-actions"><a class="btn" href="artifacts.html">All artifacts <span class="arrow">→</span></a></div>' +
      "</header>";
  }

  function headerHTML(meta) {
    return (
      '<header class="rd-hero">' +
        '<a class="back-link" href="artifacts.html">← All artifacts</a>' +
        '<p class="eyebrow">' + esc(meta.status || "Artifact") + ' <span class="dot">·</span> ' + esc(meta.project || "") + "</p>" +
        '<h1 class="display">' + esc(meta.title) + "</h1>" +
        '<p class="lead">' + esc(meta.description || "") + "</p>" +
        (meta.proof ? '<aside class="rd-proof"><span class="eyebrow">What this demonstrates</span><p>' + esc(meta.proof) + "</p></aside>" : "") +
        '<div class="rd-actions">' +
          '<span class="mono-meta">' + esc(meta.format || "") + "</span>" +
          '<a class="rd-download" href="' + esc(meta.file) + '" download>Download source ↓</a>' +
        "</div>" +
      "</header>"
    );
  }

  function tableHTML(rows, headerFirst) {
    if (!rows || !rows.length) return "";
    var html = '<div class="rd-table-scroll"><table class="rd-table">';
    rows.forEach(function (r, i) {
      var tag = headerFirst && i === 0 ? "th" : "td";
      html += "<tr>" + r.map(function (c) { return "<" + tag + ">" + esc(c) + "</" + tag + ">"; }).join("") + "</tr>";
    });
    return html + "</table></div>";
  }

  function renderDoc(data) {
    var html = '<article class="rd-doc">';
    data.blocks.forEach(function (b) {
      if (b.t === "h1") html += "<h2>" + esc(b.x) + "</h2>";
      else if (b.t === "h2") html += "<h3>" + esc(b.x) + "</h3>";
      else if (b.t === "h3") html += "<h4>" + esc(b.x) + "</h4>";
      else if (b.t === "li") html += '<p class="rd-li">' + esc(b.x) + "</p>";
      else if (b.t === "table") html += tableHTML(b.rows, true);
      else html += "<p>" + esc(b.x) + "</p>";
    });
    return html + "</article>";
  }

  function renderSheet(data) {
    var tabs = "", panes = "";
    data.sheets.forEach(function (s, i) {
      tabs += '<button class="rd-tab' + (i === 0 ? " on" : "") + '" data-sheet="' + i + '">' + esc(s.name) + "</button>";
      panes += '<section class="rd-pane' + (i === 0 ? " on" : "") + '" data-pane="' + i + '">' +
        tableHTML(s.rows, true) +
        (s.truncated ? '<p class="mono-meta rd-trunc">Showing first ' + s.rows.length + " of " + s.total_rows + " rows — full data in the source file.</p>" : "") +
        "</section>";
    });
    return '<div class="rd-tabs" role="tablist">' + tabs + "</div>" + panes;
  }

  function renderDeck(data) {
    return data.slides.map(function (s, i) {
      return (
        '<section class="rd-slide">' +
          '<p class="figcap">Slide ' + String(i + 1).padStart(2, "0") + "</p>" +
          (s.title ? "<h3>" + esc(s.title) + "</h3>" : "") +
          s.body.map(function (t) { return '<p class="rd-li">' + esc(t) + "</p>"; }).join("") +
        "</section>"
      );
    }).join("");
  }

  function renderPdf(data) {
    return (
      '<div class="rd-pdf-frame">' +
        '<iframe src="' + esc(data.src) + '#toolbar=0&navpanes=0" title="Document preview"></iframe>' +
      "</div>" +
      '<p class="mono-meta rd-trunc">Rendered by your browser’s PDF viewer, inside the portfolio.</p>'
    );
  }

  function renderSvg(data) {
    return '<div class="rd-svg-frame"><img src="' + esc(data.src) + '" alt="Workflow diagram"></div>';
  }

  function wireTabs() {
    var tabs = root.querySelectorAll(".rd-tab");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.classList.remove("on"); });
        root.querySelectorAll(".rd-pane").forEach(function (x) { x.classList.remove("on"); });
        t.classList.add("on");
        root.querySelector('[data-pane="' + t.dataset.sheet + '"]').classList.add("on");
      });
    });
  }

  var id = new URLSearchParams(location.search).get("id");
  if (!id) { fail("No artifact selected."); return; }

  Promise.all([
    fetch("content/artifacts.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
    fetch("assets/artifacts/content/" + encodeURIComponent(id) + ".json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("no content"); return r.json(); })
  ]).then(function (res) {
    var meta = res[0].artifacts.find(function (a) { return a.id === id; });
    var data = res[1];
    if (!meta) { fail("That artifact isn’t here anymore."); return; }
    document.title = meta.title + " · Sai Kiran Biswal";

    var body;
    if (data.type === "doc") body = renderDoc(data);
    else if (data.type === "sheet") body = renderSheet(data);
    else if (data.type === "deck") body = renderDeck(data);
    else if (data.type === "pdf") body = renderPdf(data);
    else if (data.type === "svg") body = renderSvg(data);
    else body = "";

    root.innerHTML = headerHTML(meta) + '<div class="rd-body">' + body + "</div>" +
      '<footer class="rd-foot"><a class="btn btn-ghost" href="artifacts.html">← Back to all artifacts</a></footer>';
    wireTabs();
  }).catch(function () {
    fail("That artifact isn’t here anymore.");
  });
})();

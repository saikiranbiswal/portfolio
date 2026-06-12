/* Draft preview loader for public pages.
   With ?preview=1, pages read CMS drafts from localStorage (written by
   admin.html "Preview") instead of the published content/*.json files.
   Preview is same-browser only — there is no external draft store. */
window.PreviewData = (function () {
  "use strict";

  function isPreview() {
    return new URLSearchParams(location.search).get("preview") === "1";
  }

  function localDraft(name) {
    try {
      var value = localStorage.getItem("cms_preview_" + name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  async function load(name, livePath) {
    if (isPreview()) {
      var draft = localDraft(name);
      if (draft) return draft;
    }
    try {
      var response = await fetch(livePath, { cache: "no-store" });
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  function banner() {
    if (!isPreview() || document.getElementById("draftPreviewBanner")) return;
    var el = document.createElement("div");
    el.id = "draftPreviewBanner";
    el.setAttribute("style", "position:sticky;top:0;z-index:9999;background:#fef3c7;color:#78350f;border-bottom:1px solid #f59e0b;padding:10px 20px;font:600 13px/1.4 monospace;text-align:center;");
    el.textContent = "⚠ Preview — this is your draft, not the live site";
    document.body.insertBefore(el, document.body.firstChild);
  }

  return { isPreview: isPreview, load: load, banner: banner };
}());

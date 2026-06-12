/* Shared Supabase-first preview loader for public pages. */
window.PreviewData = (function () {
  "use strict";

  var URL = "https://qasgswyjmnzhggqwuvqc.supabase.co";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYXNlIiwicmVmIjoicWFzZ3N3eWptbnpoZ2dxd3V2bnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDM1NjksImV4cCI6MjA5NjgxOTU2OX0.ImQkV19aEHNhizZr1TQjPNiBZQymIfxQ5_2NGoc8FdQ";
  var client = null;

  function isPreview() {
    return new URLSearchParams(location.search).get("preview") === "1";
  }

  function supabaseClient() {
    if (!client && window.supabase) client = window.supabase.createClient(URL, KEY);
    return client;
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
      try {
        var sb = supabaseClient();
        if (sb) {
          var result = await sb.from("cms_content").select("data").eq("id", name).maybeSingle();
          if (!result.error && result.data && result.data.data) return result.data.data;
        }
      } catch (error) {
        console.warn("[preview] Supabase draft unavailable:", error.message);
      }
      var fallback = localDraft(name);
      if (fallback) return fallback;
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

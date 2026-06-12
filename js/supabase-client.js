// Supabase connection + wrapper for PortfolioOS admin
//
// SETUP (one-time, if not already done):
//   1. Go to supabase.com → New project
//   2. Run supabase/schema.sql in the SQL Editor
//   3. Authentication → Users → Invite (your email + password)
//   4. Project Settings → API → copy Project URL + anon key below
//   5. Add the SDK to admin.html before </body>:
//        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//        <script src="js/supabase-client.js"></script>
//
// USAGE in admin.html:
//   const ok = await SB.signIn(email, password);
//   await SB.saveContent('products', obj);    // published content
//   const data = await SB.loadContent('products');
//   await SB.saveDraft('labs', obj);           // draft: stored as 'draft_labs'
//   const draft = await SB.loadDraft('labs');
//   await SB.deleteDraft('labs');
//   await SB.uploadImage(file);               // returns public URL string
//   await SB.signOut();

const SUPABASE_URL = 'PASTE_YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_KEY_HERE';

const _configured = SUPABASE_URL !== 'PASTE_YOUR_PROJECT_URL_HERE';
let _client = null;

function _getClient() {
  if (!_client) {
    if (!_configured) {
      console.warn('[SB] Supabase not configured — paste credentials into js/supabase-client.js');
      return null;
    }
    if (typeof supabase === 'undefined') {
      console.error('[SB] Supabase SDK not loaded — add the CDN <script> before this file');
      return null;
    }
    _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

const SB = {
  isReady() {
    return _configured && typeof supabase !== 'undefined';
  },

  async signIn(email, password) {
    const c = _getClient();
    if (!c) return false;
    const { error } = await c.auth.signInWithPassword({ email, password });
    if (error) { console.error('[SB] signIn:', error.message); return false; }
    return true;
  },

  async signOut() {
    const c = _getClient();
    if (c) await c.auth.signOut();
  },

  async currentUser() {
    const c = _getClient();
    if (!c) return null;
    const { data: { user } } = await c.auth.getUser();
    return user;
  },

  // Published content — table: cms_content, id = 'products' | 'labs' | 'about' | 'contact'
  async saveContent(fileKey, data) {
    const c = _getClient();
    if (!c) return false;
    const { error } = await c
      .from('cms_content')
      .upsert({ id: fileKey, data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) { console.error('[SB] saveContent:', error.message); return false; }
    return true;
  },

  async loadContent(fileKey) {
    const c = _getClient();
    if (!c) return null;
    const { data, error } = await c
      .from('cms_content')
      .select('data')
      .eq('id', fileKey)
      .maybeSingle();
    if (error) { console.error('[SB] loadContent:', error.message); return null; }
    return data ? data.data : null;
  },

  // Drafts — same cms_content table, id prefixed with 'draft_'
  async saveDraft(fileKey, content) {
    return this.saveContent('draft_' + fileKey, content);
  },

  async loadDraft(fileKey) {
    return this.loadContent('draft_' + fileKey);
  },

  async deleteDraft(fileKey) {
    const c = _getClient();
    if (!c) return;
    await c.from('cms_content').delete().eq('id', 'draft_' + fileKey);
  },

  async loadAllDrafts() {
    const c = _getClient();
    if (!c) return {};
    const { data, error } = await c
      .from('cms_content')
      .select('id, data')
      .like('id', 'draft_%');
    if (error) { console.error('[SB] loadAllDrafts:', error.message); return {}; }
    return Object.fromEntries((data || []).map(r => [r.id.replace('draft_', ''), r.data]));
  },

  // Image upload — storage bucket: portfolio-assets
  // Returns the public URL string, or null on failure.
  async uploadImage(file, path) {
    const c = _getClient();
    if (!c) return null;
    const dest = path || `uploads/${Date.now()}-${file.name}`;
    const { error } = await c.storage.from('portfolio-assets').upload(dest, file, { upsert: true });
    if (error) { console.error('[SB] uploadImage:', error.message); return null; }
    const { data } = c.storage.from('portfolio-assets').getPublicUrl(dest);
    return data.publicUrl;
  },
};

window.SB = SB;

# Sai Kiran Biswal — Product Portfolio (CMS)

A live, editable portfolio. Public showcase reads from `products.json`; a
password-gated admin panel edits projects and exports an updated `products.json`.

## Structure

```
portfolio/
├── index.html              # immersive spherical portfolio landing page
├── products.html           # public showcase (flagship + work grid + modal)
├── about.html              # rebranded
├── contact.html            # rebranded, real email/links
├── admin.html              # GitHub-token-authed editor (encrypted, noindex)
├── products.json           # SINGLE SOURCE OF TRUTH
├── css/  (styles.css, modal.css, admin.css, labs.css)
├── js/   (site.js, reveal.js, labs-app.js, labs-data.js)
├── assets/ (resume.pdf, screenshots/)
└── apps/ (one folder per project, each with index.html)
```

## Two things to know up front (these are real, not bugs)

**1. Open it through a server, not by double-clicking.**
`index.html`, `products.html`, and `admin.html` use `fetch("products.json")`. Browsers block
that over the `file://` protocol, so opening the HTML directly shows an empty
grid. Run a tiny local server instead:

```bash
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000/
```

(Once deployed to GitHub Pages / Netlify / Vercel, it's served over HTTP and
just works — this only matters for local testing.)

**2. The admin page authenticates with a GitHub token, not a password.**
`admin.html` is intentionally published. It signs in with a GitHub fine-grained
token (Contents: read/write on this repo) that you enter in-browser. The token is
encrypted with a passphrase and stored only in your browser's localStorage — it is
never committed. The page also carries `noindex,nofollow` to keep it out of search
engines. There is no hardcoded password.

## How editing actually works

A web page can't write to files on disk, so the admin commits through the GitHub API:

1. Open `admin.html` → unlock with your passphrase → it loads your encrypted token
   (first-time setup: paste a GitHub fine-grained token and set a passphrase).
2. Add / edit / delete / drag-reorder content. Changes are saved in your browser as
   a draft as you go.
3. Publish → the admin commits the updated JSON (e.g. `content/products.json`) to the
   repo via the GitHub API. No manual export/replace step is required.

## Screenshots

Cards look for `assets/screenshots/<id>.png` and fall back to a placeholder
block if the file is missing. Drop in real shots named to match each project
`id` (e.g. `collections-cloud.png`) to replace the placeholders.

## Deploy (GitHub Pages example)

```bash
cd portfolio
git init && git add . && git commit -m "Portfolio CMS"
# create a repo on github.com, then:
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
# Settings → Pages → deploy from main / root
```

Keep `admin.html` out of the public branch if you don't want it live.

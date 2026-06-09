# Sai Kiran Biswal — Product Portfolio (CMS)

A live, editable portfolio. Public showcase reads from `products.json`; a
password-gated admin panel edits projects and exports an updated `products.json`.

## Structure

```
portfolio/
├── index.html              # redirects to products.html
├── products.html           # public showcase (flagship + work grid + modal)
├── about.html              # rebranded
├── contact.html            # rebranded, real email/links
├── admin.html              # password-gated editor (password: portfolio123)
├── products.json           # SINGLE SOURCE OF TRUTH
├── css/  (styles.css, modal.css, admin.css, labs.css)
├── js/   (site.js, reveal.js, labs-app.js, labs-data.js)
├── assets/ (resume.pdf, screenshots/)
└── apps/ (one folder per project, each with index.html)
```

## Two things to know up front (these are real, not bugs)

**1. Open it through a server, not by double-clicking.**
`products.html` and `admin.html` use `fetch("products.json")`. Browsers block
that over the `file://` protocol, so opening the HTML directly shows an empty
grid. Run a tiny local server instead:

```bash
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000/products.html
```

(Once deployed to GitHub Pages / Netlify / Vercel, it's served over HTTP and
just works — this only matters for local testing.)

**2. The admin password is UI-gating, not security.**
`portfolio123` lives in `admin.html`'s source, which anyone can read. It stops a
casual visitor, nothing more. For real protection either:
- don't deploy `admin.html` publicly (edit locally, push `products.json`), or
- put host-level auth in front of it (Netlify/Vercel password, Cloudflare Access,
  or `.htaccess`).

## How editing actually works

A web page can't write to files on disk, so the flow is:

1. Open `admin.html` → enter `portfolio123`.
2. Add / edit / delete / drag-reorder projects. Changes are saved in your
   browser as a draft as you go.
3. Click **Export products.json** → downloads the updated file.
4. Replace the `products.json` in your repo with that download, commit, push.

That's the "saves to products.json" step — export is the bridge between the
browser and your files.

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

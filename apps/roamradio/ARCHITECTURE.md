# RoamRadio architecture

## Product boundary

RoamRadio is a static client-side PWA. It does not proxy, download, re-host, or cache station audio. Playback goes directly from the listener's browser to each third-party station stream.

```text
GitHub Pages
   │
   ├─ app shell (HTML/CSS/JS + PWA)
   │
   ├─ Radio Browser JSON API
   │    ├─ station search
   │    ├─ countries / languages
   │    ├─ station geo coordinates
   │    └─ station click counter / resolved URL
   │
   ├─ Browser Geolocation
   │    └─ local Haversine distance calculation
   │
   ├─ HTMLAudioElement ────────> station stream
   │
   └─ localStorage
        ├─ favorites
        ├─ recent stations
        └─ travel settings
```

## Reliability choices

- Only request directory entries marked non-broken and HTTPS.
- Prefer direct non-HLS stations when the browser cannot play HLS natively.
- Mirror failover between current Radio Browser mirrors.
- Use the station click endpoint before playback when possible.
- Auto-skip a stream that fails to start, unless the user disables it.
- Never cache audio in the service worker.
- Stale async searches are ignored so a late API response cannot overwrite a newer user request.
- App settings survive API downtime because they are local.

## Travel features

- Mood presets translate to live station tags.
- Country and language filters come from the directory.
- "Stations near me" requests location only on user action, downloads geotagged directory results and computes distance locally.
- Data Saver caps directory results at 128 kbps.
- Driving mode uses large controls and requests Screen Wake Lock where supported.
- Media Session metadata/actions are provided where supported for lock-screen/headset controls.
- Sleep timer stops playback locally.

## Hosting

There is no runtime server requirement. GitHub Pages, Cloudflare Pages, Netlify static hosting or any normal static web server can host the same files.

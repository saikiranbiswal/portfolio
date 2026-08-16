# RoamRadio

A travel-first internet radio PWA that can be hosted as a static site for free on GitHub Pages.

## What it uses

- **Radio Browser API** for station search, genres/tags, countries, station geo coordinates and click tracking.
- **Browser Geolocation** for "Stations near me"; distance is calculated locally with the Haversine formula.
- **HTMLAudioElement** for direct station playback.
- **Media Session API** for supported lock-screen/headset controls.
- **Screen Wake Lock API** for supported driving-mode devices.
- **localStorage** for favorites, recents and travel settings.
- **Service Worker** for the application shell. Audio streams are not cached.

No backend, database, API key, account or paid service is required.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Important behavior

Internet-radio streams belong to third-party stations. A directory entry can be live when indexed and fail later, change codecs, or reject a particular browser. RoamRadio filters known-broken and non-HTTPS results, skips unsupported HLS where necessary, and can automatically move to the next station.

The Radio Browser service is free but explicitly offered without an uptime guarantee, so RoamRadio uses mirror failover and degrades to saved stations if the directory is unavailable.

## Test mode

Append `?mock=1&test=1` to use deterministic mock stations without internet access. This is used by the QA harness.

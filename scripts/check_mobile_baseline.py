#!/usr/bin/env python3
"""
Guard: every app under apps/ must carry the shared mobile baseline.

Why this exists. The baseline (apps/_shared/mobile.css) shipped in June 2026 and was
wired into the apps that existed then. Every app added afterwards missed it, and the
gap was invisible because a missing stylesheet breaks nothing that a status code or a
console check can see. It only shows up on a phone. This script makes the omission
loud at build time instead.

Two wiring styles are valid, because the apps load in two different ways:

  head-link   A plain <link rel="stylesheet" href="../_shared/mobile.css"> in <head>.
  post-write  Apps that fetch a gzipped payload and call document.open()/write()/close()
              replace the whole document, discarding the loader's <head>. They must
              re-attach the stylesheet AFTER document.close() instead.

Run:
    python3 scripts/check_mobile_baseline.py

Exits non-zero and names the offenders if any app is unwired.
"""
import re
import sys
from pathlib import Path

APPS = Path(__file__).resolve().parent.parent / "apps"
SHARED = "_shared/mobile.css"

# Deliberate exclusions. Keep this list short and always state the reason:
# an entry here is a decision, not a backlog item.
EXEMPT = {
    "neuralpath": "Already mobile-native and intentionally locks zoom with "
                  "maximum-scale=1. The baseline's rules fight that design.",
}


def classify(html: str) -> str:
    """Return the wiring style an app uses, or '' if it has none."""
    if not re.search(r"_shared/mobile\.css", html):
        return ""
    rewrites = "document.write" in html
    # A post-write app must attach the stylesheet after the rewrite, not in <head>.
    after_close = re.search(
        r"document\.close\(\)[\s\S]{0,400}?_shared/mobile\.css", html
    )
    if rewrites:
        return "post-write" if after_close else ""
    return "head-link"


def main() -> int:
    missing, wired = [], []
    for app in sorted(p for p in APPS.iterdir() if p.is_dir() and p.name != "_shared"):
        index = app / "index.html"
        if not index.exists():
            continue
        if app.name in EXEMPT:
            wired.append((app.name, "exempt"))
            continue
        style = classify(index.read_text(errors="ignore"))
        if style:
            wired.append((app.name, style))
        else:
            missing.append(app.name)

    for name, style in wired:
        print(f"  ok       {name:26} {style}")
    for name in missing:
        print(f"  MISSING  {name:26} no mobile baseline")

    print(f"\n{len(wired)} wired ({len(EXEMPT)} exempt), {len(missing)} missing")
    if missing:
        print(
            "\nWire each one up. Plain apps take a <link> before </head>; apps that "
            "call document.write must re-attach it after document.close().",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

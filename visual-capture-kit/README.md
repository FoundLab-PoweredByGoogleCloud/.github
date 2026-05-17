# FoundLab Visual Capture Kit

Organizational visual evidence runner for production and preview UIs.

This kit captures deterministic desktop/mobile screenshots with Playwright and uploads the result as a GitHub Actions artifact.

## What it provides

- Reusable GitHub Actions workflow.
- Chromium-based screenshots via Playwright.
- Desktop and mobile default viewports.
- Multi-route capture.
- Optional readiness selector.
- Artifact upload containing PNG files and `manifest.json`.
- Structured JSON logs.

## Reusable workflow

Consumer repositories should call:

```yaml
jobs:
  visual-capture:
    uses: FoundLab-PoweredByGoogleCloud/.github/.github/workflows/visual-capture.yml@main
    with:
      url: https://example.com
      routes: /,/login,/pricing
      artifact-name: production-visual-capture
```

For production hardening, pin the workflow to a protected tag or commit SHA instead of `@main`.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `url` | yes | — | Base URL to capture. |
| `routes` | no | empty | Comma-separated routes. Empty captures only the base URL. |
| `artifact-name` | no | `visual-capture` | GitHub artifact name. |
| `wait-ms` | no | `2500` | Extra stabilization wait before screenshot. |
| `full-page` | no | `true` | Capture full page instead of viewport only. |
| `ready-selector` | no | empty | CSS selector that must be visible before capture. |
| `viewports-json` | no | desktop/mobile | JSON array of custom viewport targets. |
| `fail-fast` | no | `false` | Stop on first failed capture. |

## Default outputs

```txt
artifacts/screenshots/root-desktop.png
artifacts/screenshots/root-mobile.png
artifacts/screenshots/manifest.json
```

For multiple routes, the output pattern is:

```txt
artifacts/screenshots/<route>-<viewport>.png
```

Example:

```txt
artifacts/screenshots/login-desktop.png
artifacts/screenshots/login-mobile.png
```

## Manifest contract

```json
{
  "schema": "foundlab.visual_capture.v1",
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "input": {
    "captureUrl": "https://example.com",
    "routes": ["/", "/login"],
    "viewports": [
      {
        "label": "desktop",
        "viewport": {
          "width": 1440,
          "height": 900
        }
      }
    ],
    "fullPage": true,
    "waitMs": 2500,
    "readySelector": null
  },
  "summary": {
    "total": 2,
    "passed": 2,
    "failed": 0
  },
  "results": []
}
```

## Production deploy example

```yaml
name: Deploy Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run deploy

  visual-capture:
    needs: deploy
    uses: FoundLab-PoweredByGoogleCloud/.github/.github/workflows/visual-capture.yml@main
    with:
      url: https://app.example.com
      routes: /,/login,/dashboard
      artifact-name: production-screenshots
      ready-selector: "[data-ready='app']"
```

## Local execution

```bash
cd visual-capture-kit
npm install
npx playwright install chromium
CAPTURE_URL=http://localhost:3000 npm run capture
```

Optional variables:

```bash
CAPTURE_URL=http://localhost:3000 \
CAPTURE_ROUTES=/,/login,/pricing \
CAPTURE_DIR=artifacts/screenshots \
CAPTURE_WAIT_MS=2500 \
CAPTURE_FULL_PAGE=true \
CAPTURE_READY_SELECTOR="[data-ready='app']" \
npm run capture
```

## Recommended versioning

- Development: `@main`.
- Production: protected tag like `@v1`.
- High-assurance production: commit SHA.

Avoid calling mutable branches from critical release workflows unless the branch is protected.

## Roadmap

- v1: screenshots and manifest artifacts.
- v2: authenticated capture via Playwright storage state.
- v3: visual diff against baseline.
- v4: release evidence bundle with signed provenance.

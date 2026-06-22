# 13 — Tooling, Deployment, and Debugging

## GitHub

Repository:
https://github.com/pramitranjann/trace

## Vercel

Hosting:
Vercel

Every meaningful feature should be tested through a Vercel Preview URL.

Localhost is not enough for camera features.

## Recommended Packages

```bash
npm install framer-motion tesseract.js @mediapipe/tasks-vision
npm install @vercel/analytics @vercel/speed-insights
npm install @vercel/toolbar
npm install -D @playwright/test
```

## Sentry

Recommended early because camera/OCR bugs are hard to debug remotely.

```bash
npx @sentry/wizard@latest -i nextjs
```

Capture:
- OCR failures
- camera permission failures
- MediaPipe initialization failures
- browser compatibility issues

## GitHub Actions

Add CI for:

- lint
- typecheck
- build

Example workflow:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

## Package Scripts

Recommended:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test"
  }
}
```

## Vercel Toolbar

Use Vercel Toolbar for:
- preview feedback
- comments
- visual QA
- easier remote debugging

## Deployment Requirement

A feature is done only when:
- it builds
- it deploys to Vercel
- it works on a phone through the preview URL

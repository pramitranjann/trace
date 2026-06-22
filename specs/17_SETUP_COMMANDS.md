# 17 — Setup Commands

## Clone

```bash
git clone https://github.com/pramitranjann/trace.git
cd trace
```

## Create Next App If Repo Is Empty

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir
```

## Install Core Dependencies

```bash
npm install framer-motion tesseract.js @mediapipe/tasks-vision
```

## Install Vercel Tooling

```bash
npm install @vercel/analytics @vercel/speed-insights @vercel/toolbar
```

## Install Testing

```bash
npm install -D @playwright/test
npx playwright install
```

## Install Sentry

```bash
npx @sentry/wizard@latest -i nextjs
```

## Run Development

```bash
npm run dev
```

## Typecheck

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Vercel

Connect the GitHub repo to Vercel.

Then every push should create a preview deployment.

## Recommended First Agent Prompt

Read AGENTS.md first.
Then read CURRENT_TASK.md, HANDOFF.md, DECISIONS.md, and README_INDEX.md.
Implement the app shell and A-E data model.
Do not expand scope.
Update HANDOFF.md before finishing.

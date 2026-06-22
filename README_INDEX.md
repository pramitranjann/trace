# Trace V4 Spec Pack Index

This pack is designed for quick shipping with Claude Code and Codex used interchangeably.

## Root Files

### AGENTS.md

Main source of truth for all coding agents. Read first.

### CLAUDE.md

Claude-specific instructions. Points Claude back to AGENTS.md.

### CODEX.md

Codex-specific instructions. Points Codex back to AGENTS.md.

### CURRENT_TASK.md

The current active task. Update this when the work changes.

### HANDOFF.md

The handoff log. Update before switching agents or ending a session.

### DECISIONS.md

Product and engineering decisions that should not be reopened casually.

### PROJECT_CONTEXT.md

Project background and product intent.

### README_INDEX.md

This file.

## Specs Folder

### 00_EXECUTIVE_SUMMARY.md

Short overview of the whole project.

### 01_PRODUCT_VISION.md

Longer product vision and future direction.

### 02_PROBLEM_AND_HMW.md

Problem statement and HMW.

### 03_MVP_SCOPE_AND_BUILD_BOUNDARIES.md

What is in and out of MVP.

### 04_PRODUCT_REQUIREMENTS.md

Functional requirements for See, Hear, Produce.

### 05_USER_FLOWS_AND_SCREEN_STATES.md

Screen-by-screen flows.

### 06_UX_PRINCIPLES_BEFORE_UI_IMPORT.md

UX rules before final UI is designed/imported.

### 07_DESIGN_SYSTEM_BRIEF_FOR_FUTURE_UI_IMPORT.md

Temporary design system and future UI considerations.

### 08_RESPONSIVE_CAMERA_REQUIREMENTS.md

Phone/desktop and camera behavior.

### 09_TECH_ARCHITECTURE.md

Stack, structure, and code snippets.

### 10_COMPONENT_CONTRACTS.md

Component responsibilities and TypeScript interfaces.

### 11_IMPLEMENTATION_PLAN_ONE_LONG_SPRINT.md

One long sprint plan to ship all modes.

### 12_ANALYTICS_AND_TESTING.md

Events, QA, and user testing.

### 13_TOOLING_DEPLOYMENT_DEBUGGING.md

GitHub, Vercel, Sentry, Playwright, deployment.

### 14_ASSET_AND_CONTENT_SYSTEM.md

Letters, words, sounds, paths, placeholder assets.

### 15_RISKS_AND_DECISIONS.md

Risks, mitigations, and product assumptions.

### 16_GITHUB_ISSUES_BACKLOG.md

Prewritten issues.

### 17_SETUP_COMMANDS.md

Useful setup and install commands.

## Recommended Agent Prompt

Use this for either Claude or Codex:

Read AGENTS.md first.
Then read CURRENT_TASK.md, HANDOFF.md, DECISIONS.md, and README_INDEX.md.
Continue the current task only.
Do not expand scope.
Before finishing, update HANDOFF.md.

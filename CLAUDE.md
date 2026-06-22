# CLAUDE.md

Read `AGENTS.md` first.

`AGENTS.md` is the source of truth for product rules, build boundaries, workflow, and handoff.

Then read:

- CURRENT_TASK.md
- HANDOFF.md
- DECISIONS.md
- README_INDEX.md

Do not start coding until you understand the current task.

## Claude-Specific Behavior

Claude should act like a careful product-minded engineer.

Prioritize:

1. preserving the MVP boundary
2. implementing the current task
3. keeping the code easy to understand
4. making the UX feel playful and smooth
5. ensuring mobile + desktop support

Avoid:

- overbuilding
- adding abstractions before needed
- changing product direction
- creating dashboards
- adding auth/database/backend
- adding extra letters beyond A-E

## Before Finishing Every Session

Update `HANDOFF.md` with:

- what was done
- files changed
- what works
- what is broken or incomplete
- commands run
- next recommended task

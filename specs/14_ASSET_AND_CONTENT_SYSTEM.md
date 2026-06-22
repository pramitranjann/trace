# 14 — Asset and Content System

## MVP Content

| Letter | Word | Emoji |
| --- | --- | --- |
| A | Apple | 🍎 |
| B | Ball | 🏀 |
| C | Cat | 🐱 |
| D | Dog | 🐶 |
| E | Elephant | 🐘 |

## Asset Types

### Required Now

- letter data
- trace paths
- basic icons
- temporary sound feedback
- temporary success animations

### Can Be Placeholder

- illustrations
- mascot
- custom audio
- brand graphics

## Trace Paths

Use normalized coordinates from 0 to 1.

Example A path:

```ts
[
  { x: 0.5, y: 0.1 },
  { x: 0.2, y: 0.9 },
  { x: 0.5, y: 0.1 },
  { x: 0.8, y: 0.9 },
  { x: 0.32, y: 0.55 },
  { x: 0.68, y: 0.55 }
]
```

## Sound Strategy

MVP:
- Web Speech API for letters/words
- simple browser-generated or free placeholder SFX

Later:
- custom child-friendly voice
- custom success sounds
- mode-specific sound identity

## Icon Strategy

Temporary:
- emoji are acceptable
- simple lucide/react-icons are acceptable

Later:
- custom icons and illustration system

## UI Import Readiness

Assets should be referenced through a content layer, not hardcoded across components.

Good:
`letter.emoji`

Bad:
hardcoding 🍎 in five separate files.

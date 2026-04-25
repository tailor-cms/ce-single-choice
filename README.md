# Single Choice

Gradable single choice question element. Learners select one correct answer
from a list of options.

**Type:** `SINGLE_CHOICE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `question` | `string[]` | Embedded question (Tiptap HTML) element ids |
| `embeds` | `Record<string, any>` | Embedded element map keyed by id |
| `answers` | `string[]` | List of answer options |
| `correct` | `number \| null?` | Index of the correct answer (gradable only) |
| `feedback` | `Record<number, string>` | Per-answer feedback keyed by index |
| `hint` | `string` | Optional hint shown to the learner |
| `isGradable` | `boolean?` | Whether the question is graded |

## Edit

- Question prompt area (embedded Tiptap element)
- Answer list with radio selector for the correct answer
- Add/remove answer controls (minimum of two answers)
- Per-answer feedback and hint fields (question form)
- Non-gradable mode renders numbered options instead of radio selectors

## Display

- Selectable answer cards with A/B/C/D style indicators
- Requires a selection before submit
- On submit, selected card is color-coded as correct (green) or incorrect (red)
- Retry restores the initial state

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```

# Matura Angielski

Interactive preparation for the Polish English matura exam (Formuła 2023): 14 CKE topic modules with flashcards, picture description, grammar with tests, vocabulary texts and writing practice. Two learner profiles and a teacher panel with progress overview.

## Run

```
cd app
npm install
npm run dev
```

Opens on http://localhost:5173 (or the next free port).

## Layout

- `app/` — the web app (React 19, TypeScript, Vite, Tailwind 4).
- `Spec/` — product spec, design system notes, illustration brief and prompt for Antigravity.
- `Грамматика и лексика (…)`, `Устная часть (…)` — source material the modules are built from.

Illustrations for the vocabulary section are expected in `app/public/images/vocab/`; `node scripts/check-vocab-images.mjs` (from `app/`) lists what is still missing.

# Matura Angielski

Interactive preparation for the Polish English matura exam (Formuła 2023): 14 CKE topic modules with flashcards, picture description, grammar with tests, vocabulary texts and writing practice. Two learner profiles and a teacher panel with progress overview.

## Run

```
cd app
npm install
npm run dev
```

Opens on http://localhost:5173 (or the next free port).

## Addresses

Every profile has its own link; the first segment of the hash is the user id:

- `/#maria` or `/#maria/dashboard` — Maria's progress dashboard
- `/#evgeny/czlowiek/slownictwo` — Evgeny, module "Człowiek", vocabulary tab
- `/#teacher` — teacher panel; `/#teacher/dashboard/maria` — the teacher looking at Maria

A link without a profile (`/#czlowiek/gramatyka`) opens with the profile last used in that browser.

Every text and exercise has its own link, for homework:

- `/#czlowiek/slownictwo/czl-txt-2` — one vocabulary text with its gap-fill, on its own page
- `/#czlowiek/gramatyka/gram-2` — opens the grammar section at that rule; `/#czlowiek/gramatyka/test` — at the test
- `/#czlowiek/opis-foto`, `/#czlowiek/pisanie`, `/#czlowiek/fiszki` — the one exercise of each of these sections

Every text, rule, test and section has a "Kopiuj link" button. It copies the link without the profile, so whoever opens it lands in their own profile, right at that text or exercise.

## Layout

- `app/` — the web app (React 19, TypeScript, Vite, Tailwind 4).
- `Spec/` — product spec, design system notes, illustration brief and prompt for Antigravity.
- `Грамматика и лексика (…)`, `Устная часть (…)` — source material the modules are built from.

Illustrations for the vocabulary section are expected in `app/public/images/vocab/`; `node scripts/check-vocab-images.mjs` (from `app/`) lists what is still missing.

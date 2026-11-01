# Matura Angielski

Interactive preparation for the Polish English matura exam (Formuła 2023): 14 CKE topic modules with flashcards, picture description, grammar with tests, vocabulary texts, language functions (Środki językowe) and writing practice. Two learner profiles and a teacher panel with progress overview.

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
- `/#czlowiek/srodki/czl-sj-2` — one Środki językowe exercise on its own page
- `/#czlowiek/gramatyka/gram-2` — opens the grammar section at that rule; `/#czlowiek/gramatyka/test` — at the test
- `/#czlowiek/opis-foto`, `/#czlowiek/pisanie`, `/#czlowiek/fiszki` — the one exercise of each of these sections

Flashcards have their own module, with the same decks as the topic tabs:

- `/#fiszki` — all decks; `/#fiszki/czlowiek` — one deck; `/#fiszki/powtorka` — every card marked "Do powtórki", from all topics

To add a word to a deck, select it in a vocabulary text or press "+" in the word list; it goes to the deck of the open topic. The signed-in teacher can choose a student in the "Fiszki dla:" bar above the texts: the card then goes to that student's deck and reaches their browser within 20 seconds. These cards are stored on the server, and the teacher edits them on the student's page, in the "Fiszki" tab.

Every text, rule, test and section has a "Kopiuj link" button. It copies the link without the profile, so whoever opens it lands in their own profile, right at that text or exercise.

## Środki językowe exercises

Each module has four exercises in `app/src/data/languageUseExercises.ts`, keyed by module id: `matching`, `word-bank` and `mini-dialogue` (the types are in `app/src/types/index.ts`). To add one, append an object with the next id (`<module prefix>-sj-<n>`) to the module's list; an id is a link address, so it never changes. In a dialogue the gap is the line with `text: null`. The rules for good items are in the comment at the top of the file and in `Spec/Spec - Srodki jezykowe.md` §4.3.

`validateLanguageUseExercises()` runs on every `vite` start and build: a wrong key, a word missing from the frame or a duplicate id stops the build and names the exercise.

## Layout

- `app/` — the web app (React 19, TypeScript, Vite, Tailwind 4).
- `Spec/` — product spec, design system notes, illustration brief and prompt for Antigravity.
- `Грамматика и лексика (…)`, `Устная часть (…)` — source material the modules are built from.

Illustrations for the vocabulary section are expected in `app/public/images/vocab/`; `node scripts/check-vocab-images.mjs` (from `app/`) lists what is still missing.

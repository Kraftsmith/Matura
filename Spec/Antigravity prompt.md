# Prompt for Antigravity (copy everything below the line into its chat)

---

Open the repository "Matura Angelski" and read `Spec/Illustrations for Antigravity.md` in full before doing anything else. It is the brief for 18 illustrations.

Task: generate all 18 illustrations and save them as PNG files in `app/public/images/vocab/`, using exactly the file names from the brief (section "The 18 images"). Each file must be 1200 × 800 px, landscape, no text or letters inside the picture, one consistent flat-vector editorial style for the whole set, light backgrounds and the accent blue #0056D2 used sparingly.

For every image, first read the matching text in `app/src/data/vocabularyTexts.ts` (the `paragraphs` and `image.alt` of the item whose `image.src` ends with that file name), then draw the scene it describes. The characters, place, time of day and mood must match the story.

Work through the list in order, 1 to 18, and save each file immediately after generating it. Do not change any other file in the repository and do not rename anything.

When you are done, run from the `app` folder:

```
node scripts/check-vocab-images.mjs
```

It prints which files are missing or have the wrong size. Fix everything it reports and run it again until it says "18/18 ready". Then open `http://localhost:5174/#czlowiek/slownictwo` and confirm the pictures are visible above each text.

# Prompt for Antigravity: one illustration (copy everything below the line)

---

Open the repository "Matura Angelski". Generate ONE illustration and save it as a PNG file at exactly this path:

`app/public/images/vocab/czlowiek-6-beliefs.png`

Scene: the inside of a modern city bus in a Polish town, seen from the seat behind two passengers who are turned slightly towards each other and talking with animated faces. On the left, a slightly overweight woman in her mid-fifties with neat hair, a long skirt, sensible flat shoes and a pearl necklace. On the right, a muscular teenage boy with a small lip piercing and an orange hoodie pulled up over his black curly hair. Above them a shared thought bubble contains a ladder, a crystal ball and a few stars, hinting at superstitions. Through the bus windows a daytime street with terraced houses. Light, slightly humorous mood. Read the text "Unusual beliefs" in `app/src/data/vocabularyTexts.ts` (item `czl-txt-6`) before drawing, so the picture matches it.

Format: 1200 × 800 px, landscape (3:2), PNG. Keep both people in the central 80 % of the frame because the app crops the edges.

Style: clean editorial flat-vector illustration with soft shading, like a quality language-course textbook. Light background, muted colours, one accent blue #0056D2 used sparingly. Realistic proportions, everyday clothing. No text, letters, numbers or logos anywhere in the picture; bus signs and posters must be blank. No borders, frames or drop shadows in the file.

Do not change any other file in the repository and do not rename anything. When the file is saved, run from the `app` folder:

```
node scripts/check-vocab-images.mjs
```

and confirm that `czlowiek-6-beliefs.png` is no longer listed as missing or wrong-sized. Then open `http://localhost:5174/#czlowiek/slownictwo` and check that the last card shows the picture instead of the grey placeholder.

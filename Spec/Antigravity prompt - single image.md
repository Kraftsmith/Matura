# Prompt for Antigravity: one illustration (copy everything below the line)

---

Open the repository "Matura Angelski". Generate ONE illustration and save it as a PNG file at exactly this path:

`app/public/images/vocab/czlowiek-1-appearance.png`

Scene: two old friends meeting on a railway platform in a Polish city. A tall, broad-shouldered, well-built man in his mid-thirties with a short beard and hair just starting to go grey at the temples, wearing a slightly scruffy jacket and worn jeans, has just stepped off a train. He is smiling a cheeky smile at a young woman with shoulder-length hair and freckles who is waiting for him. Daytime, modern station, a train in the background. Warm, friendly mood. Read the text "First impressions" in `app/src/data/vocabularyTexts.ts` (item `czl-txt-1`) before drawing, so the picture matches it.

Format: 1200 × 800 px, landscape (3:2), PNG. Keep both people in the central 80 % of the frame because the app crops the edges.

Style: clean editorial flat-vector illustration with soft shading, like a quality language-course textbook. Light background, muted colours, one accent blue #0056D2 used sparingly. Realistic proportions, everyday clothing. No text, letters, numbers or logos anywhere in the picture; station signs must be blank. No borders, frames or drop shadows in the file.

Do not change any other file in the repository and do not rename anything. When the file is saved, run from the `app` folder:

```
node scripts/check-vocab-images.mjs
```

and confirm that `czlowiek-1-appearance.png` is no longer listed as missing or wrong-sized. Then open `http://localhost:5174/#czlowiek/slownictwo` and check that the first card shows the picture instead of the grey placeholder.

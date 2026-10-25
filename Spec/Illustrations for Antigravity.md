# Illustrations for the "Słownictwo" section — brief for Antigravity

The Matura Angielski app shows one English reading text per CKE subtopic in the **Słownictwo** tab of each module. Every text has an illustration slot at the top of its card. The app already references the files listed below; until a file exists the card shows a grey "Ilustracja w przygotowaniu" placeholder, so you can deliver images in any order.

## Deliverables

- **19 PNG files**, names exactly as listed below (lowercase, hyphens, `.png`).
- **Location:** `app/public/images/vocab/` (the folder exists). The app loads them as `/images/vocab/<name>.png`. No code changes are needed.
- **Size:** 1200 × 800 px (3:2 landscape). The card crops with `object-cover`, so keep the subject in the central 80 % of the frame. The same file opens in a full-screen lightbox, so avoid heavy compression artefacts.
- Source texts and alt descriptions live in `app/src/data/vocabularyTexts.ts`. Please read the text of each item before drawing it; the scene must match the story.

## Style (one set for all 19, so the module feels like one book)

- Clean editorial flat-vector illustration with soft shading. Calm, modern, slightly warm. Think a quality language-course textbook, not clip art and not photorealism.
- Palette: light backgrounds (`#F0F6F9` / white), one accent blue `#0056D2` used sparingly, muted secondary colours. No neon, no gradients across the whole image, no dark moody scenes.
- People: realistic proportions, diverse, everyday clothing, expressive faces where the text is about emotions. Teenagers and young adults as the default cast, since the learners are 18–19.
- Setting: contemporary Poland / Central Europe (trams, terraced houses, school corridors, Baltic-style coast) unless the text says otherwise.
- **No text, letters, numbers or logos inside the image.** Signs and posters should be blank or abstract.
- No borders, frames or drop shadows baked into the file; the app adds rounded corners.
- Consistent line weight and lighting direction across the set.

## The 19 images

## Człowiek

### 1. `czlowiek-1-appearance.png`

- **Text:** "First impressions" (Physical appearance)
- **Scene:** Two friends meeting at a railway station: a tall man with a beard and a young woman with shoulder-length hair and freckles.
- **Key words the picture should support:** broad-shouldered, well-built, go grey, in his mid-thirties, scruffy, impeccable

### 2. `czlowiek-2-character.png`

- **Text:** "What makes a good friend?" (Personality and character)
- **Scene:** Four teenagers of different personalities working together on a school project around a table.
- **Key words the picture should support:** trustworthy, reliable, conscientious, stubborn, easy-going, hypocritical

### 3. `czlowiek-3-emotions.png`

- **Text:** "A rollercoaster of emotions" (Feelings, emotions and body language)
- **Scene:** A student opening an envelope with exam results in a school corridor while friends wait with anxious and happy faces.
- **Key words the picture should support:** apprehensive, fold your arms, frown, shrug, burst into tears, ecstatic

### 4. `czlowiek-4-stages.png`

- **Text:** "Stages of life" (Personal details and stages of life)
- **Scene:** A family timeline: a toddler, a teenager, a woman in her thirties with a baby, and an elderly man in a garden.
- **Key words the picture should support:** toddler, bring up, adolescence, come of age, in his early thirties, middle-aged

### 5. `czlowiek-5-role-models.png`

- **Text:** "Who do you look up to?" (Interests, skills and role models)
- **Scene:** A teenage girl at a workbench building a robot, with a poster of a famous woman scientist on the wall behind her.
- **Key words the picture should support:** role model, look up to, dedicated, inspire, take up, admire

### 6. `czlowiek-6-beliefs.png`

- **Text:** "Unusual beliefs" (Appearance, character and beliefs)
- **Scene:** Two passengers on a city bus deep in conversation: a woman in her mid-fifties with a pearl necklace and a teenage boy in an orange hoodie, with a thought bubble showing a ladder and a crystal ball.
- **Key words the picture should support:** overweight, in her mid-fifties, sensible, adolescent, lively, superstitious

## Miejsce zamieszkania

### 7. `miejsce-zamieszkania-1-flat.png`

- **Text:** "Moving out" (Types of housing, rooms and the neighbourhood)
- **Scene:** A young woman carrying a box into a small bright attic flat with a sloping ceiling and a view of city rooftops.
- **Key words the picture should support:** rented, attic, terraced house, rent, cosy, well-equipped

## Edukacja

### 8. `edukacja-1-exams.png`

- **Text:** "Exam season" (School life, exams and assessment)
- **Scene:** A school library in the evening: students revising with notes, laptops and coffee cups, one of them yawning.
- **Key words the picture should support:** revise, leaving exam, cram, cheat, hard-working, keep up with

## Praca

### 9. `praca-1-interview.png`

- **Text:** "The interview" (Job hunting, working conditions and careers)
- **Scene:** A nervous young man in a suit waiting outside a glass office, holding a folder with his CV.
- **Key words the picture should support:** application, interview, entry-level, CV, strengths and weaknesses, work under pressure

## Życie prywatne

### 10. `zycie-prywatne-1-celebration.png`

- **Text:** "A family celebration" (Family, relationships and celebrations)
- **Scene:** Three generations of a family around a long table in a garden celebrating a grandmother's birthday.
- **Key words the picture should support:** relatives, cousin, get on well with, fall out with, make up, nephew

## Żywienie

### 11. `zywienie-1-cooking.png`

- **Text:** "Eating well on a budget" (Food, diets and eating habits)
- **Scene:** A student kitchen with a pot of vegetable soup on the stove, a chopping board with fresh vegetables and a shopping list.
- **Key words the picture should support:** takeaway, eating habits, junk food, wholesome, seasonal, free-range

## Zakupy i usługi

### 12. `zakupy-1-online.png`

- **Text:** "Click or walk?" (Shops, online shopping and consumer rights)
- **Scene:** Split scene: on the left a woman shops online on a sofa surrounded by parcels, on the right a man tries on a jacket in a small high-street shop.
- **Key words the picture should support:** bargain hunter, sales, retail price, discount, refund, returns policy

## Podróżowanie i turystyka

### 13. `podroze-1-backpacking.png`

- **Text:** "Off the beaten track" (Travel, accommodation and sightseeing)
- **Scene:** Two backpackers consulting a paper map at a mountain crossroads, with a small village and a lake in the valley below.
- **Key words the picture should support:** backpack, package holiday, tourist trap, off the beaten track, hostel, guesthouse

## Kultura

### 14. `kultura-1-festival.png`

- **Text:** "A night at the festival" (Music, film, theatre and the arts)
- **Scene:** An open-air music festival at dusk: a stage with lights, a crowd with raised hands and festival tents in the background.
- **Key words the picture should support:** gig, crowd, chorus, recording, performance, screen

## Sport

### 15. `sport-1-marathon.png`

- **Text:** "The last kilometre" (Sports, training and competitions)
- **Scene:** A city half-marathon: a tired runner near the finish line cheered on by spectators holding signs, with a clock above the finish.
- **Key words the picture should support:** take part in, win, finish, personal best, course, spectator

## Zdrowie

### 16. `zdrowie-1-doctor.png`

- **Text:** "Just a cold?" (Illnesses, symptoms and a healthy lifestyle)
- **Scene:** A doctor's surgery: a teenage boy with a scarf and a thermometer talking to a friendly doctor at a desk.
- **Key words the picture should support:** sore throat, runny nose, cough, temperature, get some rest, make an appointment

## Nauka i technika

### 17. `nauka-technika-1-detox.png`

- **Text:** "Digital detox" (Computers, the internet and new technologies)
- **Scene:** A teenager putting a smartphone into a drawer, with a desk lamp, a paper notebook and a window with a sunset behind.
- **Key words the picture should support:** screen time, browse, scroll, notification, digital detox, social media

## Świat przyrody

### 18. `przyroda-1-bees.png`

- **Text:** "Why the bees matter" (Nature, climate and environmental protection)
- **Scene:** A wildflower meadow at the edge of a town with beehives, a beekeeper in a white suit and wind turbines on the horizon.
- **Key words the picture should support:** hive, biodiversity, pollination, pesticide, habitat loss, climate

## Państwo i społeczeństwo

### 19. `panstwo-spoleczenstwo-1-election.png`

- **Text:** "First time at the ballot box" (Politics, elections and civic engagement)
- **Scene:** A polling station in a school gym: an eighteen-year-old putting a ballot into a box while volunteers check lists at a table.
- **Key words the picture should support:** vote, ballot, turnout, democracy, citizen, manifesto

## Checklist before handing over

- [ ] 18 files, exact names, PNG, 1200 × 800.
- [ ] Nothing readable inside the pictures.
- [ ] Each scene matches its text (characters, place, mood, time of day).
- [ ] Faces visible and expressive in 2, 3, 8, 14, 15.
- [ ] Open `http://localhost:5174/#czlowiek/slownictwo` after copying the files: each card should show the picture and "Powiększ" on hover.

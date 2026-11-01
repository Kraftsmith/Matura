import { badRequest, db, guarded, json, notFound, requireStudentOf } from '../_lib/http.js';
import { isCardId, parseCard, sameFront, toCard } from '../_lib/cards.js';

// /api/cards/<cardId>
const cardIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

/** The card, but only for the teacher of the learner who owns it. */
const ownCard = async (req: Request, cardId: string | undefined) => {
  if (!isCardId(cardId)) return null;
  const [card] = await db()`select user_id, module_id from user_cards where id = ${cardId}`;
  return card && (await requireStudentOf(req, card.user_id as string)) ? card : null;
};

/** Replaces the card's content. Its learner and deck never change: the learner's status is filed under that deck. */
export const PATCH = guarded(async (req) => {
  const cardId = cardIdOf(req);
  const current = await ownCard(req, cardId);
  if (!current) return notFound();

  const card = parseCard((await req.json().catch(() => null)) as Record<string, unknown> | null);
  if (!card) return badRequest();

  const sql = db();
  const others = await sql`select front from user_cards where user_id = ${current.user_id} and module_id = ${current.module_id} and id <> ${cardId}`;
  if (others.some((r) => sameFront(r.front as string, card.front))) return json({ error: 'duplicate' }, 409);

  const [row] = await sql`
    update user_cards
    set front = ${card.front}, part_of_speech = ${card.partOfSpeech}, meaning_pl = ${card.meaningPl}, meaning_ru = ${card.meaningRu}, meaning_en = ${card.meaningEn},
        example = ${card.example}, example_pl = ${card.examplePl}, example_ru = ${card.exampleRu}, category = ${card.category}, updated_at = now()
    where id = ${cardId}
    returning *`;
  return json({ card: toCard(row) });
});

export const DELETE = guarded(async (req) => {
  const cardId = cardIdOf(req);
  if (!(await ownCard(req, cardId))) return notFound();

  await db()`delete from user_cards where id = ${cardId}`;
  return json({ ok: true });
});

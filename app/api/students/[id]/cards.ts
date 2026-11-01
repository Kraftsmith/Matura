import { randomUUID } from 'node:crypto';
import { badRequest, db, guarded, isTeacher, json, notFound } from '../../_lib/http.js';
import { isModuleId, isStudentId } from '../../_lib/notes.js';
import { parseCard, sameFront, toCard } from '../../_lib/cards.js';

// /api/students/<id>/cards
const studentIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

/** Open without a session: learners have no login, and these rows hold only study words, never notes. */
export const GET = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!isStudentId(studentId)) return notFound();

  const rows = await db()`select * from user_cards where user_id = ${studentId} and source = 'teacher' order by created_at`;
  return json({ cards: rows.map(toCard) });
});

export const POST = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!(await isTeacher(req)) || !isStudentId(studentId)) return notFound();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const card = parseCard(body);
  const moduleId = body?.moduleId;
  if (!card || !isModuleId(moduleId)) return badRequest();

  const sql = db();
  const existing = await sql`select front from user_cards where user_id = ${studentId} and module_id = ${moduleId}`;
  if (existing.some((r) => sameFront(r.front as string, card.front))) return json({ error: 'duplicate' }, 409);

  const [row] = await sql`
    insert into user_cards (id, user_id, module_id, front, part_of_speech, meaning_pl, meaning_ru, meaning_en, example, example_pl, example_ru, category, source, source_ref)
    values (${`t-${randomUUID()}`}, ${studentId}, ${moduleId}, ${card.front}, ${card.partOfSpeech}, ${card.meaningPl}, ${card.meaningRu}, ${card.meaningEn},
            ${card.example}, ${card.examplePl}, ${card.exampleRu}, ${card.category}, 'teacher', ${card.sourceRef})
    returning *`;
  return json({ card: toCard(row) }, 201);
});

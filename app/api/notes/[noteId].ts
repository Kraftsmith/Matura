import { badRequest, db, guarded, isTeacher, json, notFound } from '../_lib/http.js';
import { isNoteId, toNote, validModule, validTag, validText } from '../_lib/notes.js';

// /api/notes/<noteId>
const noteIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

export const PATCH = guarded(async (req) => {
  const noteId = noteIdOf(req);
  if (!(await isTeacher(req)) || !isNoteId(noteId)) return notFound();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest();
  if ('text' in body && !validText(body.text)) return badRequest();
  if ('tag' in body && !validTag(body.tag)) return badRequest();
  if ('moduleId' in body && !validModule(body.moduleId)) return badRequest();
  if ('pinned' in body && typeof body.pinned !== 'boolean') return badRequest();

  const sql = db();
  const [note] = await sql`select * from teacher_notes where id = ${noteId}`;
  if (!note) return notFound();

  const text = 'text' in body ? body.text : note.text;
  const tag = 'tag' in body ? body.tag : note.tag;
  const moduleId = 'moduleId' in body ? body.moduleId : note.module_id;
  const pinned = 'pinned' in body ? body.pinned : note.pinned;
  // Pinning is not an edit: the "edited" mark follows the content only.
  const edited = text !== note.text || tag !== note.tag || moduleId !== note.module_id;

  const [row] = await sql`
    update teacher_notes
    set text = ${text}, tag = ${tag}, module_id = ${moduleId}, pinned = ${pinned},
        updated_at = case when ${edited}::boolean then now() else updated_at end
    where id = ${noteId}
    returning *`;
  return json({ note: toNote(row) });
});

export const DELETE = guarded(async (req) => {
  const noteId = noteIdOf(req);
  if (!(await isTeacher(req)) || !isNoteId(noteId)) return notFound();

  await db()`delete from teacher_notes where id = ${noteId}`;
  return json({ ok: true });
});

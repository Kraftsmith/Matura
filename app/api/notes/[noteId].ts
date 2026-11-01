import { badRequest, db, guarded, json, notFound, requireStudentOf } from '../_lib/http.js';
import { isNoteId, toNote, validModule, validTag, validText } from '../_lib/notes.js';

// /api/notes/<noteId>
const noteIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

/** The note, but only for the teacher of the learner it is about. */
const ownNote = async (req: Request, noteId: string | undefined) => {
  if (!isNoteId(noteId)) return null;
  const [note] = await db()`select * from teacher_notes where id = ${noteId}`;
  return note && (await requireStudentOf(req, note.student_id as string)) ? note : null;
};

export const PATCH = guarded(async (req) => {
  const noteId = noteIdOf(req);
  const note = await ownNote(req, noteId);
  if (!note) return notFound();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest();
  if ('text' in body && !validText(body.text)) return badRequest();
  if ('tag' in body && !validTag(body.tag)) return badRequest();
  if ('moduleId' in body && !validModule(body.moduleId)) return badRequest();
  if ('pinned' in body && typeof body.pinned !== 'boolean') return badRequest();

  const text = 'text' in body ? body.text : note.text;
  const tag = 'tag' in body ? body.tag : note.tag;
  const moduleId = 'moduleId' in body ? body.moduleId : note.module_id;
  const pinned = 'pinned' in body ? body.pinned : note.pinned;
  // Pinning is not an edit: the "edited" mark follows the content only.
  const edited = text !== note.text || tag !== note.tag || moduleId !== note.module_id;

  const [row] = await db()`
    update teacher_notes
    set text = ${text}, tag = ${tag}, module_id = ${moduleId}, pinned = ${pinned},
        updated_at = case when ${edited}::boolean then now() else updated_at end
    where id = ${noteId}
    returning *`;
  return json({ note: toNote(row) });
});

export const DELETE = guarded(async (req) => {
  const noteId = noteIdOf(req);
  if (!(await ownNote(req, noteId))) return notFound();

  await db()`delete from teacher_notes where id = ${noteId}`;
  return json({ ok: true });
});

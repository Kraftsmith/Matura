import { badRequest, db, guarded, isTeacher, json, notFound } from '../../_lib/http.js';
import { isStudentId, toNote, validModule, validTag, validText } from '../../_lib/notes.js';

// /api/students/<id>/notes
const studentIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

export const GET = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!(await isTeacher(req)) || !isStudentId(studentId)) return notFound();

  const rows = await db()`select * from teacher_notes where student_id = ${studentId} order by pinned desc, created_at desc`;
  return json({ notes: rows.map(toNote) });
});

export const POST = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!(await isTeacher(req)) || !isStudentId(studentId)) return notFound();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const tag = body?.tag ?? 'general';
  const moduleId = body?.moduleId ?? null;
  if (!validText(body?.text) || !validTag(tag) || !validModule(moduleId)) return badRequest();

  const [row] = await db()`
    insert into teacher_notes (student_id, author_id, text, tag, module_id)
    values (${studentId}, 'teacher', ${body.text}, ${tag}, ${moduleId})
    returning *`;
  return json({ note: toNote(row) }, 201);
});

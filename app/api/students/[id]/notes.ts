import { badRequest, db, guarded, json, notFound, requireStudentOf } from '../../_lib/http.js';
import { isNoteId, toNote, validModule, validTag, validText } from '../../_lib/notes.js';

// /api/students/<id>/notes
const studentIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

export const GET = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!(await requireStudentOf(req, studentId))) return notFound();

  const rows = await db()`select * from teacher_notes where student_id = ${studentId} order by pinned desc, created_at desc`;
  return json({ notes: rows.map(toNote) });
});

export const POST = guarded(async (req) => {
  const studentId = studentIdOf(req);
  const teacher = await requireStudentOf(req, studentId);
  if (!teacher) return notFound();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const tag = body?.tag ?? 'general';
  const moduleId = body?.moduleId ?? null;
  const lessonId = body?.lessonId ?? null;
  if (!validText(body?.text) || !validTag(tag) || !validModule(moduleId)) return badRequest();
  // A note about a lesson: only a lesson of this teacher with this learner in it.
  if (lessonId !== null) {
    if (!isNoteId(lessonId as string)) return badRequest();
    const [lesson] = await db()`
      select 1 from lessons l join lesson_participants p on p.lesson_id = l.id
      where l.id = ${lessonId as string} and l.teacher_id = ${teacher.id} and p.student_id = ${studentId}`;
    if (!lesson) return badRequest();
  }

  const [row] = await db()`
    insert into teacher_notes (student_id, author_id, text, tag, module_id, lesson_id)
    values (${studentId}, ${teacher.id}, ${body.text}, ${tag}, ${moduleId}, ${lessonId as string | null})
    returning *`;
  return json({ note: toNote(row) }, 201);
});

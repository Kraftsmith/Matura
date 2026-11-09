import { badRequest, db, guarded, json, notFound, requireTeacher, requireUser, unauthorized, type SessionUser } from './_lib/http.js';
import { addHit, hitCount } from './_lib/rateLimit.js';
import {
  MAX_RANGE_DAYS,
  TIME_ZONE,
  addDays,
  autoCounted,
  classStudentIds,
  daysBetween,
  deletable,
  ensureSeriesLessons,
  isUuid,
  lessonsInRange,
  loadHomework,
  loadLesson,
  loadLessons,
  ownHomework,
  ownLesson,
  parseItems,
  parseTarget,
  removeLesson,
  replaceParticipants,
  studentLessons,
  syncHomeworkStudents,
  todayInWarsaw,
  uuidArray,
  validAttendance,
  validCancelledBy,
  validClock,
  validDay,
  validDuration,
  validIds,
  validInstant,
  validPlan,
  validStatus,
  validSummary,
  writeItems,
} from './_lib/schedule.js';
import { toMyHomework, toMyLesson, type Row } from './_lib/scheduleShapes.js';

// The twelfth and last function of the Hobby plan: everything about lessons and homework, picked by ?resource=.
// Teacher: GET lessons|overview|lesson|student, POST lessons|lesson-status|lesson-move|homework|tick|assign, PATCH lesson|homework, DELETE lesson|homework|tick.
// Learner: GET my-lessons|my-homework, POST/DELETE my-tick.

/** New lessons a teacher may create in a day; stops a loop in a client from filling the table. */
const MAX_LESSONS_PER_DAY = 200;
/** How far ahead the class page and the learner's page look, and how far back the class page looks. */
const AHEAD_DAYS = 31;
const BACK_DAYS = 10;
const STUDENT_BACK_DAYS = 90;
const STUDENT_AHEAD_DAYS = 60;
const DEFAULT_DUE_DAYS = 7;

type Handler = (req: Request, user: SessionUser, params: URLSearchParams) => Promise<Response>;

const readBody = async (req: Request) => ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
const conflict = () => json({ error: 'conflict' }, 409);

const inClass = (ids: unknown, klass: Set<string>): ids is string[] => validIds(ids) && ids.every((id) => klass.has(id));

/** The moment of a Warsaw day and clock. */
const startsAt = (day: string, clock: string) => db()`select (${day}::date + ${clock}::time) at time zone ${TIME_ZONE} as at`.then(([r]) => r.at as Date);

// ---- Teacher: lessons

const getLessons: Handler = async (_req, teacher, params) => {
  const from = params.get('from');
  const to = params.get('to');
  if (!validDay(from) || !validDay(to) || daysBetween(from, to) < 0 || daysBetween(from, to) > MAX_RANGE_DAYS) return badRequest();
  await ensureSeriesLessons(teacher.id, from, to);
  return json({ lessons: await loadLessons(await lessonsInRange(teacher.id, from, to)) });
};

/** Around today, for the class page and the lesson bar, plus the class's recent homework for the "Zadaj" dialog. */
const getOverview: Handler = async (_req, teacher) => {
  const today = todayInWarsaw();
  const from = addDays(today, -BACK_DAYS);
  const to = addDays(today, AHEAD_DAYS);
  await ensureSeriesLessons(teacher.id, from, to);
  const lessons = await loadLessons(await lessonsInRange(teacher.id, from, to));
  const homework = await loadHomework(await db()`select * from homework where teacher_id = ${teacher.id} and due_at > now() - interval '30 days' order by due_at`);
  return json({ lessons, homework });
};

const getLesson: Handler = async (_req, teacher, params) => {
  const row = await ownLesson(teacher.id, params.get('id'));
  if (!row) return notFound();
  return json({ lesson: await loadLesson(row.id as string) });
};

/** Everything about one learner: their lessons and every homework they were given. */
const getStudent: Handler = async (_req, teacher, params) => {
  const studentId = params.get('id');
  if (!studentId || !(await classStudentIds(teacher.id)).has(studentId)) return notFound();
  const lessons = await loadLessons(await studentLessons(teacher.id, studentId));
  const homework = await loadHomework(
    await db()`select h.* from homework h join homework_students s on s.homework_id = h.id where h.teacher_id = ${teacher.id} and s.student_id = ${studentId} order by h.due_at desc limit 300`,
  );
  return json({ lessons, homework });
};

const createLesson: Handler = async (req, teacher) => {
  const body = await readBody(req);
  const { studentIds, date, time, durationMin, plan = '', repeat, until } = body;
  const klass = await classStudentIds(teacher.id);
  if (!inClass(studentIds, klass) || !validDay(date) || !validClock(time) || !validDuration(durationMin) || !validPlan(plan)) return badRequest();
  if (repeat !== undefined && repeat !== 'weekly') return badRequest();
  if (repeat === 'weekly' && (!validDay(until) || until < date)) return badRequest();

  const key = `lessons:${teacher.id}`;
  if ((await hitCount(key, 24 * 60)) >= MAX_LESSONS_PER_DAY) return json({ error: 'too_many' }, 429);
  await addHit(key);
  const sql = db();

  if (repeat === 'weekly') {
    const [series] = await sql`
      insert into lesson_series (teacher_id, weekday, start_time, duration_min, starts_on, ends_on, plan)
      values (${teacher.id}, extract(isodow from ${date}::date), ${time}::time, ${durationMin}, ${date}, ${until as string}, ${plan})
      returning id`;
    for (const id of studentIds) await sql`insert into lesson_series_students (series_id, student_id) values (${series.id as string}, ${id})`;
    await ensureSeriesLessons(teacher.id, date, date);
    const [first] = await sql`select id from lessons where series_id = ${series.id as string} and occurrence_date = ${date}`;
    return json({ lesson: await loadLesson(first.id as string) }, 201);
  }

  const [row] = await sql`
    insert into lessons (teacher_id, starts_at, duration_min, plan)
    values (${teacher.id}, (${date}::date + ${time}::time) at time zone ${TIME_ZONE}, ${durationMin}, ${plan})
    returning id`;
  await replaceParticipants(row.id as string, studentIds);
  return json({ lesson: await loadLesson(row.id as string) }, 201);
};

const patchLesson: Handler = async (req, teacher, params) => {
  const row = await ownLesson(teacher.id, params.get('id'));
  if (!row) return notFound();
  const body = await readBody(req);
  const klass = await classStudentIds(teacher.id);
  if ('date' in body && !validDay(body.date)) return badRequest();
  if ('time' in body && !validClock(body.time)) return badRequest();
  if ('durationMin' in body && !validDuration(body.durationMin)) return badRequest();
  if ('studentIds' in body && !inClass(body.studentIds, klass)) return badRequest();
  if ('plan' in body && !validPlan(body.plan)) return badRequest();
  if ('summary' in body && !validSummary(body.summary)) return badRequest();
  if ('scope' in body && body.scope !== 'one' && body.scope !== 'following') return badRequest();

  const sql = db();
  const day = (body.date as string | undefined) ?? (row.day as string);
  const clock = (body.time as string | undefined) ?? (row.clock as string);
  const duration = (body.durationMin as number | undefined) ?? (row.duration_min as number);
  const plan = (body.plan as string | undefined) ?? (row.plan as string);
  const summary = (body.summary as string | undefined) ?? (row.summary as string);
  const students = body.studentIds as string[] | undefined;
  const id = row.id as string;
  let kept: Row[] = [];

  if (body.scope === 'following' && row.series_id && row.occurrence_date) {
    // The old series ends the day before; a new one starts here with the new rule. Its untouched future lessons are rebuilt.
    const oldId = row.series_id as string;
    const occurrence = String(row.occurrence_date).slice(0, 10);
    const [old] = await sql`select * from lesson_series where id = ${oldId}`;
    const oldEnd = String(old.ends_on).slice(0, 10);
    const endsOn = oldEnd < day ? day : oldEnd;
    const [series] = await sql`
      insert into lesson_series (teacher_id, weekday, start_time, duration_min, starts_on, ends_on, plan)
      values (${teacher.id}, extract(isodow from ${day}::date), ${clock}::time, ${duration}, ${day}, ${endsOn}, ${old.plan as string})
      returning id`;
    const newId = series.id as string;
    const seriesStudents = students ?? (await sql`select student_id from lesson_series_students where series_id = ${oldId}`).map((r) => r.student_id as string);
    for (const s of seriesStudents) await sql`insert into lesson_series_students (series_id, student_id) values (${newId}, ${s})`;
    await sql`update lesson_series set ends_on = ${occurrence}::date - 1 where id = ${oldId}`;
    await sql`
      delete from lessons l where l.series_id = ${oldId} and l.occurrence_date > ${occurrence}::date and l.status = 'planned'
        and l.plan = ${old.plan as string} and l.summary = ''
        and not exists (select 1 from homework h where h.lesson_id = l.id)
        and not exists (select 1 from teacher_notes n where n.lesson_id = l.id)`;
    kept = await sql`select * from lessons where series_id = ${oldId} and occurrence_date > ${occurrence}::date order by starts_at`;
    await sql`
      update lessons set series_id = ${newId}, occurrence_date = ${day}, starts_at = (${day}::date + ${clock}::time) at time zone ${TIME_ZONE},
        duration_min = ${duration}, plan = ${plan}, summary = ${summary}, updated_at = now()
      where id = ${id}`;
  } else {
    await sql`
      update lessons set starts_at = (${day}::date + ${clock}::time) at time zone ${TIME_ZONE}, duration_min = ${duration}, plan = ${plan}, summary = ${summary}, updated_at = now()
      where id = ${id}`;
  }
  if (students) await replaceParticipants(id, students);
  return json({ lesson: await loadLesson(id), kept: await loadLessons(kept) });
};

const setStatus: Handler = async (req, teacher, params) => {
  const row = await ownLesson(teacher.id, params.get('id'));
  if (!row) return notFound();
  // A moved lesson is settled by the one it became; undo it by deleting that one.
  if (row.status === 'moved') return conflict();
  const { status, cancelledBy, attendance } = await readBody(req);
  if (!validStatus(status)) return badRequest();
  if (status === 'cancelled' && !validCancelledBy(cancelledBy)) return badRequest();
  if (attendance !== undefined && (typeof attendance !== 'object' || attendance === null || Object.values(attendance).some((a) => !validAttendance(a)))) return badRequest();

  const sql = db();
  const id = row.id as string;
  await sql`update lessons set status = ${status}, cancelled_by = ${status === 'cancelled' ? (cancelledBy as string) : null}, updated_at = now() where id = ${id}`;
  if (status === 'held') {
    const marks = (attendance ?? {}) as Record<string, string>;
    const participants = await sql`select student_id from lesson_participants where lesson_id = ${id}`;
    for (const p of participants) await sql`update lesson_participants set attendance = ${marks[p.student_id as string] ?? 'present'} where lesson_id = ${id} and student_id = ${p.student_id as string}`;
  } else {
    await sql`update lesson_participants set attendance = null where lesson_id = ${id}`;
  }
  return json({ lesson: await loadLesson(id) });
};

const moveLesson: Handler = async (req, teacher, params) => {
  const row = await ownLesson(teacher.id, params.get('id'));
  if (!row) return notFound();
  if (row.status !== 'planned') return conflict();
  const { date, time } = await readBody(req);
  if (!validDay(date) || !validClock(time)) return badRequest();

  const sql = db();
  const id = row.id as string;
  const [made] = await sql`
    insert into lessons (teacher_id, starts_at, duration_min, plan)
    values (${teacher.id}, (${date}::date + ${time}::time) at time zone ${TIME_ZONE}, ${row.duration_min as number}, ${row.plan as string})
    returning id`;
  await sql`insert into lesson_participants (lesson_id, student_id) select ${made.id as string}, student_id from lesson_participants where lesson_id = ${id}`;
  await sql`update lessons set status = 'moved', moved_to = ${made.id as string}, updated_at = now() where id = ${id}`;
  return json({ lesson: await loadLesson(id), moved: await loadLesson(made.id as string) });
};

const deleteLesson: Handler = async (_req, teacher, params) => {
  const row = await ownLesson(teacher.id, params.get('id'));
  if (!row) return notFound();
  if (!(await deletable(row))) return conflict();
  await removeLesson(row);
  return json({ ok: true });
};

// ---- Teacher: homework

const createHomework: Handler = async (req, teacher) => {
  const { lessonId, studentIds, dueAt, items } = await readBody(req);
  const klass = await classStudentIds(teacher.id);
  const parsed = parseItems(items);
  if (!inClass(studentIds, klass) || !validInstant(dueAt) || !parsed) return badRequest();
  if (lessonId !== undefined && lessonId !== null && !(await ownLesson(teacher.id, lessonId as string))) return badRequest();

  const sql = db();
  const [row] = await sql`insert into homework (teacher_id, lesson_id, due_at) values (${teacher.id}, ${(lessonId as string | null) ?? null}, ${dueAt}) returning id`;
  await writeItems(row.id as string, parsed);
  await syncHomeworkStudents(row.id as string, studentIds);
  const [homework] = await loadHomework(await sql`select * from homework where id = ${row.id as string}`);
  return json({ homework }, 201);
};

const patchHomework: Handler = async (req, teacher, params) => {
  const row = await ownHomework(teacher.id, params.get('id'));
  if (!row) return notFound();
  const body = await readBody(req);
  const klass = await classStudentIds(teacher.id);
  const parsed = 'items' in body ? parseItems(body.items) : undefined;
  if ('dueAt' in body && !validInstant(body.dueAt)) return badRequest();
  if ('studentIds' in body && !inClass(body.studentIds, klass)) return badRequest();
  if ('items' in body && !parsed) return badRequest();

  const sql = db();
  const id = row.id as string;
  if ('dueAt' in body) await sql`update homework set due_at = ${body.dueAt as string}, updated_at = now() where id = ${id}`;
  if (parsed) await writeItems(id, parsed);
  if ('studentIds' in body) await syncHomeworkStudents(id, body.studentIds as string[]);
  await sql`update homework set updated_at = now() where id = ${id}`;
  const [homework] = await loadHomework(await sql`select * from homework where id = ${id}`);
  return json({ homework });
};

const deleteHomework: Handler = async (_req, teacher, params) => {
  const row = await ownHomework(teacher.id, params.get('id'));
  if (!row) return notFound();
  await db()`delete from homework where id = ${row.id as string}`;
  return json({ ok: true });
};

/** The item, if it belongs to the teacher's homework and the learner was given that homework. */
const ownItemFor = async (teacherId: string, itemId: string | null, studentId: string | null) => {
  if (!isUuid(itemId) || !studentId) return null;
  const [row] = await db()`
    select i.id from homework_items i join homework h on h.id = i.homework_id join homework_students s on s.homework_id = h.id
    where i.id = ${itemId} and h.teacher_id = ${teacherId} and s.student_id = ${studentId}`;
  return row ?? null;
};

const addTick: Handler = async (_req, teacher, params) => {
  const item = await ownItemFor(teacher.id, params.get('item'), params.get('student'));
  if (!item) return notFound();
  await db()`
    insert into homework_ticks (item_id, student_id, by) values (${item.id as string}, ${params.get('student') as string}, 'teacher')
    on conflict (item_id, student_id) do update set by = 'teacher', done_at = now()`;
  return json({ ok: true });
};

const removeTick: Handler = async (_req, teacher, params) => {
  const item = await ownItemFor(teacher.id, params.get('item'), params.get('student'));
  if (!item) return notFound();
  await db()`delete from homework_ticks where item_id = ${item.id as string} and student_id = ${params.get('student') as string}`;
  return json({ ok: true });
};

/**
 * "Zadaj" from a course page. For every learner: the homework of their last lesson if it is still open, otherwise the
 * homework due at their next lesson (created if needed; without a next lesson, due in a week).
 */
const assign: Handler = async (req, teacher) => {
  const { studentIds, target, text, where } = await readBody(req);
  const klass = await classStudentIds(teacher.id);
  if (!inClass(studentIds, klass) || (where !== 'last' && where !== 'next')) return badRequest();
  const [item] = parseItems([target ? { kind: 'link', target, text } : { kind: 'text', text }]) ?? [];
  if (!item) return badRequest();

  const sql = db();
  const today = todayInWarsaw();
  await ensureSeriesLessons(teacher.id, today, addDays(today, MAX_RANGE_DAYS));
  const touched = new Map<string, string[]>();
  // One new homework per due moment and lesson, shared by the learners who land on it.
  const created = new Map<string, string>();

  for (const studentId of studentIds) {
    const [last] = await sql`
      select l.id from lessons l join lesson_participants p on p.lesson_id = l.id and p.student_id = ${studentId}
      where l.teacher_id = ${teacher.id} and l.status in ('planned', 'held') and l.starts_at <= now() order by l.starts_at desc limit 1`;
    const [next] = await sql`
      select l.id, l.starts_at from lessons l join lesson_participants p on p.lesson_id = l.id and p.student_id = ${studentId}
      where l.teacher_id = ${teacher.id} and l.status = 'planned' and l.starts_at > now() order by l.starts_at asc limit 1`;

    let homeworkId: string | undefined;
    if (where === 'last' && last) {
      const [open] = await sql`select id from homework where lesson_id = ${last.id as string} and due_at > now() order by created_at desc limit 1`;
      homeworkId = open?.id as string | undefined;
    }
    if (!homeworkId) {
      const lessonId = (last?.id as string | undefined) ?? null;
      const dueAt = next ? (next.starts_at as Date).toISOString() : (await startsAt(addDays(today, DEFAULT_DUE_DAYS), '23:59')).toISOString();
      const [open] = await sql`
        select h.id from homework h join homework_students s on s.homework_id = h.id and s.student_id = ${studentId}
        where h.teacher_id = ${teacher.id} and h.lesson_id is not distinct from ${lessonId} and h.due_at = ${dueAt} limit 1`;
      const key = `${lessonId ?? ''}|${dueAt}`;
      homeworkId = (open?.id as string | undefined) ?? created.get(key);
      if (!homeworkId) {
        const [row] = await sql`insert into homework (teacher_id, lesson_id, due_at) values (${teacher.id}, ${lessonId}, ${dueAt}) returning id`;
        homeworkId = row.id as string;
        created.set(key, homeworkId);
      }
    }
    await sql`insert into homework_students (homework_id, student_id) values (${homeworkId}, ${studentId}) on conflict do nothing`;
    touched.set(homeworkId, [...(touched.get(homeworkId) ?? []), studentId]);
  }

  for (const homeworkId of touched.keys()) {
    const [{ n }] = await sql`select count(*)::int as n from homework_items where homework_id = ${homeworkId}`;
    const same = await sql`select 1 from homework_items where homework_id = ${homeworkId} and kind = ${item.kind} and target is not distinct from ${item.target} and text = ${item.text}`;
    if (same.length === 0) await sql`insert into homework_items (homework_id, position, kind, target, text) values (${homeworkId}, ${n as number}, ${item.kind}, ${item.target}, ${item.text})`;
  }
  const homework = await loadHomework(await sql`select * from homework where id = any(${uuidArray([...touched.keys()])}::uuid[]) order by due_at`);
  return json({ homework });
};

// ---- Learner. Separate queries with their own field lists: nothing of the teacher's view is reused here.

const myLessons: Handler = async (_req, user, params) => {
  const today = todayInWarsaw();
  const from = params.get('from') ?? addDays(today, -STUDENT_BACK_DAYS);
  const to = params.get('to') ?? addDays(today, STUDENT_AHEAD_DAYS);
  if (!validDay(from) || !validDay(to) || daysBetween(from, to) < 0 || daysBetween(from, to) > STUDENT_BACK_DAYS + STUDENT_AHEAD_DAYS) return badRequest();
  const sql = db();
  // The weeks ahead may not have been looked at by the teacher yet.
  const teachers = await sql`select teacher_id from teacher_students where student_id = ${user.id}`;
  for (const t of teachers) await ensureSeriesLessons(t.teacher_id as string, today, addDays(today, MAX_RANGE_DAYS));
  const rows = await sql`
    select l.id, l.starts_at, l.duration_min, l.status, l.moved_to, l.plan, l.summary,
           (select count(*) from lesson_participants q where q.lesson_id = l.id) as participant_count
    from lessons l
    join lesson_participants p on p.lesson_id = l.id and p.student_id = ${user.id}
    join teacher_students ts on ts.teacher_id = l.teacher_id and ts.student_id = ${user.id}
    where l.starts_at >= ${from}::date::timestamp at time zone ${TIME_ZONE}
      and l.starts_at < (${to}::date + 1)::timestamp at time zone ${TIME_ZONE}
    order by l.starts_at`;
  return json({ lessons: rows.map(toMyLesson) });
};

const myHomework: Handler = async (_req, user) => {
  const sql = db();
  const rows = await sql`
    select h.id, h.lesson_id, h.due_at, s.assigned_at from homework h
    join homework_students s on s.homework_id = h.id and s.student_id = ${user.id}
    join teacher_students ts on ts.teacher_id = h.teacher_id and ts.student_id = ${user.id}
    where h.due_at > now() - interval '180 days'
    order by h.due_at desc`;
  if (rows.length === 0) return json({ homework: [] });
  const ids = uuidArray(rows.map((r) => r.id as string));
  const items = await sql`select id, homework_id, position, kind, target, text, created_at from homework_items where homework_id = any(${ids}::uuid[]) order by position, created_at`;
  const ticks = await sql`
    select t.item_id, t.by, t.done_at from homework_ticks t join homework_items i on i.id = t.item_id
    where i.homework_id = any(${ids}::uuid[]) and t.student_id = ${user.id}`;
  const itemHomework = new Map(items.map((i) => [i.id as string, i.homework_id as string]));
  return json({
    homework: rows.map((r) =>
      toMyHomework(
        r,
        items.filter((i) => i.homework_id === r.id),
        ticks.filter((t) => itemHomework.get(t.item_id as string) === r.id),
      ),
    ),
  });
};

/** The item, if it was given to this learner and they are still in that teacher's class. */
const myItem = async (userId: string, itemId: string | null) => {
  if (!isUuid(itemId)) return null;
  const [row] = await db()`
    select i.id, i.kind, i.target from homework_items i
    join homework h on h.id = i.homework_id
    join homework_students s on s.homework_id = h.id and s.student_id = ${userId}
    join teacher_students ts on ts.teacher_id = h.teacher_id and ts.student_id = ${userId}
    where i.id = ${itemId}`;
  return row ?? null;
};

const addMyTick: Handler = async (_req, user, params) => {
  const item = await myItem(user.id, params.get('item'));
  if (!item) return notFound();
  // Pages the site checks off by itself cannot be ticked by hand: the work has to be there.
  const target = item.kind === 'link' ? parseTarget(item.target) : null;
  if (target && autoCounted(target)) return badRequest();
  await db()`insert into homework_ticks (item_id, student_id, by) values (${item.id as string}, ${user.id}, 'student') on conflict do nothing`;
  return json({ ok: true });
};

const removeMyTick: Handler = async (_req, user, params) => {
  const item = await myItem(user.id, params.get('item'));
  if (!item) return notFound();
  // The teacher's tick stays: only the teacher takes it back.
  await db()`delete from homework_ticks where item_id = ${item.id as string} and student_id = ${user.id} and by = 'student'`;
  return json({ ok: true });
};

// ---- Dispatch

const teacherHandlers: Record<string, Handler> = {
  'GET lessons': getLessons,
  'GET overview': getOverview,
  'GET lesson': getLesson,
  'GET student': getStudent,
  'POST lessons': createLesson,
  'PATCH lesson': patchLesson,
  'POST lesson-status': setStatus,
  'POST lesson-move': moveLesson,
  'DELETE lesson': deleteLesson,
  'POST homework': createHomework,
  'PATCH homework': patchHomework,
  'DELETE homework': deleteHomework,
  'POST tick': addTick,
  'DELETE tick': removeTick,
  'POST assign': assign,
};

const learnerHandlers: Record<string, Handler> = {
  'GET my-lessons': myLessons,
  'GET my-homework': myHomework,
  'POST my-tick': addMyTick,
  'DELETE my-tick': removeMyTick,
};

const handle = guarded(async (req) => {
  const params = new URL(req.url).searchParams;
  const key = `${req.method} ${params.get('resource') ?? ''}`;
  if (key in learnerHandlers) {
    const user = await requireUser(req);
    if (!user) return unauthorized();
    return learnerHandlers[key](req, user, params);
  }
  if (key in teacherHandlers) {
    // Like the notes: anyone who is not the teacher learns only that there is nothing here.
    const teacher = await requireTeacher(req);
    if (!teacher) return notFound();
    return teacherHandlers[key](req, teacher, params);
  }
  return notFound();
});

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;

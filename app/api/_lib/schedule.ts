import { db } from './http.js';
import { isModuleId } from './notes.js';
import { toHomework, toLesson, type Row } from './scheduleShapes.js';

export const TIME_ZONE = 'Europe/Warsaw';
/** The longest stretch one request may ask for; a week view asks for 7 days. */
export const MAX_RANGE_DAYS = 42;
export const MAX_ITEMS = 30;
const MAX_ITEM_TEXT = 500;
const MAX_LINK_COMMENT = 200;
const MAX_PLAN = 2000;
const MAX_SUMMARY = 5000;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;
const ITEM_ID = /^[a-z0-9-]{1,60}$/;
const SECTIONS = ['opis-foto', 'gramatyka', 'slownictwo', 'srodki', 'pisanie', 'fiszki'];

export const isUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v);
export const validDay = (v: unknown): v is string => typeof v === 'string' && DATE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));
export const validClock = (v: unknown): v is string => typeof v === 'string' && TIME.test(v) && Number(v.slice(0, 2)) < 24 && Number(v.slice(3)) < 60;
export const validDuration = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 15 && (v as number) <= 240;
export const validPlan = (v: unknown): v is string => typeof v === 'string' && v.length <= MAX_PLAN;
export const validSummary = (v: unknown): v is string => typeof v === 'string' && v.length <= MAX_SUMMARY;
export const validInstant = (v: unknown): v is string => typeof v === 'string' && !Number.isNaN(Date.parse(v));
export const validStatus = (v: unknown): v is 'planned' | 'held' | 'cancelled' => v === 'planned' || v === 'held' || v === 'cancelled';
export const validAttendance = (v: unknown): v is 'present' | 'absent' | 'excused' => v === 'present' || v === 'absent' || v === 'excused';
export const validCancelledBy = (v: unknown): v is 'student' | 'teacher' => v === 'student' || v === 'teacher';
export const validIds = (v: unknown): v is string[] => Array.isArray(v) && v.length >= 1 && v.length <= 50 && v.every((s) => typeof s === 'string' && s.length <= 64);

export const daysBetween = (from: string, to: string): number => Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000);

export const addDays = (day: string, n: number): string => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** Today's date in Poland, whatever zone the server runs in. */
export const todayInWarsaw = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export interface Target {
  moduleId: string;
  section: string;
  item?: string;
}

/**
 * The route of a course page: "czlowiek/slownictwo/czl-txt-2", "czlowiek/pisanie", "fiszki/czlowiek".
 * Only the shape is checked here; the module data is too heavy for a function, and the client offers real pages only.
 */
export const parseTarget = (v: unknown): Target | null => {
  if (typeof v !== 'string' || v.length > 120) return null;
  const [a, b, c, d] = v.split('/');
  if (d !== undefined) return null;
  if (a === 'fiszki') return b && isModuleId(b) && c === undefined ? { moduleId: b, section: 'fiszki' } : null;
  if (!isModuleId(a) || !b || !SECTIONS.includes(b) || b === 'fiszki') return null;
  if (c !== undefined && !ITEM_ID.test(c)) return null;
  return { moduleId: a, section: b, item: c };
};

/** The same rule as autoCounted in src/courseTargets.ts: these pages the site checks off by itself, so a learner cannot tick them. */
export const autoCounted = (t: Target): boolean =>
  (t.section === 'slownictwo' && !!t.item) || (t.section === 'srodki' && !!t.item) || (t.section === 'gramatyka' && t.item === 'test') || t.section === 'pisanie';

export interface ItemInput {
  id?: string;
  kind: 'link' | 'text';
  target: string | null;
  text: string;
}

export const parseItems = (v: unknown): ItemInput[] | null => {
  if (!Array.isArray(v) || v.length > MAX_ITEMS) return null;
  const items: ItemInput[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') return null;
    const { id, kind, target, text } = raw as Record<string, unknown>;
    if (id !== undefined && !isUuid(id)) return null;
    const clean = typeof text === 'string' ? text.trim() : '';
    if (kind === 'text') {
      if (!clean || clean.length > MAX_ITEM_TEXT) return null;
      items.push({ id, kind, target: null, text: clean });
    } else if (kind === 'link') {
      if (!parseTarget(target) || clean.length > MAX_LINK_COMMENT) return null;
      items.push({ id, kind, target: target as string, text: clean });
    } else {
      return null;
    }
  }
  return items;
};

export const uuidArray = (ids: string[]) => `{${ids.join(',')}}`;

/** Every learner in the teacher's class. */
export const classStudentIds = async (teacherId: string): Promise<Set<string>> => {
  const rows = await db()`select student_id from teacher_students where teacher_id = ${teacherId}`;
  return new Set(rows.map((r) => r.student_id as string));
};

/**
 * Creates the lessons of every series of the teacher that fall into the range and do not exist yet, and seats their
 * learners. Run before any read of a range, so the rows exist only for weeks someone has looked at.
 */
export const ensureSeriesLessons = async (teacherId: string, from: string, to: string): Promise<void> => {
  await db()`
    with made as (
      insert into lessons (teacher_id, series_id, occurrence_date, starts_at, duration_min, plan)
      select s.teacher_id, s.id, d::date, (d::date + s.start_time) at time zone ${TIME_ZONE}, s.duration_min, s.plan
      from lesson_series s
      cross join lateral generate_series(greatest(s.starts_on, ${from}::date)::timestamp, least(s.ends_on, ${to}::date)::timestamp, interval '1 day') as d
      where s.teacher_id = ${teacherId}
        and extract(isodow from d) = s.weekday
        and not exists (select 1 from lesson_series_skips k where k.series_id = s.id and k.occurrence_date = d::date)
      on conflict (series_id, occurrence_date) do nothing
      returning id, series_id
    )
    insert into lesson_participants (lesson_id, student_id)
    select made.id, ss.student_id from made join lesson_series_students ss on ss.series_id = made.series_id
    on conflict do nothing`;
};

/** The lesson, with its Warsaw day and clock, if it belongs to the teacher. */
export const ownLesson = async (teacherId: string, id: string | null): Promise<Row | null> => {
  if (!isUuid(id)) return null;
  const [row] = await db()`
    select *, (starts_at at time zone ${TIME_ZONE})::date::text as day, to_char(starts_at at time zone ${TIME_ZONE}, 'HH24:MI') as clock
    from lessons where id = ${id} and teacher_id = ${teacherId}`;
  return row ?? null;
};

export const ownHomework = async (teacherId: string, id: string | null): Promise<Row | null> => {
  if (!isUuid(id)) return null;
  const [row] = await db()`select * from homework where id = ${id} and teacher_id = ${teacherId}`;
  return row ?? null;
};

export const loadHomework = async (rows: Row[]) => {
  if (rows.length === 0) return [];
  const sql = db();
  const ids = uuidArray(rows.map((r) => r.id as string));
  const items = await sql`select * from homework_items where homework_id = any(${ids}::uuid[]) order by position, created_at`;
  const students = await sql`select * from homework_students where homework_id = any(${ids}::uuid[])`;
  const ticks = await sql`
    select t.* from homework_ticks t join homework_items i on i.id = t.item_id where i.homework_id = any(${ids}::uuid[])`;
  const itemIds = new Map(items.map((i) => [i.id as string, i.homework_id as string]));
  return rows.map((r) =>
    toHomework(
      r,
      items.filter((i) => i.homework_id === r.id),
      students.filter((s) => s.homework_id === r.id),
      ticks.filter((t) => itemIds.get(t.item_id as string) === r.id),
    ),
  );
};

export const loadLessons = async (rows: Row[]) => {
  if (rows.length === 0) return [];
  const sql = db();
  const ids = uuidArray(rows.map((r) => r.id as string));
  const participants = await sql`
    select p.lesson_id, p.student_id, p.attendance, u.name from lesson_participants p join users u on u.id = p.student_id
    where p.lesson_id = any(${ids}::uuid[]) order by u.name`;
  const homework = await loadHomework(await sql`select * from homework where lesson_id = any(${ids}::uuid[]) order by created_at`);
  return rows.map((r) =>
    toLesson(
      r,
      participants.filter((p) => p.lesson_id === r.id),
      homework.filter((h) => h.lessonId === r.id),
    ),
  );
};

export const loadLesson = async (id: string) => {
  const rows = await db()`select * from lessons where id = ${id}`;
  return (await loadLessons(rows))[0];
};

/** Lessons of a teacher whose start falls on the given Warsaw days, first to last. */
export const lessonsInRange = (teacherId: string, from: string, to: string) =>
  db()`
    select * from lessons
    where teacher_id = ${teacherId}
      and starts_at >= ${from}::date::timestamp at time zone ${TIME_ZONE}
      and starts_at < (${to}::date + 1)::timestamp at time zone ${TIME_ZONE}
    order by starts_at`;

/** Lessons where the learner sits, from the teacher's side. */
export const studentLessons = (teacherId: string, studentId: string) =>
  db()`
    select l.* from lessons l join lesson_participants p on p.lesson_id = l.id
    where l.teacher_id = ${teacherId} and p.student_id = ${studentId}
    order by l.starts_at desc limit 300`;

/** Whether the lesson may simply disappear: nothing has been written about it or given on it. */
export const deletable = async (row: Row): Promise<boolean> => {
  if (row.status !== 'planned' || (row.summary as string) !== '') return false;
  const sql = db();
  if (row.series_id) {
    const [series] = await sql`select plan from lesson_series where id = ${row.series_id as string}`;
    if (series && series.plan !== row.plan && row.plan !== '') return false;
  } else if ((row.plan as string) !== '') {
    return false;
  }
  const [hw] = await sql`select 1 from homework where lesson_id = ${row.id as string} limit 1`;
  if (hw) return false;
  const [note] = await sql`select 1 from teacher_notes where lesson_id = ${row.id as string} limit 1`;
  return !note;
};

/** Removes a lesson; a lesson of a series is also remembered as skipped so the series does not create it again. */
export const removeLesson = async (row: Row): Promise<void> => {
  const sql = db();
  if (row.series_id && row.occurrence_date) {
    await sql`insert into lesson_series_skips (series_id, occurrence_date) values (${row.series_id as string}, ${row.occurrence_date as string}) on conflict do nothing`;
  }
  // The lesson this one was moved from goes back to being planned.
  await sql`update lessons set status = 'planned', moved_to = null, updated_at = now() where moved_to = ${row.id as string}`;
  await sql`delete from lessons where id = ${row.id as string}`;
};

export const replaceParticipants = async (lessonId: string, studentIds: string[]): Promise<void> => {
  const sql = db();
  await sql`delete from lesson_participants where lesson_id = ${lessonId} and not (student_id = any(${studentIds}))`;
  for (const id of studentIds) await sql`insert into lesson_participants (lesson_id, student_id) values (${lessonId}, ${id}) on conflict do nothing`;
};

/** Writes the items of a homework: known ids are updated in place (their ticks survive), the rest are replaced. */
export const writeItems = async (homeworkId: string, items: ItemInput[]): Promise<void> => {
  const sql = db();
  const existing = await sql`select id from homework_items where homework_id = ${homeworkId}`;
  const known = new Set(existing.map((r) => r.id as string));
  const keep = items.map((i) => i.id).filter((id): id is string => !!id && known.has(id));
  await sql`delete from homework_items where homework_id = ${homeworkId} and not (id = any(${uuidArray(keep)}::uuid[]))`;
  for (const [position, item] of items.entries()) {
    if (item.id && known.has(item.id)) {
      await sql`update homework_items set position = ${position}, kind = ${item.kind}, target = ${item.target}, text = ${item.text} where id = ${item.id} and homework_id = ${homeworkId}`;
    } else {
      await sql`insert into homework_items (homework_id, position, kind, target, text) values (${homeworkId}, ${position}, ${item.kind}, ${item.target}, ${item.text})`;
    }
  }
};

export const syncHomeworkStudents = async (homeworkId: string, studentIds: string[]): Promise<void> => {
  const sql = db();
  await sql`delete from homework_students where homework_id = ${homeworkId} and not (student_id = any(${studentIds}))`;
  for (const id of studentIds) await sql`insert into homework_students (homework_id, student_id) values (${homeworkId}, ${id}) on conflict do nothing`;
};

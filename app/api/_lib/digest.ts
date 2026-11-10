import { db } from './http.js';
import { deliver } from './mail.js';
import { notify, roughStanding, type Kind } from './notify.js';
import { addHit, hitCount } from './rateLimit.js';
import { TIME_ZONE, addDays, todayInWarsaw, uuidArray } from './schedule.js';

/**
 * The daily digest (Spec - Powiadomienia §8.2, §10). Run once a day by Vercel Cron through GET /api/me:
 * reminders for tomorrow become notifications, then one mail per person who has something unread or coming up.
 */

type Lang = 'pl' | 'en';

/** Notifications younger than this are left for the site: the person may be about to see them there. */
const FRESH_MINUTES = 60;

const STRINGS: Record<Lang, Record<string, string>> = {
  pl: {
    unread: 'Nieprzeczytane na stronie:',
    tomorrow: 'Jutro:',
    today: 'Dziś:',
    lesson: 'Zajęcia {span}',
    lessonWith: 'Zajęcia {span} · {who}',
    homeworkDue: 'Termin zadania domowego · zrobione {done}/{total}',
    homeworkDueTeacher: 'Zadanie domowe na dziś · {who}',
    homework_done: '{name}: zadanie domowe zrobione',
    student_joined: 'Nowy uczeń w klasie: {name}',
    message: 'Wiadomość od nauczyciela: {text}',
    homework_assigned: 'Nowe zadanie domowe · do {date}',
    lesson_added: 'Nowe zajęcia: {date}',
    lesson_moved: 'Zajęcia przeniesione na {date}',
    lesson_cancelled: 'Zajęcia odwołane: {date}',
    homework_due: 'Termin zadania domowego: {date}',
    lesson_tomorrow: 'Zajęcia: {date}',
  },
  en: {
    unread: 'Unread on the site:',
    tomorrow: 'Tomorrow:',
    today: 'Today:',
    lesson: 'Lesson {span}',
    lessonWith: 'Lesson {span} · {who}',
    homeworkDue: 'Homework due · {done}/{total} done',
    homeworkDueTeacher: 'Homework due today · {who}',
    homework_done: '{name}: homework done',
    student_joined: 'New student in your class: {name}',
    message: 'Message from your teacher: {text}',
    homework_assigned: 'New homework · due {date}',
    lesson_added: 'New lesson: {date}',
    lesson_moved: 'Lesson moved to {date}',
    lesson_cancelled: 'Lesson cancelled: {date}',
    homework_due: 'Homework due: {date}',
    lesson_tomorrow: 'Lesson: {date}',
  },
};

const fill = (template: string, vars: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));

const langOf = (v: unknown): Lang => (v === 'en' ? 'en' : 'pl');
const localeOf = (lang: Lang) => (lang === 'en' ? 'en-GB' : 'pl-PL');

const clock = (iso: string, lang: Lang) => new Intl.DateTimeFormat(localeOf(lang), { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
const dateTime = (iso: string, lang: Lang) => new Intl.DateTimeFormat(localeOf(lang), { timeZone: TIME_ZONE, weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
const dayLong = (day: string, lang: Lang) => new Intl.DateTimeFormat(localeOf(lang), { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'numeric' }).format(new Date(`${day}T12:00:00Z`));
const span = (iso: string, minutes: number, lang: Lang) => `${clock(iso, lang)}–${clock(new Date(new Date(iso).getTime() + minutes * 60_000).toISOString(), lang)}`;

type Row = Record<string, unknown>;
const iso = (v: unknown) => (v as Date).toISOString();

/** One line of the "unread" part of the mail. */
export const unreadLine = (n: { kind: Kind; text?: string; data: Record<string, unknown>; actorName?: string }, lang: Lang): string => {
  const s = STRINGS[lang];
  const when = (key: string) => (typeof n.data[key] === 'string' ? dateTime(n.data[key] as string, lang) : '');
  switch (n.kind) {
    case 'homework_done':
    case 'student_joined':
      return fill(s[n.kind], { name: n.actorName ?? '' });
    case 'message':
      return fill(s.message, { text: n.text ?? '' });
    case 'homework_assigned':
    case 'homework_due':
      return fill(s[n.kind], { date: when('dueAt') });
    default:
      return fill(s[n.kind], { date: when('startsAt') });
  }
};

interface Standing {
  studentId: string;
  name: string;
  done: number;
  total: number;
}

export const runDigest = async (): Promise<{ ok: true; skipped?: true; mails: number }> => {
  const sql = db();
  const today = todayInWarsaw();
  const key = `digest:${today}`;
  // The cron may fire twice, and a hand run must not send the day's mail again.
  if ((await hitCount(key, 36 * 60)) > 0) return { ok: true, skipped: true, mails: 0 };
  await addHit(key);
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);

  // 1. Tomorrow's lessons and deadlines become notifications on the site.
  const lessonsTomorrow: Row[] = await sql`
    select l.id, l.starts_at, l.duration_min, p.student_id
    from lessons l join lesson_participants p on p.lesson_id = l.id
    join teacher_students ts on ts.teacher_id = l.teacher_id and ts.student_id = p.student_id
    where l.status = 'planned'
      and l.starts_at >= ${tomorrow}::date::timestamp at time zone ${TIME_ZONE}
      and l.starts_at < ${dayAfter}::date::timestamp at time zone ${TIME_ZONE}`;
  for (const l of lessonsTomorrow) {
    await notify([l.student_id as string], 'lesson_tomorrow', { lessonId: l.id as string, data: { startsAt: iso(l.starts_at), durationMin: l.duration_min }, coalesce: true });
  }

  const dueTomorrow: Row[] = await sql`
    select h.id, h.due_at, s.student_id
    from homework h join homework_students s on s.homework_id = h.id
    join teacher_students ts on ts.teacher_id = h.teacher_id and ts.student_id = s.student_id
    where h.due_at >= ${tomorrow}::date::timestamp at time zone ${TIME_ZONE}
      and h.due_at < ${dayAfter}::date::timestamp at time zone ${TIME_ZONE}`;
  const dueByStudent = new Map<string, Standing[]>();
  for (const h of dueTomorrow) {
    const standing = await roughStanding(h.id as string, h.student_id as string);
    if (standing.total === 0 || standing.done >= standing.total) continue;
    await notify([h.student_id as string], 'homework_due', { homeworkId: h.id as string, data: { dueAt: iso(h.due_at), ...standing }, coalesce: true });
    dueByStudent.set(h.student_id as string, [...(dueByStudent.get(h.student_id as string) ?? []), { studentId: h.student_id as string, name: '', ...standing }]);
  }

  // 2. One mail per person who wants it and has something to read.
  const people: Row[] = await sql`select id, role, name, email, ui_lang from users where notify_mail_digest and email is not null`;
  const todayLessons: Row[] = await sql`
    select l.id, l.teacher_id, l.starts_at, l.duration_min, string_agg(u.name, ', ' order by u.name) as who
    from lessons l join lesson_participants p on p.lesson_id = l.id join users u on u.id = p.student_id
    where l.status = 'planned'
      and l.starts_at >= ${today}::date::timestamp at time zone ${TIME_ZONE}
      and l.starts_at < ${tomorrow}::date::timestamp at time zone ${TIME_ZONE}
    group by l.id`;
  const dueToday: Row[] = await sql`
    select h.id, h.teacher_id, s.student_id, u.name
    from homework h join homework_students s on s.homework_id = h.id join users u on u.id = s.student_id
    where h.due_at >= ${today}::date::timestamp at time zone ${TIME_ZONE}
      and h.due_at < ${tomorrow}::date::timestamp at time zone ${TIME_ZONE}`;
  const lessonsTomorrowByStudent = new Map<string, Row[]>();
  for (const l of lessonsTomorrow) lessonsTomorrowByStudent.set(l.student_id as string, [...(lessonsTomorrowByStudent.get(l.student_id as string) ?? []), l]);

  let mails = 0;
  for (const person of people) {
    const lang = langOf(person.ui_lang);
    const s = STRINGS[lang];
    const id = person.id as string;
    const lines: string[] = [];

    const unread: Row[] = await sql`
      select n.*, u.name as actor_name from notifications n left join users u on u.id = n.actor_id
      where n.user_id = ${id} and n.read_at is null and n.mailed_at is null
        and n.kind not in ('homework_due', 'lesson_tomorrow')
        and n.created_at < now() - make_interval(mins => ${FRESH_MINUTES})
      order by n.created_at desc limit 20`;
    if (unread.length > 0) {
      lines.push(s.unread);
      for (const n of unread) lines.push(`• ${unreadLine({ kind: n.kind as Kind, text: (n.text as string | null) ?? undefined, data: (n.data as Record<string, unknown>) ?? {}, actorName: (n.actor_name as string | null) ?? undefined }, lang)}`);
    }

    if (person.role === 'student') {
      const ahead: string[] = [];
      for (const l of lessonsTomorrowByStudent.get(id) ?? []) ahead.push(`• ${fill(s.lesson, { span: span(iso(l.starts_at), l.duration_min as number, lang) })}`);
      for (const h of dueByStudent.get(id) ?? []) ahead.push(`• ${fill(s.homeworkDue, { done: h.done, total: h.total })}`);
      if (ahead.length > 0) lines.push(lines.length > 0 ? '' : '', s.tomorrow, ...ahead);
    } else {
      const now: string[] = [];
      for (const l of todayLessons.filter((x) => x.teacher_id === id)) now.push(`• ${fill(s.lessonWith, { span: span(iso(l.starts_at), l.duration_min as number, lang), who: l.who as string })}`);
      const due = dueToday.filter((x) => x.teacher_id === id);
      const byHomework = new Map<string, Row[]>();
      for (const d of due) byHomework.set(d.id as string, [...(byHomework.get(d.id as string) ?? []), d]);
      for (const rows of byHomework.values()) {
        const who: string[] = [];
        for (const r of rows) {
          const st = await roughStanding(r.id as string, r.student_id as string);
          who.push(`${r.name as string} ${st.done}/${st.total}${st.total > 0 && st.done >= st.total ? ' ✓' : ''}`);
        }
        now.push(`• ${fill(s.homeworkDueTeacher, { who: who.join(', ') })}`);
      }
      if (now.length > 0) lines.push(lines.length > 0 ? '' : '', s.today, ...now);
    }

    if (lines.length === 0) continue;
    const body = lines.filter((line, i) => !(line === '' && i === 0)).join('\n');
    try {
      await deliver('digest', person.email as string, lang, person.role === 'student' ? 'zajecia' : 'kalendarz', { date: dayLong(today, lang), body });
      mails++;
      if (unread.length > 0) await sql`update notifications set mailed_at = now() where id = any(${uuidArray(unread.map((n) => n.id as string))}::uuid[])`;
    } catch (e) {
      console.error('digest_mail_error', (e as { code?: string }).code ?? 'unknown');
    }
  }
  return { ok: true, mails };
};

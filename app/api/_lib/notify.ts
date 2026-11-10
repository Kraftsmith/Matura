import { db } from './http.js';
import { autoCounted, parseTarget, uuidArray } from './schedule.js';

/**
 * Notifications (Spec - Powiadomienia.md). A row says "for user X happened Y"; the text is built by the client from
 * kind and data, so a change of interface language changes old notifications too. Only a teacher's message carries
 * its own text.
 */

export const KINDS = ['homework_done', 'student_joined', 'message', 'homework_assigned', 'lesson_added', 'lesson_moved', 'lesson_cancelled', 'homework_due', 'lesson_tomorrow'] as const;
export type Kind = (typeof KINDS)[number];

/** How long a notification is kept. They are signals, not a record: the calendar is the record. */
const KEEP_DAYS = 90;
export const MAX_MESSAGE = 500;

export interface NotifyOptions {
  actorId?: string;
  homeworkId?: string;
  lessonId?: string;
  text?: string;
  data?: Record<string, unknown>;
  /** Update an unread notification of the same kind about the same homework or lesson instead of adding one. */
  coalesce?: boolean;
}

/** Creates (or refreshes, see coalesce) a notification for each recipient. Returns the ids written. */
export const notify = async (userIds: string[], kind: Kind, o: NotifyOptions = {}): Promise<string[]> => {
  const sql = db();
  const ids: string[] = [];
  const data = JSON.stringify(o.data ?? {});
  for (const userId of new Set(userIds)) {
    if (o.coalesce) {
      const rows = await sql`
        update notifications set created_at = now(), data = ${data}::jsonb, actor_id = ${o.actorId ?? null}
        where user_id = ${userId} and kind = ${kind} and read_at is null
          and homework_id is not distinct from ${o.homeworkId ?? null} and lesson_id is not distinct from ${o.lessonId ?? null}
        returning id`;
      if (rows.length > 0) {
        ids.push(rows[0].id as string);
        continue;
      }
    }
    const [row] = await sql`
      insert into notifications (user_id, kind, actor_id, homework_id, lesson_id, text, data)
      values (${userId}, ${kind}, ${o.actorId ?? null}, ${o.homeworkId ?? null}, ${o.lessonId ?? null}, ${o.text ?? null}, ${data}::jsonb)
      returning id`;
    ids.push(row.id as string);
  }
  return ids;
};

/** The one shape both roles get: nothing from the lessons or homework tables rides along. */
export const toNotification = (r: Record<string, unknown>) => ({
  id: r.id as string,
  kind: r.kind as Kind,
  createdAt: (r.created_at as Date).toISOString(),
  readAt: r.read_at ? (r.read_at as Date).toISOString() : undefined,
  text: (r.text as string | null) ?? undefined,
  data: (r.data as Record<string, unknown>) ?? {},
  homeworkId: (r.homework_id as string | null) ?? undefined,
  lessonId: (r.lesson_id as string | null) ?? undefined,
  actor: r.actor_id ? { id: r.actor_id as string, name: (r.actor_name as string | null) ?? '' } : undefined,
});

export const listNotifications = async (userId: string, before: string | undefined, limit: number) => {
  const sql = db();
  await sql`delete from notifications where user_id = ${userId} and created_at < now() - make_interval(days => ${KEEP_DAYS})`;
  const rows = before
    ? await sql`
        select n.*, u.name as actor_name from notifications n left join users u on u.id = n.actor_id
        where n.user_id = ${userId} and n.created_at < ${before} order by n.created_at desc limit ${limit}`
    : await sql`
        select n.*, u.name as actor_name from notifications n left join users u on u.id = n.actor_id
        where n.user_id = ${userId} order by n.created_at desc limit ${limit}`;
  const [{ unread }] = await sql`select count(*)::int as unread from notifications where user_id = ${userId} and read_at is null`;
  return { notifications: rows.map(toNotification), unread: unread as number };
};

export const markRead = async (userId: string, ids: string[] | 'all'): Promise<void> => {
  const sql = db();
  if (ids === 'all') await sql`update notifications set read_at = now() where user_id = ${userId} and read_at is null`;
  else if (ids.length > 0) await sql`update notifications set read_at = now() where user_id = ${userId} and read_at is null and id = any(${uuidArray(ids)}::uuid[])`;
};

export interface RoughStanding {
  done: number;
  total: number;
}

/**
 * Whether a learner has shown every item of a homework, judged roughly: a tick by anyone, or for a link item the
 * module's progress saved after the item was given. The client counts the real statuses; this only stops a false
 * "done" from reaching the teacher (spec §3, decision 3).
 */
export const roughStanding = async (homeworkId: string, studentId: string): Promise<RoughStanding> => {
  const sql = db();
  const items = await sql`
    select i.kind, i.target, greatest(i.created_at, s.assigned_at) as given, (t.item_id is not null) as ticked
    from homework_items i
    join homework_students s on s.homework_id = i.homework_id and s.student_id = ${studentId}
    left join homework_ticks t on t.item_id = i.id and t.student_id = ${studentId}
    where i.homework_id = ${homeworkId}`;
  const saved = new Map((await sql`select module_id, updated_at from progress where user_id = ${studentId}`).map((r) => [r.module_id as string, (r.updated_at as Date).getTime()]));
  let done = 0;
  for (const item of items) {
    if (item.ticked) {
      done++;
      continue;
    }
    // Text items and pages the site cannot count need a tick, as on the client.
    const target = item.kind === 'link' ? parseTarget(item.target) : null;
    if (!target || !autoCounted(target)) continue;
    const at = saved.get(target.moduleId);
    if (at !== undefined && at >= (item.given as Date).getTime()) done++;
  }
  return { done, total: items.length };
};

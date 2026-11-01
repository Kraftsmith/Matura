import { badRequest, db, guarded, json, requireUser, unauthorized } from './_lib/http.js';
import { toProgressState, validModuleData, validModuleKey } from './_lib/progress.js';

// The learner's own work only: no route here takes a user id, so there is no one else's id to put in.
// GET /api/progress, PUT /api/progress?moduleId=<id> (or no moduleId: lastModuleId and lastDeckId)

export const GET = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const sql = db();
  const rows = await sql`select module_id, data from progress where user_id = ${user.id}`;
  const [row] = await sql`select progress_meta from users where id = ${user.id}`;
  return json({ state: toProgressState(rows, row?.progress_meta ?? {}) });
});

export const PUT = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  if (user.role !== 'student') return json({ ok: true });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const moduleId = new URL(req.url).searchParams.get('moduleId');
  const sql = db();

  if (moduleId === null) {
    const { lastModuleId, lastDeckId, updatedAt } = body ?? {};
    const meta = { lastModuleId, lastDeckId, updatedAt };
    if (Object.values(meta).some((v) => v !== undefined && (typeof v !== 'string' || v.length > 80))) return badRequest();
    await sql`update users set progress_meta = ${JSON.stringify(meta)}::jsonb where id = ${user.id}`;
    return json({ ok: true });
  }

  if (!validModuleKey(moduleId) || !validModuleData(body)) return badRequest();
  await sql`
    insert into progress (user_id, module_id, data) values (${user.id}, ${moduleId}, ${JSON.stringify(body)}::jsonb)
    on conflict (user_id, module_id) do update set data = excluded.data, updated_at = now()`;
  return json({ ok: true });
});

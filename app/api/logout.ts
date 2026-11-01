import { clearSessionCookie, endSession, guarded, json } from './_lib/http.js';

export const POST = guarded(async (req) => {
  await endSession(req);
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
});

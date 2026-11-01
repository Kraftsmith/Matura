import { guarded, isTeacher, json } from './_lib/http.js';

export const GET = guarded(async (req) => json({ teacher: await isTeacher(req) }));

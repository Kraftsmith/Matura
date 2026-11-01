// Creates or updates an account and prints a link to set the password, once. Keeps the id, so existing notes stay attached.
// Run: npm run user:create -- <id> <email> "<name>" [--role teacher] [--student-of <teacherId>]
import { createHash, randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const LINK_HOURS = 72;

const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  return at === -1 ? undefined : args.splice(at, 2)[1];
};
const role = option('--role') ?? 'student';
const teacherId = option('--student-of');
const [id, rawEmail, name] = args;

if (!id || !rawEmail || !name || !['student', 'teacher'].includes(role)) {
  console.error('Usage: npm run user:create -- <id> <email> "<name>" [--role teacher] [--student-of <teacherId>]');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);
const email = rawEmail.trim().toLowerCase();

await sql`
  insert into users (id, role, name, email, email_verified_at)
  values (${id}, ${role}, ${name}, ${email}, now())
  on conflict (id) do update set role = excluded.role, name = excluded.name, email = excluded.email, email_verified_at = now()`;

if (teacherId) await sql`insert into teacher_students (teacher_id, student_id) values (${teacherId}, ${id}) on conflict do nothing`;

const token = randomBytes(32).toString('base64url');
await sql`delete from auth_tokens where user_id = ${id} and purpose = 'reset_password'`;
await sql`
  insert into auth_tokens (token_hash, user_id, purpose, expires_at)
  values (${createHash('sha256').update(token).digest('hex')}, ${id}, 'reset_password', now() + make_interval(hours => ${LINK_HOURS}))`;

const base = process.env.APP_URL ?? 'http://localhost:3000';
console.log(`Link to set the password for ${email} (shown only now, works ${LINK_HOURS} hours):\n${base}/#reset/${token}`);

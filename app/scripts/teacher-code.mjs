// Issues a new access code for the teacher and prints it once. The old code and all sessions stop working.
// Run: npm run teacher:code
import { neon } from '@neondatabase/serverless';
import { generateCode, hashCode } from '../api/_lib/accessCode.ts';

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);

const code = generateCode();
const rows = await sql`update users set access_code_hash = ${await hashCode(code)} where id = 'teacher' returning id`;
if (rows.length === 0) {
  console.error('No teacher in the database. Run npm run db:migrate first.');
  process.exit(1);
}
await sql`delete from sessions where user_id = 'teacher'`;

console.log(`Teacher access code (shown only now): ${code}`);

// Creates the tables for the teacher's login and notes. Safe to run again.
// Run: npm run db:migrate
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);

await sql`
  create table if not exists users (
    id text primary key,
    role text not null check (role in ('student', 'teacher')),
    access_code_hash text
  )`;

await sql`
  create table if not exists sessions (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    expires_at timestamptz not null
  )`;

await sql`
  create table if not exists login_attempts (
    ip text not null,
    at timestamptz not null default now()
  )`;
await sql`create index if not exists login_attempts_ip_at on login_attempts (ip, at)`;

await sql`
  create table if not exists teacher_notes (
    id uuid primary key default gen_random_uuid(),
    student_id text not null,
    author_id text not null references users (id),
    text text not null check (char_length(text) between 1 and 5000),
    tag text not null default 'general' check (tag in ('general', 'mistakes', 'homework', 'lesson', 'parents')),
    module_id text,
    pinned boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`;
await sql`create index if not exists teacher_notes_student on teacher_notes (student_id, created_at desc)`;

await sql`insert into users (id, role) values ('teacher', 'teacher') on conflict (id) do nothing`;

console.log('Database is up to date.');

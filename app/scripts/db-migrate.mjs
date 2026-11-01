// Creates the tables for accounts, progress, the teacher's notes and the flashcards added for learners. Safe to run again.
// Run: npm run db:migrate
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);

await sql`
  create table if not exists users (
    id text primary key,
    role text not null check (role in ('student', 'teacher'))
  )`;

await sql`
  create table if not exists sessions (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    expires_at timestamptz not null
  )`;

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

await sql`
  create table if not exists user_cards (
    id text primary key,
    user_id text not null,
    module_id text not null,
    front text not null check (char_length(front) between 1 and 100),
    part_of_speech text not null,
    meaning_pl text not null default '',
    meaning_ru text,
    meaning_en text,
    example text not null default '',
    example_pl text,
    example_ru text,
    category text not null,
    source text not null,
    source_ref text,
    created_at timestamptz not null default now(),
    updated_at timestamptz
  )`;
await sql`create index if not exists user_cards_user on user_cards (user_id, created_at)`;

await sql`insert into users (id, role) values ('teacher', 'teacher') on conflict (id) do nothing`;

// Accounts. Every statement is safe to repeat.
const userColumns = [
  'email text',
  `name text not null default ''`,
  'password_hash text',
  'email_verified_at timestamptz',
  'terms_accepted_at timestamptz',
  'terms_version text',
  'onboarded_at timestamptz',
  'exam_date date',
  `level text check (level in ('podstawowa', 'rozszerzona'))`,
  'goal text check (char_length(goal) <= 120)',
  `ui_lang text not null default 'pl'`,
  `translation_lang text not null default 'pl'`,
  'pending_invite text',
  'invite_code text',
  `progress_meta jsonb not null default '{}'`,
  'created_at timestamptz not null default now()',
];
for (const column of userColumns) await sql.query(`alter table users add column if not exists ${column}`);
await sql`create unique index if not exists users_email on users (email)`;
await sql`create unique index if not exists users_invite_code on users (invite_code)`;
await sql`alter table sessions add column if not exists created_at timestamptz not null default now()`;

await sql`
  create table if not exists auth_tokens (
    token_hash text primary key,
    user_id text not null references users (id) on delete cascade,
    purpose text not null check (purpose in ('verify_email', 'reset_password', 'change_email')),
    new_email text,
    expires_at timestamptz not null
  )`;

await sql`
  create table if not exists teacher_students (
    teacher_id text not null references users (id) on delete cascade,
    student_id text not null references users (id) on delete cascade,
    joined_at timestamptz not null default now(),
    primary key (teacher_id, student_id)
  )`;
await sql`create index if not exists teacher_students_student on teacher_students (student_id)`;

await sql`
  create table if not exists progress (
    user_id text not null references users (id) on delete cascade,
    module_id text not null,
    data jsonb not null,
    updated_at timestamptz not null default now(),
    primary key (user_id, module_id)
  )`;

await sql`
  create table if not exists rate_limits (
    key text not null,
    at timestamptz not null default now()
  )`;
await sql`create index if not exists rate_limits_key_at on rate_limits (key, at)`;

// The access code gave way to passwords, the IP-only counter to rate_limits.
await sql`alter table users drop column if exists access_code_hash`;
await sql`drop table if exists login_attempts`;

// Notes and cards were written before learners had accounts, so these two rows must exist before the foreign keys.
await sql`insert into users (id, role, name) values ('maria', 'student', 'Maria'), ('evgeny', 'student', 'Evgeny') on conflict (id) do nothing`;
await sql`update users set name = 'Nauczyciel' where id = 'teacher' and name = ''`;

// Without the cascade, deleting an account would leave notes about a person who is gone.
const foreignKeys = [
  ['teacher_notes', 'teacher_notes_student_fk', 'student_id'],
  ['user_cards', 'user_cards_user_fk', 'user_id'],
];
for (const [table, name, column] of foreignKeys) {
  const [found] = await sql`select 1 from pg_constraint where conname = ${name}`;
  if (!found) await sql.query(`alter table ${table} add constraint ${name} foreign key (${column}) references users (id) on delete cascade`);
}

console.log('Database is up to date.');

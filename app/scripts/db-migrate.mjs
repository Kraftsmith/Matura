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

// Lessons and homework (Spec - Kalendarz i zadania domowe.md, §8).
await sql`
  create table if not exists lesson_series (
    id uuid primary key default gen_random_uuid(),
    teacher_id text not null references users (id) on delete cascade,
    weekday smallint not null check (weekday between 1 and 7),
    start_time time not null,
    duration_min smallint not null check (duration_min between 15 and 240),
    starts_on date not null,
    ends_on date not null,
    plan text not null default '' check (char_length(plan) <= 2000),
    created_at timestamptz not null default now()
  )`;
await sql`
  create table if not exists lesson_series_students (
    series_id uuid not null references lesson_series (id) on delete cascade,
    student_id text not null references users (id) on delete cascade,
    primary key (series_id, student_id)
  )`;
await sql`
  create table if not exists lesson_series_skips (
    series_id uuid not null references lesson_series (id) on delete cascade,
    occurrence_date date not null,
    primary key (series_id, occurrence_date)
  )`;
await sql`
  create table if not exists lessons (
    id uuid primary key default gen_random_uuid(),
    teacher_id text not null references users (id) on delete cascade,
    series_id uuid references lesson_series (id) on delete set null,
    occurrence_date date,
    starts_at timestamptz not null,
    duration_min smallint not null check (duration_min between 15 and 240),
    status text not null default 'planned' check (status in ('planned', 'held', 'cancelled', 'moved')),
    cancelled_by text check (cancelled_by in ('student', 'teacher')),
    moved_to uuid references lessons (id) on delete set null,
    plan text not null default '' check (char_length(plan) <= 2000),
    summary text not null default '' check (char_length(summary) <= 5000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (series_id, occurrence_date)
  )`;
await sql`create index if not exists lessons_teacher_time on lessons (teacher_id, starts_at)`;
await sql`
  create table if not exists lesson_participants (
    lesson_id uuid not null references lessons (id) on delete cascade,
    student_id text not null references users (id) on delete cascade,
    attendance text check (attendance in ('present', 'absent', 'excused')),
    primary key (lesson_id, student_id)
  )`;
await sql`create index if not exists lesson_participants_student on lesson_participants (student_id)`;

await sql`
  create table if not exists homework (
    id uuid primary key default gen_random_uuid(),
    teacher_id text not null references users (id) on delete cascade,
    lesson_id uuid references lessons (id) on delete set null,
    due_at timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`;
await sql`create index if not exists homework_teacher_due on homework (teacher_id, due_at)`;
await sql`
  create table if not exists homework_items (
    id uuid primary key default gen_random_uuid(),
    homework_id uuid not null references homework (id) on delete cascade,
    position smallint not null,
    kind text not null check (kind in ('link', 'text')),
    target text,
    text text not null default '' check (char_length(text) <= 500),
    created_at timestamptz not null default now(),
    check ((kind = 'link') = (target is not null))
  )`;
await sql`create index if not exists homework_items_homework on homework_items (homework_id, position)`;
await sql`
  create table if not exists homework_students (
    homework_id uuid not null references homework (id) on delete cascade,
    student_id text not null references users (id) on delete cascade,
    assigned_at timestamptz not null default now(),
    primary key (homework_id, student_id)
  )`;
await sql`create index if not exists homework_students_student on homework_students (student_id)`;
await sql`
  create table if not exists homework_ticks (
    item_id uuid not null references homework_items (id) on delete cascade,
    student_id text not null references users (id) on delete cascade,
    by text not null check (by in ('student', 'teacher')),
    done_at timestamptz not null default now(),
    primary key (item_id, student_id)
  )`;
// A private note can be about one lesson; the lesson's page lists them.
await sql`alter table teacher_notes add column if not exists lesson_id uuid references lessons (id) on delete set null`;

// Without the cascade, deleting an account would leave notes about a person who is gone.
const foreignKeys = [
  ['teacher_notes', 'teacher_notes_student_fk', 'student_id'],
  ['user_cards', 'user_cards_user_fk', 'user_id'],
];
for (const [table, name, column] of foreignKeys) {
  const [found] = await sql`select 1 from pg_constraint where conname = ${name}`;
  if (!found) await sql.query(`alter table ${table} add constraint ${name} foreign key (${column}) references users (id) on delete cascade`);
}

// Addresses left on the public site: the waiting list and the contact form (Spec - Landing §10.3).
await sql`alter table users add column if not exists signup_source text`;
await sql`
  create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    kind text not null default 'subscribe' check (kind in ('subscribe', 'contact')),
    role text check (role in ('student', 'parent', 'teacher')),
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
    source text,
    utm jsonb,
    lang text not null default 'pl',
    message text check (char_length(message) <= 2000),
    token_hash text,
    token_expires_at timestamptz,
    unsubscribe_token_hash text,
    confirmed_at timestamptz,
    created_at timestamptz not null default now()
  )`;
await sql`create unique index if not exists leads_email_subscribe on leads (lower(email)) where kind = 'subscribe'`;
await sql`create index if not exists leads_token on leads (token_hash)`;
await sql`create index if not exists leads_unsubscribe_token on leads (unsubscribe_token_hash)`;

console.log('Database is up to date.');

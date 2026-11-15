# Matura Angielski: the app

React 19, TypeScript, Vite, Tailwind 4. The public site (landing, topic pages, blog) is a separate Astro project in `../site`; see `Spec/Spec - Landing i strony publiczne.md`.

## Layout and build

One Vercel project, root directory `app`, one host:

| Path | What | Built by |
|---|---|---|
| `/` | Public site: static HTML | `../site` (Astro) → `dist/` |
| `/app/` | This app, addresses after `#` | Vite with `base: '/app/'` → `dist/app/` |
| `/api/*` | Functions in `api/` | Vercel |

- `npm run build:all` builds the site first (it owns the root of `dist/`), then the app into `dist/app`. `vercel.json` sets this as the build command and `installCommand` also installs `../site`.
- `npm run build` alone builds only the app into `dist/app`.
- `npm run dev` serves the app at `http://localhost:5173/app/` (the base path applies in development too).
- The app's `public/` is copied to the root of `dist/` by the site build (`site/scripts/copy-public.mjs`), so absolute paths in the data (`/images/vocab/…`) and the fonts in `public/fonts` work from both places.
- Fonts: Figtree is served from `/fonts/` (no Google Fonts). In plain `npm run dev` of the app alone the files are under `/app/fonts/`, so the browser falls back to the system font; the deployed site serves them from the root.
- `index.html` carries `noindex` and `vercel.json` adds `X-Robots-Tag: noindex` for `/app/`: the public pages are the site's.
- `APP_URL` is the origin of the deployment (the site's root). Mail links to the app are `${APP_URL}/app/#verify/…`; links to site pages (`/potwierdz?token=…`) are `${APP_URL}` plus the path.
- The old addresses `#regulamin` and `#prywatnosc` forward to `/regulamin` and `/polityka-prywatnosci` on the site.
- Public pages accept parameters after `?` inside the hash: `#register?src=landing-hero&next=czlowiek/srodki&role=teacher`, `#login?next=…`. `next` opens that app address after signing in, `src` is stored in `users.signup_source`.

### Forms of the public site

`POST /api/account?action=lead-subscribe|lead-confirm|lead-unsubscribe|contact` work without a session (the waiting list and the contact form; table `leads`). Subscriptions are double opt-in: the confirmation mail links to `/potwierdz?token=…`, every mail to the list carries `/wypisz?token=…`. The contact form forwards a copy to `CONTACT_TO` when that variable is set.

## Accounts and API

Accounts, progress and the teacher's notes live in Postgres (Neon) behind `app/api/`. Every page needs a session, so plain `npm run dev` has no working sign-in; to run everything locally:

```bash
vercel env pull .env.local   # once, needs a linked project
npm run db:migrate           # safe to repeat
npm run user:create -- teacher you@example.com "Your name" --role teacher   # prints a link to set the password
npm run dev:api              # front end and API together
npm run dev:local            # the same without the Vercel CLI: Vite serves /api from api/ (vercel dev cannot symlink its builders on Windows without Developer Mode)
```

Add a learner to a class from the start with `--student-of teacher`. Without `RESEND_API_KEY`, `vercel dev` prints mail links to the console; on Vercel the mail then fails.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres |
| `APP_URL` | Base of every link in mail. Never taken from the request |
| `RESEND_API_KEY`, `MAIL_FROM` | Sending mail; needs a verified domain |
| `CONTACT_TO` | Where the contact form's copy goes; unset means the message is only stored |

Each file in `app/api` (outside `_lib`) is one function and the Hobby plan allows 12, so related routes share a file and pick the action from the query string.

## Access and prices

`src/data/access.ts` is the one place for what is free (`freeAccountModules`) and what full access costs (`plans`, monthly and the one-time "Do matury" package, extra seats). The site reads it for `/cennik`, the landing, the access wall and the schema.org offers; the app will read it for the lock and `#dostep/kup`. `checkoutOpen` there is `false` until `api/billing.ts` exists: the site then shows the prices with the waiting list instead of buy buttons. See `Spec/Spec - Subskrypcje i cennik.md`.

## Billing metrics

The numbers to watch from the first day of sales (`Spec/Spec - Subskrypcje i cennik.md` §12.7), as SQL against the tables of that spec's §8 (`subscriptions`, `seats`, `billing_events`; they arrive with the billing migration). Run them in the Neon console or with `psql "$DATABASE_URL"`. A seat is paid while its subscription is `active`, or `past_due` inside the grace period. Prices in the MRR query mirror `src/data/access.ts`; change both together. There is no history table: run the MRR and seat queries at the end of every month of the season and keep the results.

```sql
-- Active seats by the owner's plan
select s.plan, count(*) as active_seats
from seats st
join subscriptions s on s.id = st.subscription_id
where st.student_id is not null
  and (s.status = 'active' or (s.status = 'past_due' and s.grace_until > now()))
group by s.plan
order by s.plan;

-- Conversion: students with a paid seat out of all student accounts (goal: 5% or more over a season)
select count(*) as students,
       count(*) filter (where exists (
         select 1 from seats x join subscriptions s on s.id = x.subscription_id
         where x.student_id = u.id and s.status in ('active', 'past_due'))) as with_seat
from users u
where u.role = 'student';

-- One-time packages against monthly plans this school year (BLIK and Przelewy24 pay only for packages;
-- the exact payment method is in Stripe, Payments, filtered by method)
with season as (select make_date(extract(year from now() - interval '8 months')::int, 9, 1) as start)
select period, count(*) as subscriptions,
       round(100.0 * count(*) / sum(count(*)) over (), 1) as pct
from subscriptions, season
where created_at >= season.start
group by period;

-- Average paid duration per plan, in months, over closed subscriptions
select plan, count(*) as closed,
       round((avg(current_period_end - created_at) / interval '30 days')::numeric, 1) as months
from subscriptions
where status in ('canceled', 'expired')
group by plan;

-- Seats per teacher: bought and taken
select s.owner_id, s.seats_included + s.seats_extra as seats, count(st.student_id) as taken
from subscriptions s
left join seats st on st.subscription_id = s.id and st.student_id is not null
where s.plan = 'teacher' and s.status in ('active', 'past_due')
group by s.owner_id, s.seats_included, s.seats_extra
order by seats desc;

-- Class learners without a paid seat: the teacher's funnel
select ts.teacher_id, count(*) as learners,
       count(*) filter (where not exists (
         select 1 from seats x join subscriptions s on s.id = x.subscription_id
         where x.student_id = ts.student_id and s.status in ('active', 'past_due'))) as without_seat
from teacher_students ts
group by ts.teacher_id
order by without_seat desc;

-- Failed payments and refunds by month (refunds appear once the webhook subscribes to charge.refunded)
select date_trunc('month', received_at)::date as month, type, count(*)
from billing_events
where type in ('invoice.payment_failed', 'charge.refunded')
group by 1, 2
order by 1, 2;

-- MRR of the monthly plans, gross, and the subscriptions behind it
select plan, count(*) as subscriptions,
       sum(case plan
             when 'student' then 20
             when 'parent' then 30 + 20 * seats_extra
             when 'teacher' then 30 + 15 * seats_extra
           end) as mrr_gross_pln
from subscriptions
where period = 'month' and status in ('active', 'past_due')
group by plan;
```

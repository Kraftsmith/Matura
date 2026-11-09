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
- Fonts: Nunito is served from `/fonts/` (no Google Fonts). In plain `npm run dev` of the app alone the files are under `/app/fonts/`, so the browser falls back to the system font; the deployed site serves them from the root.
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
```

Add a learner to a class from the start with `--student-of teacher`. Without `RESEND_API_KEY`, `vercel dev` prints mail links to the console; on Vercel the mail then fails.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres |
| `APP_URL` | Base of every link in mail. Never taken from the request |
| `RESEND_API_KEY`, `MAIL_FROM` | Sending mail; needs a verified domain |
| `CONTACT_TO` | Where the contact form's copy goes; unset means the message is only stored |

Each file in `app/api` (outside `_lib`) is one function and the Hobby plan allows 12, so related routes share a file and pick the action from the query string.

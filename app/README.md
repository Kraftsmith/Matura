# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

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

Each file in `app/api` (outside `_lib`) is one function and the Hobby plan allows 12, so related routes share a file and pick the action from the query string.

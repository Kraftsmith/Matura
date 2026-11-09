// After `astro build`: the app's static files (illustrations, icons) are referenced by absolute paths
// such as /images/vocab/… from the app's data, so they must also be served from the root of the deployment.
// Run from site/: node scripts/copy-public.mjs
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const from = here('../../app/public');
const to = here('../../app/dist');

if (!existsSync(from)) {
  console.error(`copy-public: ${from} not found`);
  process.exit(1);
}
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true, force: false, errorOnExist: false });
console.log('copy-public: app/public → app/dist');

// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** Where the pages are served from; the app lives under /app/ on the same host (Spec - Landing §3.1). */
const SITE_URL = process.env.SITE_URL ?? 'https://maturaenglish.pl';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  // The site and the app are one Vercel deployment: the site is the root of dist/, the app is dist/app/.
  outDir: '../app/dist',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/potwierdz') && !page.includes('/wypisz') && !page.endsWith('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Components are imported from ../app/src; they must see this project's React, not a second copy.
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', 'canvas-confetti'],
      alias: {
        '@app': here('../app/src'),
        react: here('node_modules/react'),
        'react-dom': here('node_modules/react-dom'),
        'lucide-react': here('node_modules/lucide-react'),
        'canvas-confetti': here('node_modules/canvas-confetti'),
      },
    },
    server: { fs: { allow: [here('..')] } },
  },
});

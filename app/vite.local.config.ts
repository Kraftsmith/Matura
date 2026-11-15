// Local dev server with the API: Vite serves the app under /app/ and routes /api/* to the handlers in api/ (Fetch-style GET/POST exports).
// Replaces `vercel dev`, which cannot install its builders on this Windows machine (symlinks need Developer Mode).
import { existsSync } from 'node:fs';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { loadEnv, mergeConfig, type Plugin, type ViteDevServer } from 'vite';
import base from './vite.config.ts';

const appDir = fileURLToPath(new URL('.', import.meta.url)).replaceAll('\\', '/').replace(/\/$/, '');
const dynamic: Record<string, string> = { students: 'id', notes: 'noteId', cards: 'cardId' };

/** /api/students/<id>/notes → api/students/[id]/notes.ts; /api/me → api/me.ts */
const fileFor = (pathname: string): string | undefined => {
  const parts = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return undefined;
  const direct = `${appDir}/api/${parts.join('/')}.ts`;
  if (existsSync(direct)) return direct;
  const [head, , ...rest] = parts;
  const param = dynamic[head];
  if (!param || parts.length < 2) return undefined;
  const candidate = `${appDir}/api/${head}/[${param}]${rest.length ? '/' + rest.join('/') : ''}.ts`;
  return existsSync(candidate) ? candidate : undefined;
};

const apiPlugin = (): Plugin => ({
  name: 'local-api',
  configureServer(server: ViteDevServer) {
    Object.assign(process.env, loadEnv('development', appDir, ''));
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api')) return next();
      const url = new URL(req.url, `http://${req.headers.host}`);
      const file = fileFor(url.pathname);
      if (!file) { res.statusCode = 404; return res.end('no handler'); }
      try {
        const mod = await server.ssrLoadModule(file);
        const handler = mod[req.method as string];
        if (!handler) { res.statusCode = 405; return res.end('method'); }
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v); else if (Array.isArray(v)) headers.set(k, v.join(', '));
        const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(req.method as string);
        const request = new Request(url, { method: req.method, headers, body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined, ...(hasBody ? { duplex: 'half' } : {}) } as RequestInit);
        const response: Response = await handler(request);
        res.statusCode = response.status;
        response.headers.forEach((v, k) => { if (k !== 'set-cookie') res.setHeader(k, v); });
        const cookies = response.headers.getSetCookie();
        if (cookies.length) res.setHeader('set-cookie', cookies);
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (e) {
        console.error('[local-api]', e);
        res.statusCode = 500; res.end('local api error');
      }
    });
  },
});

export default mergeConfig(base, { root: appDir, envDir: appDir, plugins: [apiPlugin()], server: { port: 5174, strictPort: true } });

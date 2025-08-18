import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

async function corsWrapper(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://toyzzbox.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const res = await handler[req.method as 'POST' | 'GET']?.(req);
  if (!res) return new Response('Method Not Allowed', { status: 405 });

  res.headers.set('Access-Control-Allow-Origin', 'https://toyzzbox.com');
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return res;
}

// App Router export
export const POST = corsWrapper;
export const GET = corsWrapper;
export const OPTIONS = corsWrapper;

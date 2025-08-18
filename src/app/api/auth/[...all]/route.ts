import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

// CORS wrapper
async function corsWrapper(req: Request) {
  // Preflight OPTIONS isteğine cevap
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.toyzzbox.com', // frontend domain
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // POST veya GET handler
  const res = await handler[req.method as 'POST' | 'GET']?.(req);

  if (!res) {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // CORS header ekle
  res.headers.set('Access-Control-Allow-Origin', 'https://www.toyzzbox.com');
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return res;
}

// App Router export
export const POST = corsWrapper;
export const GET = corsWrapper;
export const OPTIONS = corsWrapper;

import { json } from '@sveltejs/kit';

/** Stores the GitHub provider token in an httpOnly cookie. */
export async function POST({ request, cookies }) {
  const { token } = await request.json();

  if (!token) return json({ ok: false }, { status: 400 });

  cookies.set('gh_token', token, {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8
  });

  return json({ ok: true });
}

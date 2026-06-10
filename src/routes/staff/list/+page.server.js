import { redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url }) {
  if (cookies.get('staff_auth') !== 'true') {
    redirect(302, '/staff');
  }

  const { PUBLIC_API_URL } = await import('$env/static/public');

  try {
    const res = await fetch(`${PUBLIC_API_URL}?action=getAllSpenders&_=${Date.now()}`);
    const data = await res.json();
    return { spenders: data.allSpenders ?? [] };
  } catch {
    return { spenders: [] };
  }
}

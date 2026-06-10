import { STAFF_CODE } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export async function load({ cookies }) {
  return { authenticated: cookies.get('staff_auth') === 'true' };
}

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const code = data.get('code');

    if (code === STAFF_CODE) {
      cookies.set('staff_auth', 'true', {
        path: '/staff',
        httpOnly: true,
        maxAge: 60 * 60 * 8
      });
      return { success: true };
    }

    return fail(401, { error: 'รหัสผ่านไม่ถูกต้อง' });
  },

  logout: async ({ cookies }) => {
    cookies.delete('staff_auth', { path: '/staff' });
  }
};

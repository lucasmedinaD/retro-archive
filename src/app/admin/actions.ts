'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const PASS = process.env.ADMIN_PASSWORD || 'admin123'; // Default fallback, user should change this

export async function loginAction(formData: FormData) {
    const password = formData.get('password');

    if (password === PASS) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        redirect('/admin');
    } else {
        return { error: 'ACCESS DENIED: Invalid Protocol Credentials' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

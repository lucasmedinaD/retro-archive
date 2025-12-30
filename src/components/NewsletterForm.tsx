'use client';

import { useActionState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

const initialState = { error: '', success: false };

export default function NewsletterForm({ dict }: { dict: any }) {
    const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-black mb-6 uppercase">{dict.newsletter.title}</h3>
            <form action={formAction} className="relative">
                <div className="flex gap-0 border border-black dark:border-white p-1">
                    <input
                        type="email"
                        name="email"
                        placeholder={dict.newsletter.placeholder}
                        required
                        disabled={state?.success}
                        className="flex-1 bg-transparent p-3 font-mono text-sm outline-none placeholder:text-gray-400 uppercase disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={state?.success}
                        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:invert transition-all disabled:opacity-50"
                    >
                        {state?.success ? '✓' : dict.newsletter.button}
                    </button>
                </div>
                {state?.error && (
                    <p className="mt-2 text-xs font-mono text-red-500">
                        {state.error}
                    </p>
                )}
                {state?.success && (
                    <p className="mt-2 text-xs font-mono text-green-500">
                        ✓ ¡Suscrito exitosamente!
                    </p>
                )}
            </form>
        </div>
    );
}

'use client';

import { loginAction } from '../actions';
import { useState, useTransition } from 'react';

export default function LoginPage() {
    const [headerText, setHeaderText] = useState('SYSTEM ACCESS');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
                setHeaderText('ACCESS DENIED');
                setTimeout(() => setHeaderText('SYSTEM ACCESS'), 3000);
            }
        });
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            {/* Simple Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="relative z-10 w-full max-w-md bg-[#111] border border-[#333] p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                        {headerText}
                    </h1>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                        Secure Environment
                    </p>
                </div>

                {error && (
                    <div className="mb-6 border border-red-500 bg-red-500/10 p-4">
                        <p className="font-mono text-xs text-red-400 leading-relaxed">
                            {error}
                        </p>
                    </div>
                )}

                <form action={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="password"
                        name="password"
                        placeholder="ENTER ACCESS CODE"
                        className="w-full bg-black/50 border border-[#333] p-4 text-center font-mono text-lg outline-none focus:border-white transition-all text-white uppercase"
                        autoFocus
                        disabled={isPending}
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-white text-black font-black uppercase py-4 tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
                    </button>
                </form>

                {/* Debug Info (only in development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 border border-yellow-500/30 bg-yellow-500/5 p-3">
                        <p className="font-mono text-[10px] text-yellow-500/70 mb-2">
                            🔧 DEV MODE DEBUG:
                        </p>
                        <p className="font-mono text-[9px] text-gray-600">
                            Check Vercel dashboard → Settings → Environment Variables
                            <br />
                            Ensure ADMIN_PASSWORD is set for Production
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

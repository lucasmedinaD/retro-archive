'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';
import { motion } from 'framer-motion';

export default function LoginPage() {
    // @ts-ignore - useActionState types can be tricky in some versions
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#111] border border-[#333] p-8 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/50 animate-scan pointer-events-none" />

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
                            SYSTEM <span className="text-accent">ACCESS</span>
                        </h1>
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                            Secure Environment // 256-bit
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col gap-6">
                        <div className="relative group">
                            <input
                                type="password"
                                name="password"
                                placeholder="ENTER ACCESS CODE"
                                className="w-full bg-black/50 border border-[#333] p-4 text-center font-mono text-lg outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all placeholder:text-gray-700 text-accent uppercase tracking-widest"
                                autoFocus
                            />
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-gray-500 group-focus-within:border-accent transition-colors" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-gray-500 group-focus-within:border-accent transition-colors" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-gray-500 group-focus-within:border-accent transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-gray-500 group-focus-within:border-accent transition-colors" />
                        </div>

                        {state?.error && (
                            <p className="text-red-500 font-mono text-xs text-center border border-red-900/50 bg-red-900/20 p-2 uppercase animate-pulse">
                                {state.error}
                            </p>
                        )}

                        <button
                            disabled={isPending}
                            className={`
                                w-full bg-white text-black font-black uppercase py-4 tracking-widest hover:bg-accent hover:text-white transition-all
                                ${isPending ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                            `}
                        >
                            {isPending ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#222] text-center">
                        <p className="font-mono text-[10px] text-[#444] uppercase">
                            Warning: Unauthorized access attempts are logged and reported.
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

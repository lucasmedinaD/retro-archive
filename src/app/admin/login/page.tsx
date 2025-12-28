'use client';

import { loginAction } from '../actions';
import { useState } from 'react';

export default function LoginPage() {
    const [headerText, setHeaderText] = useState('SYSTEM ACCESS');

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

                <form action={loginAction} className="flex flex-col gap-6">
                    <input
                        type="password"
                        name="password"
                        placeholder="ENTER ACCESS CODE"
                        className="w-full bg-black/50 border border-[#333] p-4 text-center font-mono text-lg outline-none focus:border-white transition-all text-white uppercase"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-black uppercase py-4 tracking-widest hover:bg-gray-200 transition-all"
                    >
                        INITIALIZE SESSION
                    </button>
                    {/* Fallback error message guidance if defaults fail */}
                    <p className="text-xs text-center text-gray-600">Password: admin123</p>
                </form>
            </div>
        </main>
    );
}

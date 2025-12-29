'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="text-center max-w-md border-2 border-white p-12">
                <h1 className="text-6xl font-black mb-4 uppercase">ERROR</h1>
                <div className="mb-8">
                    <p className="font-mono text-xs text-red-500 mb-2">SYSTEM MALFUNCTION</p>
                    <p className="text-sm text-gray-400">
                        {error.message || 'Algo salió mal. Por favor intenta de nuevo.'}
                    </p>
                </div>
                <button
                    onClick={reset}
                    className="bg-white text-black px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-gray-200 transition-colors border-2 border-white"
                >
                    REINTENTAR
                </button>
            </div>
        </div>
    );
}

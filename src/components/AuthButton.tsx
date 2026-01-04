'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface AuthButtonProps {
    lang: 'en' | 'es';
}

export default function AuthButton({ lang }: AuthButtonProps) {
    const { user, isLoading, signInWithGoogle, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
                <LogIn size={16} />
                <span className="hidden sm:inline">
                    {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
                </span>
            </button>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
                {user.user_metadata?.avatar_url ? (
                    <Image
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={() => {
                                signOut();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <LogOut size={16} />
                            {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

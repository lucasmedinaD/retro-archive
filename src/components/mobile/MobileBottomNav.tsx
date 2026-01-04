'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, Coffee, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Image from 'next/image';
import ProfileModal from '@/components/ProfileModal';

interface MobileBottomNavProps {
    lang: 'en' | 'es';
    onDonateClick: () => void;
}

export default function MobileBottomNav({ lang, onDonateClick }: MobileBottomNavProps) {
    const pathname = usePathname();
    const { user, signInWithGoogle, signOut } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === `/${lang}/search` && pathname.includes('search')) return true;
        if (path === `/${lang}/shop` && pathname.includes('shop')) return true;
        if (path === `/${lang}` && pathname === `/${lang}`) return true;
        return false;
    };

    const handleProfileClick = () => {
        if (!user) {
            signInWithGoogle();
        } else {
            setIsProfileMenuOpen(true);
        }
    };

    const navItems = [
        {
            icon: Home,
            label: lang === 'es' ? 'Inicio' : 'Home',
            path: `/${lang}`,
            action: null
        },
        {
            icon: Search,
            label: lang === 'es' ? 'Buscar' : 'Search',
            path: `/${lang}/search`,
            action: null
        },
        {
            // Profile Item (Replaces Favorites)
            icon: User,
            label: lang === 'es' ? 'Perfil' : 'Profile',
            path: null,
            action: handleProfileClick,
            isProfile: true
        },
        {
            icon: ShoppingBag,
            label: lang === 'es' ? 'Tienda' : 'Shop',
            path: `/${lang}/shop`,
            action: null
        },
        {
            icon: Coffee,
            label: lang === 'es' ? 'Apoyar' : 'Support',
            path: null,
            action: onDonateClick
        }
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 py-2 pb-safe bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-black/10 dark:border-white/10 z-50 md:hidden transition-all duration-300">
                <div className="flex justify-around items-center">
                    {navItems.map((item: any) => {
                        const active = item.path ? isActive(item.path) : (item.isProfile && isProfileMenuOpen);
                        const Icon = item.icon;

                        if (item.isProfile && user && user.user_metadata?.avatar_url) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="flex flex-col items-center gap-1 p-2 w-14"
                                >
                                    <div className={`relative w-[22px] h-[22px] rounded-full overflow-hidden border-2 ${active ? 'border-black dark:border-white' : 'border-transparent'}`}>
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </button>
                            );
                        }

                        if (item.action) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="flex flex-col items-center gap-1 p-2 w-14"
                                >
                                    <Icon
                                        size={22}
                                        className={active ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}
                                        strokeWidth={active ? 2.5 : 2}
                                    />
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.path!}
                                className="flex flex-col items-center gap-1 p-2 w-14"
                            >
                                <Icon
                                    size={22}
                                    className={`${active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Profile Menu Sheet */}
            {isProfileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm md:hidden"
                        onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] z-[70] rounded-t-3xl p-6 pb-safe md:hidden animate-in slide-in-from-bottom duration-300">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 relative border-2 border-black dark:border-white">
                                {user?.user_metadata?.avatar_url ? (
                                    <Image
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                )}
                            </div>
                            <h3 className="font-bold text-lg">{user?.user_metadata?.full_name || user?.email}</h3>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    setIsProfileModalOpen(true);
                                }}
                                className="flex items-center gap-4 w-full p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold"
                            >
                                <Settings size={20} />
                                {lang === 'es' ? 'Editar Perfil' : 'Edit Profile'}
                            </button>

                            <Link
                                href={`/${lang}/favorites`}
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="flex items-center gap-4 w-full p-4 bg-gray-50 dark:bg-white/5 rounded-xl font-bold"
                            >
                                <Heart size={20} className="text-red-500" />
                                {lang === 'es' ? 'Mis Favoritos' : 'My Favorites'}
                            </Link>

                            <button
                                onClick={() => {
                                    signOut();
                                    setIsProfileMenuOpen(false);
                                }}
                                className="flex items-center gap-4 w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-bold"
                            >
                                <LogOut size={20} />
                                {lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                lang={lang}
            />
        </>
    );
}

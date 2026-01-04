'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Notification {
    id: string;
    type: 'reply' | 'like';
    is_read: boolean;
    created_at: string;
    transformation_id: string;
    actor: {
        full_name: string;
        avatar_url: string;
    };
    comment?: {
        content: string;
    };
}

export default function NotificationBell({ lang }: { lang: 'en' | 'es' }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const supabase = createSupabaseBrowserClient();

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

    const fetchNotifications = async () => {
        if (!user || !supabase) return;
        setIsLoading(true);

        const { data } = await supabase
            .from('notifications')
            .select(`
                id,
                type,
                is_read,
                created_at,
                transformation_id,
                actor:actor_id (
                    full_name,
                    avatar_url
                ),
                comment:comment_id (
                    content
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data as any);
            setUnreadCount(data.filter((n: any) => !n.is_read).length);
        }
        setIsLoading(false);
    };

    // Initial fetch and Realtime subscription
    useEffect(() => {
        if (!user || !supabase) return;

        fetchNotifications();

        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    // New notification received
                    setUnreadCount(prev => prev + 1);
                    // Optionally refetch full list to get actor details
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const markAsRead = async () => {
        if (!user || !supabase) return;

        // Optimistic update
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} className={unreadCount > 0 ? "text-black dark:text-white" : "text-gray-500"} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-sm uppercase">
                            {lang === 'es' ? 'Notificaciones' : 'Notifications'}
                        </h3>
                        {isLoading && <span className="text-xs text-gray-400">...</span>}
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                {lang === 'es' ? 'Sin notificaciones nuevas' : 'No new notifications'}
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={`/${lang}/anime-to-real/${notification.transformation_id}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`block p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            {notification.actor?.avatar_url ? (
                                                <Image
                                                    src={notification.actor.avatar_url}
                                                    alt="User"
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full object-cover w-8 h-8"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                                            )}
                                            {notification.type === 'like' ? (
                                                <div className="absolute -mt-3 -ml-1 bg-red-500 text-white rounded-full p-0.5 border-2 border-white dark:border-black">
                                                    <span className="block w-2 h-2">❤️</span>
                                                </div>
                                            ) : (
                                                <div className="absolute -mt-3 -ml-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-black">
                                                    <span className="block w-2 h-2">💬</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                <span className="font-bold">{notification.actor?.full_name || 'Alguien'}</span>
                                                {' '}
                                                {notification.type === 'like'
                                                    ? (lang === 'es' ? 'le gustó tu comentario' : 'liked your comment')
                                                    : (lang === 'es' ? 'respondió tu comentario' : 'replied to you')
                                                }
                                            </p>
                                            {notification.comment?.content && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    "{notification.comment.content}"
                                                </p>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: lang === 'es' ? es : enUS })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

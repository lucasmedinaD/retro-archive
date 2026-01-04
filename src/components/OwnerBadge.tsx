'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface OwnerBadgeProps {
    transformationId: string;
    className?: string;
    showTitle?: boolean;
}

interface OwnerData {
    username: string;
    avatar_url: string | null;
    tap_count: number;
}

export default function OwnerBadge({ transformationId, className = '', showTitle = false }: OwnerBadgeProps) {
    const [owner, setOwner] = useState<OwnerData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!transformationId) {
            setIsLoading(false);
            return;
        }

        loadOwner();
    }, [transformationId]);

    const loadOwner = async () => {
        try {
            const supabase = createSupabaseBrowserClient();

            if (!supabase) {
                setOwner(null);
                setIsLoading(false);
                return;
            }

            // First get the transformation with owner_user_id and tap_count
            const { data: transformation, error: transformError } = await supabase
                .from('transformations')
                .select('tap_count, owner_user_id')
                .eq('id', transformationId)
                .single();

            if (transformError || !transformation || !transformation.owner_user_id) {
                // No owner yet
                setOwner(null);
                setIsLoading(false);
                return;
            }

            // Now get the user profile
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('username, avatar_url')
                .eq('id', transformation.owner_user_id)
                .single();

            if (profileError || !profile) {
                setOwner(null);
                setIsLoading(false);
                return;
            }

            setOwner({
                username: profile.username,
                avatar_url: profile.avatar_url,
                tap_count: transformation.tap_count || 0
            });
        } catch (err) {
            console.error('Failed to load owner:', err);
            setOwner(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render anything if loading or no owner
    if (isLoading || !owner || !owner.username) {
        return null;
    }

    return (
        <div className={`${showTitle ? 'p-4 border-2 border-purple-500/50 bg-purple-500/10 rounded' : ''} ${className}`}>
            {showTitle && (
                <p className="text-xs font-mono uppercase text-purple-600 dark:text-purple-400 mb-2">
                    🏆 Current Champion
                </p>
            )}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 bg-black/50 flex-shrink-0">
                    {owner.avatar_url ? (
                        <Image
                            src={owner.avatar_url}
                            alt={owner.username}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">
                            👤
                        </div>
                    )}
                </div>

                {/* Username & Count */}
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">
                        @{owner.username}
                    </span>
                    <span className="text-[10px] text-white/70 font-mono">
                        🔥 {owner.tap_count} taps
                    </span>
                </div>
            </div>
        </div>
    );
}

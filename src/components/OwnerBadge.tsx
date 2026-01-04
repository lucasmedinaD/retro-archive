'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getTransformationOwner } from '@/lib/tapStreak';

interface OwnerBadgeProps {
    transformationId: string;
    className?: string;
}

interface OwnerData {
    username: string;
    avatar_url: string | null;
    tap_count: number;
}

export default function OwnerBadge({ transformationId, className = '' }: OwnerBadgeProps) {
    const [owner, setOwner] = useState<OwnerData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOwner();
    }, [transformationId]);

    const loadOwner = async () => {
        try {
            const data = await getTransformationOwner(transformationId);
            setOwner(data);
        } catch (err) {
            console.error('Failed to load owner:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return null; // Don't show anything while loading
    }

    if (!owner) {
        return null; // No owner yet
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
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
    );
}

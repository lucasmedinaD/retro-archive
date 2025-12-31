'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
    id: string;
    type: 'transformation' | 'product';
    size?: number;
    className?: string;
}

export default function WishlistButton({ id, type, size = 20, className = '' }: WishlistButtonProps) {
    const { isInWishlist, toggleItem } = useWishlist();
    const isActive = isInWishlist(id);

    return (
        <motion.button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(id, type);
            }}
            whileTap={{ scale: 0.9 }}
            className={`transition-colors ${className}`}
            aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                size={size}
                className={`transition-all ${isActive
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
            />
        </motion.button>
    );
}

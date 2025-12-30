'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Download, Share2, Heart } from 'lucide-react';

interface EnhancedComparisonSliderProps {
    animeImage: string;
    realImage: string;
    characterName: string;
    onLike?: () => void;
    onShare?: () => void;
    onDownload?: () => void;
    initialPosition?: number;
    isLiked?: boolean;
}

export default function EnhancedComparisonSlider({
    animeImage,
    realImage,
    characterName,
    onLike,
    onShare,
    onDownload,
    initialPosition = 50,
    isLiked: externalIsLiked = false
}: EnhancedComparisonSliderProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const [showActions, setShowActions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update position based on client X coordinate
    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
    };

    // Desktop: Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        updatePosition(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Mobile: Touch events with aggressive preventDefault
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            // CRITICAL: Prevent all default behaviors
            e.preventDefault();
            e.stopPropagation();

            setIsDragging(true);
            setShowActions(true);
            const touch = e.touches[0];
            updatePosition(touch.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            // CRITICAL: Prevent scrolling
            e.preventDefault();
            e.stopPropagation();

            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            updatePosition(touch.clientX);
        };

        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            setIsDragging(false);
        };

        // Add passive: false to allow preventDefault
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Prevent context menu on long press
        container.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    return (
        <div
            className="relative rounded-lg overflow-hidden"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Slider Container */}
            <div
                ref={containerRef}
                className="relative aspect-[4/5] select-none cursor-ew-resize bg-gray-100 dark:bg-gray-900"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    touchAction: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                }}
            >
                {/* Background Image (Real) */}
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={realImage}
                        alt={`${characterName} - Real Version`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Foreground Image (Anime) - Clipped */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        clipPath: `inset(0 ${100 - position}% 0 0)`
                    }}
                >
                    <img
                        src={animeImage}
                        alt={`${characterName} - Anime Version`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Slider Divider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
                    style={{ left: `${position}%` }}
                >
                    {/* Slider Handle - EXTRA BIG on mobile */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-14 sm:h-14 bg-white rounded-full shadow-2xl flex items-center justify-center pointer-events-none"
                        animate={{
                            scale: isDragging ? 1.2 : 1,
                            boxShadow: isDragging
                                ? '0 0 0 12px rgba(255,255,255,0.3), 0 12px 24px rgba(0,0,0,0.3)'
                                : '0 6px 16px rgba(0,0,0,0.2)'
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Drag Icon */}
                        <svg
                            className="w-8 h-8 sm:w-6 sm:h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19l7-7-7-7" />
                        </svg>
                    </motion.div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/90 text-white px-3 py-1.5 text-xs font-mono rounded-sm uppercase font-bold pointer-events-none">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Anime
                    </span>
                </div>

                <div className="absolute top-4 right-4 bg-black/90 text-white px-3 py-1.5 text-xs font-mono rounded-sm uppercase font-bold pointer-events-none">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Real
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: showActions ? 1 : 0,
                    y: showActions ? 0 : 10
                }}
                transition={{ duration: 0.2 }}
            >
                {onLike && (
                    <motion.button
                        onClick={handleLike}
                        className="p-4 bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-red-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label={isLiked ? "Unlike" : "Like"}
                    >
                        <Heart
                            size={22}
                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                        />
                    </motion.button>
                )}

                {onShare && (
                    <motion.button
                        onClick={onShare}
                        className="p-4 bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-blue-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label="Share"
                    >
                        <Share2 size={22} className="text-gray-700 dark:text-gray-300" />
                    </motion.button>
                )}

                {onDownload && (
                    <motion.button
                        onClick={onDownload}
                        className="p-4 bg-white/95 dark:bg-gray-800/95 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-green-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label="Download"
                    >
                        <Download size={22} className="text-gray-700 dark:text-gray-300" />
                    </motion.button>
                )}
            </motion.div>

            {/* Mobile Hint */}
            <motion.div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-2 rounded-full text-xs font-mono pointer-events-none sm:hidden"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -10 }}
                transition={{ delay: 2.5, duration: 0.5 }}
            >
                👆 Toca y arrastra
            </motion.div>

            {/* Desktop Hint */}
            <motion.div
                className="hidden sm:block absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-mono pointer-events-none"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -10 }}
                transition={{ delay: 2.5, duration: 0.5 }}
            >
                ← Drag to compare →
            </motion.div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
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
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track touch state
    const touchState = useRef({
        isTracking: false,
        startX: 0,
        startY: 0,
        isDraggingSlider: false,
        hasDecidedDirection: false
    });

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
    }, []);

    // Mouse handlers (desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
        touchState.current.isTracking = true;
        touchState.current.isDraggingSlider = true;
        updatePosition(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!touchState.current.isTracking || !touchState.current.isDraggingSlider) return;
        updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
        touchState.current.isTracking = false;
        touchState.current.isDraggingSlider = false;
    };

    // Touch handlers (mobile) - THE KEY FIX
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchState.current = {
            isTracking: true,
            startX: touch.clientX,
            startY: touch.clientY,
            isDraggingSlider: false,
            hasDecidedDirection: false
        };
        // Don't prevent default yet - let browser decide
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchState.current.isTracking) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchState.current.startX);
        const deltaY = Math.abs(touch.clientY - touchState.current.startY);

        // Decide direction if we haven't yet (after 10px of movement)
        if (!touchState.current.hasDecidedDirection && (deltaX > 10 || deltaY > 10)) {
            touchState.current.hasDecidedDirection = true;

            // If horizontal movement is greater, this is a slider drag
            if (deltaX > deltaY) {
                touchState.current.isDraggingSlider = true;
            }
        }

        // If user is dragging the slider horizontally
        if (touchState.current.isDraggingSlider) {
            e.preventDefault(); // NOW prevent scroll
            updatePosition(touch.clientX);
        }
        // If vertical, do nothing - browser handles scroll
    };

    const handleTouchEnd = () => {
        touchState.current = {
            isTracking: false,
            startX: 0,
            startY: 0,
            isDraggingSlider: false,
            hasDecidedDirection: false
        };
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    return (
        <div className="relative rounded-lg overflow-hidden">
            {/* Slider Container */}
            <div
                ref={containerRef}
                className="relative aspect-[4/5] select-none bg-gray-100 dark:bg-gray-900 cursor-ew-resize"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Background Image (Real) */}
                <img
                    src={realImage}
                    alt={`${characterName} - Real`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />

                {/* Foreground Image (Anime) - Clipped */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <img
                        src={animeImage}
                        alt={`${characterName} - Anime`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Slider Line & Visual Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-10"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-100">
                        <svg className="w-7 h-7 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1.5 text-[10px] font-bold uppercase pointer-events-none rounded z-10">
                    ANIME
                </div>
                <div className="absolute top-3 right-3 bg-black/90 text-white px-3 py-1.5 text-[10px] font-bold uppercase pointer-events-none rounded z-10">
                    REAL
                </div>

                {/* Mobile Hint */}
                <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase pointer-events-none md:hidden z-10"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                >
                    ↔ Desliza horizontal
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="mt-4 flex justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {onLike && (
                    <button
                        onClick={handleLike}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700"
                        aria-label={isLiked ? "Unlike" : "Like"}
                    >
                        <Heart size={20} className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                    </button>
                )}
                {onShare && (
                    <button onClick={onShare} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700">
                        <Share2 size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                )}
                {onDownload && (
                    <button onClick={onDownload} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700">
                        <Download size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                )}
            </motion.div>
        </div>
    );
}

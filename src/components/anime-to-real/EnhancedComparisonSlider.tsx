'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Share2, Heart, Sparkles } from 'lucide-react';

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
    const [isDragging, setIsDragging] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Spring animation for smooth movement
    const springPosition = useSpring(position, {
        stiffness: 300,
        damping: 30,
        mass: 0.5
    });

    // Glow intensity based on drag state
    const glowIntensity = useSpring(isDragging ? 1 : 0, {
        stiffness: 200,
        damping: 20
    });

    // Touch state ref for gesture detection
    const touchState = useRef({
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

    const triggerSparkle = useCallback(() => {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 600);
    }, []);

    // NATIVE event handlers with passive: false
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchState.current = {
                startX: touch.clientX,
                startY: touch.clientY,
                isDraggingSlider: false,
                hasDecidedDirection: false
            };
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchState.current.startX);
            const deltaY = Math.abs(touch.clientY - touchState.current.startY);

            // Decide direction after 10px of movement
            if (!touchState.current.hasDecidedDirection && (deltaX > 10 || deltaY > 10)) {
                touchState.current.hasDecidedDirection = true;
                if (deltaX > deltaY) {
                    touchState.current.isDraggingSlider = true;
                    setIsDragging(true);
                    triggerSparkle();
                }
            }

            // If horizontal drag, prevent scroll and update position
            if (touchState.current.isDraggingSlider) {
                e.preventDefault(); // This works because passive: false
                updatePosition(touch.clientX);
            }
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
            touchState.current = {
                startX: 0,
                startY: 0,
                isDraggingSlider: false,
                hasDecidedDirection: false
            };
        };

        // Add with passive: false to allow preventDefault
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [updatePosition, triggerSparkle]);

    // Mouse handlers (React events are fine for mouse)
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        updatePosition(e.clientX);
        triggerSparkle();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
        if ('vibrate' in navigator) {
            navigator.vibrate([10, 50, 10]);
        }
    };

    // Update spring when position changes
    useEffect(() => {
        springPosition.set(position);
    }, [position, springPosition]);

    return (
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {/* Ambient Glow Effect */}
            <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-xl blur-xl z-0"
                style={{ opacity: glowIntensity }}
            />

            {/* Slider Container */}
            <div
                ref={containerRef}
                className="relative aspect-[3/4] md:aspect-[4/3] select-none bg-gray-900 cursor-ew-resize overflow-hidden z-10"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Background Image (Real) */}
                <motion.img
                    src={realImage}
                    alt={`${characterName} - Real`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    animate={{
                        scale: isDragging ? 1.02 : 1,
                        filter: isDragging ? 'saturate(1.2)' : 'saturate(1)'
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Foreground Image (Anime) - Clipped */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ clipPath: useTransform(springPosition, v => `inset(0 ${100 - v}% 0 0)`) }}
                >
                    <motion.img
                        src={animeImage}
                        alt={`${characterName} - Anime`}
                        className="w-full h-full object-cover"
                        draggable={false}
                        animate={{
                            scale: isDragging ? 1.02 : 1,
                            filter: isDragging ? 'saturate(1.2)' : 'saturate(1)'
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                {/* Dynamic Slider Line */}
                <motion.div
                    className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-20"
                    style={{ left: useTransform(springPosition, v => `${v}%`), x: '-50%' }}
                >
                    {/* Glow Line */}
                    <motion.div
                        className="absolute inset-y-0 w-1 bg-white"
                        style={{
                            boxShadow: useTransform(glowIntensity, v =>
                                `0 0 ${20 * v}px ${8 * v}px rgba(255,255,255,${0.5 * v}), 0 0 ${40 * v}px ${16 * v}px rgba(168,85,247,${0.3 * v})`
                            )
                        }}
                    />

                    {/* Handle with pulse */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        animate={{
                            scale: isDragging ? 1.2 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 400 }}
                    >
                        {/* Outer ring pulse */}
                        <motion.div
                            className="absolute inset-0 w-16 h-16 -m-2 rounded-full bg-white/20"
                            animate={{
                                scale: isDragging ? [1, 1.5, 1] : 1,
                                opacity: isDragging ? [0.5, 0, 0.5] : 0
                            }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        />

                        {/* Main handle */}
                        <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-purple-500/50">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Sparkle effect */}
                    {showSparkle && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Sparkles className="w-8 h-8 text-yellow-400" />
                        </motion.div>
                    )}
                </motion.div>

                {/* Labels */}
                <motion.div
                    className="absolute top-4 left-4 backdrop-blur-md bg-black/60 text-white px-4 py-2 text-xs font-bold uppercase pointer-events-none rounded-lg z-10 border border-white/20"
                    animate={{ x: isDragging ? -5 : 0 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        ANIME
                    </span>
                </motion.div>

                <motion.div
                    className="absolute top-4 right-4 backdrop-blur-md bg-black/60 text-white px-4 py-2 text-xs font-bold uppercase pointer-events-none rounded-lg z-10 border border-white/20"
                    animate={{ x: isDragging ? 5 : 0 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        REAL
                    </span>
                </motion.div>

                {/* Progress bar */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                            style={{ width: useTransform(springPosition, v => `${v}%`) }}
                        />
                    </div>
                </div>

                {/* Mobile Hint */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/70 text-white px-6 py-3 rounded-full text-sm font-bold uppercase pointer-events-none md:hidden z-10 border border-white/20"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                >
                    ↔ Desliza
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="mt-4 flex justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {onLike && (
                    <motion.button
                        onClick={handleLike}
                        className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 relative overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Heart size={22} className={`relative z-10 transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </motion.button>
                )}
                {onShare && (
                    <motion.button
                        onClick={onShare}
                        className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Share2 size={22} className="text-white" />
                    </motion.button>
                )}
                {onDownload && (
                    <motion.button
                        onClick={onDownload}
                        className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download size={22} className="text-white" />
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

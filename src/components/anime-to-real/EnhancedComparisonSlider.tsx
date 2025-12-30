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
    funFact?: string;
    transformationId?: string;
    dict?: any;
}

export default function EnhancedComparisonSlider({
    animeImage,
    realImage,
    characterName,
    onLike,
    onShare,
    onDownload,
    initialPosition = 50,
    isLiked: externalIsLiked = false,
    funFact,
    transformationId,
    dict
}: EnhancedComparisonSliderProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const [isDragging, setIsDragging] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);
    const [showFunFact, setShowFunFact] = useState(false);
    const [hasReachedEdge, setHasReachedEdge] = useState({ left: false, right: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const lastHapticPosition = useRef<number | null>(null);

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

    // Haptic feedback at key positions (0%, 50%, 100%)
    const triggerHaptic = useCallback((intensity: number[] = [10]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(intensity);
        }
    }, []);

    // Check for edge positions and trigger haptic/fun fact
    useEffect(() => {
        const checkEdges = () => {
            // Left edge (0-5%)
            if (position <= 5 && !hasReachedEdge.left) {
                setHasReachedEdge(prev => ({ ...prev, left: true }));
                triggerHaptic([15, 30, 15]);
                if (funFact) setShowFunFact(true);
            }
            // Right edge (95-100%)
            if (position >= 95 && !hasReachedEdge.right) {
                setHasReachedEdge(prev => ({ ...prev, right: true }));
                triggerHaptic([15, 30, 15]);
                if (funFact) setShowFunFact(true);
            }
            // Center (45-55%) - subtle feedback
            if (position >= 45 && position <= 55 && lastHapticPosition.current !== 50) {
                lastHapticPosition.current = 50;
                triggerHaptic([5]);
            } else if (position < 45 || position > 55) {
                lastHapticPosition.current = null;
            }
        };

        if (isDragging) checkEdges();
    }, [position, isDragging, hasReachedEdge, triggerHaptic, funFact]);

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
                className="relative w-full max-w-2xl mx-auto select-none bg-gray-900 cursor-ew-resize overflow-hidden z-10"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Background Image (Real) */}
                <motion.img
                    src={realImage}
                    alt={`${characterName} - Real`}
                    className="relative block w-full h-auto object-cover pointer-events-none"
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
                        {dict?.transformation?.from || 'SOURCE MATERIAL'}
                    </span>
                </motion.div>

                <motion.div
                    className="absolute top-4 right-4 backdrop-blur-md bg-black/60 text-white px-4 py-2 text-xs font-bold uppercase pointer-events-none rounded-lg z-10 border border-white/20"
                    animate={{ x: isDragging ? 5 : 0 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {dict?.anime_to_real?.title || 'SIMULATION RENDER'}
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
                    ↔ {dict?.transformation?.slide || 'Slide'}
                </motion.div>

                {/* Fun Fact Reveal */}
                {showFunFact && funFact && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 max-w-xs"
                        onClick={() => setShowFunFact(false)}
                    >
                        <div className="backdrop-blur-xl bg-black/90 text-white p-4 border-2 border-accent shadow-2xl">
                            <p className="text-[10px] font-mono uppercase text-accent mb-2 flex items-center gap-2">
                                <Sparkles size={12} />
                                {dict?.transformation?.hidden_fact || 'HIDDEN FACT UNLOCKED'}
                            </p>
                            <p className="text-sm font-medium leading-relaxed">{funFact}</p>
                            <p className="text-[10px] font-mono text-gray-400 mt-3 text-center">{dict?.transformation?.tap_to_close || 'TAP TO CLOSE'}</p>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {onLike && (
                        <motion.button
                            onClick={handleLike}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart size={20} className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800 dark:text-white'}`} />
                        </motion.button>
                    )}
                    {onShare && (
                        <motion.button
                            onClick={onShare}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 size={20} className="text-gray-800 dark:text-white" />
                        </motion.button>
                    )}
                    {onDownload && (
                        <motion.button
                            onClick={onDownload}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border-2 border-white/50 backdrop-blur-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download size={20} className="text-gray-800 dark:text-white" />
                        </motion.button>
                    )}
                </motion.div>

                {/* Tech Overlays */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[8px] font-mono text-white/50 bg-black/20 px-2 py-0.5 rounded-full pointer-events-none border border-white/5">
                    <span>AR-X ENHANCED</span>
                    <span>•</span>
                    <span>v2.5.0</span>
                </div>
            </div>
        </div>
    );
}

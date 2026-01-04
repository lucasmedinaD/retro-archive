'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Share2, Heart, Sparkles } from 'lucide-react';
import SecretUnlockModal from '../SecretUnlockModal';

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
    // Easter Egg: Secret Photo Unlock
    secretImage?: string;
    secretPosition?: number;
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
    dict,
    secretImage,
    secretPosition
}: EnhancedComparisonSliderProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const [isDragging, setIsDragging] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);
    const [showFunFact, setShowFunFact] = useState(false);
    const [showHeartBurst, setShowHeartBurst] = useState(false);
    const [hasReachedEdge, setHasReachedEdge] = useState({ left: false, right: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const lastHapticPosition = useRef<number | null>(null);

    // Easter Egg: Secret Detection State
    const [isInSecretZone, setIsInSecretZone] = useState(false);
    const [hasUnlocked, setHasUnlocked] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const secretZoneTimer = useRef<NodeJS.Timeout | null>(null);

    // Tap-Streak Competition State
    const [tapStreak, setTapStreak] = useState(0);
    const [showStreakIndicator, setShowStreakIndicator] = useState(false);
    const [personalBest, setPersonalBest] = useState(false);
    const tapStreakTimer = useRef<NodeJS.Timeout | null>(null);
    const currentStreak = useRef<number>(0);

    // Double-tap detection
    const lastTapRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);
    const directionDecidedRef = useRef<boolean>(false);
    const isHorizontalRef = useRef<boolean>(false);

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

    // Haptic feedback
    const triggerHaptic = useCallback((intensity: number[] = [10]) => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(intensity);
        }
    }, []);

    // Double-tap like handler
    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            // Trigger like
            if (!isLiked) {
                setIsLiked(true);
                onLike?.();
            }
            setShowHeartBurst(true);
            triggerHaptic([50]);
            setTimeout(() => setShowHeartBurst(false), 800);
        }
        lastTapRef.current = now;
    }, [isLiked, onLike, triggerHaptic]);

    // Check for edge positions and trigger haptic/fun fact
    useEffect(() => {
        const checkEdges = () => {
            if (position <= 5 && !hasReachedEdge.left) {
                setHasReachedEdge(prev => ({ ...prev, left: true }));
                triggerHaptic([15, 30, 15]);
                if (funFact) setShowFunFact(true);
            }
            if (position >= 95 && !hasReachedEdge.right) {
                setHasReachedEdge(prev => ({ ...prev, right: true }));
                triggerHaptic([15, 30, 15]);
                if (funFact) setShowFunFact(true);
            }
            if (position >= 45 && position <= 55 && lastHapticPosition.current !== 50) {
                lastHapticPosition.current = 50;
                triggerHaptic([5]);
            } else if (position < 45 || position > 55) {
                lastHapticPosition.current = null;
            }
        };

        if (isDragging) checkEdges();
    }, [position, isDragging, hasReachedEdge, triggerHaptic, funFact]);

    // Easter Egg: Secret Zone Detection - Fixed timer logic
    useEffect(() => {
        if (!secretPosition || hasUnlocked || !secretImage) {
            return;
        }

        const tolerance = 10; // ±10% range
        const inZone = Math.abs(position - secretPosition) <= tolerance;

        if (inZone && !isInSecretZone && isDragging) {
            // Entered secret zone - start timer!
            setIsInSecretZone(true);
            triggerHaptic([200, 100, 200]);

            // Only create timer if one doesn't exist
            if (!secretZoneTimer.current) {
                secretZoneTimer.current = setTimeout(() => {
                    setHasUnlocked(true);
                    setShowUnlockModal(true);
                    triggerHaptic([100, 50, 100, 50, 100]);

                    if (transformationId) {
                        localStorage.setItem(`secret_${transformationId}`, 'true');
                    }
                    secretZoneTimer.current = null;
                }, 1500);
            }
        } else if (!inZone && isInSecretZone) {
            // Left secret zone - cancel timer
            setIsInSecretZone(false);
            if (secretZoneTimer.current) {
                clearTimeout(secretZoneTimer.current);
                secretZoneTimer.current = null;
            }
        } else if (!isDragging && isInSecretZone) {
            // Stopped dragging while in zone - cancel timer
            setIsInSecretZone(false);
            if (secretZoneTimer.current) {
                clearTimeout(secretZoneTimer.current);
                secretZoneTimer.current = null;
            }
        }
        // NOTE: No cleanup return - timer should persist across position changes
    }, [position, secretPosition, isInSecretZone, hasUnlocked, isDragging, transformationId, secretImage, triggerHaptic]);

    // Cleanup timer only on unmount
    useEffect(() => {
        return () => {
            if (secretZoneTimer.current) {
                clearTimeout(secretZoneTimer.current);
                secretZoneTimer.current = null;
            }
        };
    }, []);

    // Check localStorage for already unlocked secrets on mount
    useEffect(() => {
        if (transformationId && secretImage) {
            const unlocked = localStorage.getItem(`secret_${transformationId}`) === 'true';
            if (unlocked) {
                setHasUnlocked(true);
            }
        }
    }, [transformationId, secretImage]);


    // --- UNIFIED POINTER EVENTS with direction detection ---
    const handlePointerDown = (e: React.PointerEvent) => {
        isDraggingRef.current = false;
        directionDecidedRef.current = false;
        isHorizontalRef.current = false;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;

        // Tap-Streak: Increment on each tap
        currentStreak.current += 1;
        setTapStreak(currentStreak.current);
        setShowStreakIndicator(true);

        // Reset tap timer (800ms)
        if (tapStreakTimer.current) {
            clearTimeout(tapStreakTimer.current);
        }

        tapStreakTimer.current = setTimeout(async () => {
            // Streak ended - record it
            const finalStreak = currentStreak.current;

            if (finalStreak > 0 && transformationId) {
                // Get current user from Supabase auth
                const { createSupabaseBrowserClient } = await import('@/lib/supabase-browser');
                const supabase = createSupabaseBrowserClient();

                if (!supabase) return; // Skip if not available

                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Import and call recordTapStreak
                    const { recordTapStreak } = await import('@/lib/tapStreak');
                    const result = await recordTapStreak(transformationId, user.id, finalStreak);

                    if (result.success && result.newRecord) {
                        // New record! Show celebration
                        setPersonalBest(true);
                        triggerHaptic([100, 50, 100, 50, 100]);
                        setTimeout(() => setPersonalBest(false), 2000);
                    }
                }
            }

            // Reset streak
            currentStreak.current = 0;
            setTapStreak(0);
            setTimeout(() => setShowStreakIndicator(false), 300);
        }, 800);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const deltaX = Math.abs(e.clientX - startXRef.current);
        const deltaY = Math.abs(e.clientY - startYRef.current);

        // Decide direction after 10px of movement
        if (!directionDecidedRef.current && (deltaX > 10 || deltaY > 10)) {
            directionDecidedRef.current = true;
            if (deltaX > deltaY) {
                // Horizontal = slider control
                isHorizontalRef.current = true;
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                triggerSparkle();
            }
            // If vertical, do nothing - let browser scroll
        }

        // Only update slider if horizontal drag
        if (isHorizontalRef.current && isDragging) {
            isDraggingRef.current = true;
            updatePosition(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isHorizontalRef.current) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);

        // If no direction decided (quick tap), process as potential double-tap
        if (!directionDecidedRef.current) {
            handleDoubleTap();
        }

        // Reset refs
        directionDecidedRef.current = false;
        isHorizontalRef.current = false;
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
        triggerHaptic([10, 50, 10]);
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

            {/* Slider Container - touch-pan-y allows vertical scroll, captures horizontal */}
            <motion.div
                ref={containerRef}
                className={`relative w-full max-w-2xl mx-auto select-none bg-gray-900 cursor-ew-resize overflow-hidden z-10 touch-pan-y ${isInSecretZone ? 'animate-shake' : ''
                    }`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                animate={{
                    scale: isDragging ? 1.02 : 1
                }}
                transition={{ duration: 0.2 }}
            >
                {/* Background Image (Real) */}
                <motion.img
                    src={realImage}
                    alt={`${characterName} - Real`}
                    className="relative block w-full h-auto object-cover pointer-events-none"
                    draggable={false}
                    animate={{
                        filter: isInSecretZone
                            ? 'saturate(1.2) invert(1) hue-rotate(180deg)'
                            : (isDragging ? 'saturate(1.2)' : 'saturate(1)')
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
                        className={`w-full h-full object-cover ${isInSecretZone ? 'animate-shake' : ''}`}
                        draggable={false}
                        animate={{
                            filter: isInSecretZone
                                ? 'saturate(1.2) invert(1) hue-rotate(180deg)'
                                : (isDragging ? 'saturate(1.2)' : 'saturate(1)')
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                {/* Heart Burst (Double-tap) */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: showHeartBurst ? 1 : 0,
                        scale: showHeartBurst ? 1.5 : 0.5,
                        rotate: showHeartBurst ? [-12, 12, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Heart size={80} className="fill-red-500 text-red-500 drop-shadow-lg" />
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
                    className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 text-xs font-bold uppercase pointer-events-none z-10"
                    animate={{ x: isDragging ? -5 : 0 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        ANIME
                    </span>
                </motion.div>

                <motion.div
                    className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 text-xs font-bold uppercase pointer-events-none z-10"
                    animate={{ x: isDragging ? 5 : 0 }}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
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
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 text-xs font-bold uppercase pointer-events-none md:hidden z-10"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                >
                    ↔ {dict?.transformation?.slide || 'SLIDE & TAP ❤️'}
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
                    className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 p-4 bg-gradient-to-t from-black/60 to-transparent z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {onLike && (
                        <motion.button
                            onClick={handleLike}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Heart size={20} className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800 dark:text-white'}`} />
                        </motion.button>
                    )}
                    {onShare && (
                        <motion.button
                            onClick={onShare}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 size={20} className="text-gray-800 dark:text-white" />
                        </motion.button>
                    )}
                    {onDownload && (
                        <motion.button
                            onClick={onDownload}
                            className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download size={20} className="text-gray-800 dark:text-white" />
                        </motion.button>
                    )}
                </motion.div>

                {/* Tap-Streak Counter Overlay */}
                {showStreakIndicator && tapStreak > 0 && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute top-4 right-4 z-40 pointer-events-none"
                    >
                        <div className={`px-4 py-2 rounded-full font-black text-lg backdrop-blur-md border-2 ${personalBest
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400 animate-pulse'
                            : 'bg-black/80 border-purple-500'
                            }`}>
                            <span className="text-white flex items-center gap-2">
                                {personalBest && '🔥'} {tapStreak} TAP{tapStreak !== 1 ? 'S' : ''}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Tech Overlays */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[8px] font-mono text-white/50 bg-black/20 px-2 py-0.5 rounded-full pointer-events-none border border-white/5">
                    <span>AR-X ENHANCED</span>
                    <span>•</span>
                    <span>v2.6.0</span>
                </div>
            </motion.div>

            {/* Secret Unlock Modal */}
            {secretImage && (
                <SecretUnlockModal
                    isOpen={showUnlockModal}
                    onClose={() => setShowUnlockModal(false)}
                    secretImage={secretImage}
                    characterName={characterName}
                />
            )}
        </div>
    );
}

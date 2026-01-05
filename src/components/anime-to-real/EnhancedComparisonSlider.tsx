'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Share2, Heart, Sparkles, ZoomIn, ZoomOut, Maximize2, Minimize2, Flame, Gem, Zap } from 'lucide-react';
import SecretUnlockModal from '../SecretUnlockModal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { recordInteraction, InteractionType } from '@/lib/gamification-db';

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
    secretImage?: string;
    secretPosition?: number;
    poi?: Array<{ label: string; x: number; y: number; scale: number }>; // [NEW] Points of Interest
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
    secretPosition,
    poi // [NEW]
}: EnhancedComparisonSliderProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const [isDragging, setIsDragging] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false); // [NEW] Fullscreen State
    const [userReactions, setUserReactions] = useState<string[]>([]); // [NEW] Track active reactions
    const [showSparkle, setShowSparkle] = useState(false);
    const [showFunFact, setShowFunFact] = useState(false);
    const [showHeartBurst, setShowHeartBurst] = useState(false);
    const [hasReachedEdge, setHasReachedEdge] = useState({ left: false, right: false });
    const [hasRevealedMystery, setHasRevealedMystery] = useState(false); // Mystery Veil state
    const containerRef = useRef<HTMLDivElement>(null);
    const lastHapticPosition = useRef<number | null>(null);

    // ... (state declarations)

    // Helper to zoom to POI
    const handleZoomToPOI = useCallback((p: { x: number; y: number; scale: number }, setTransform: any) => {
        if (!containerRef.current) return;
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;

        // Convert percentage to pixels (inverted for setTransform usually needs negative? No, setTransform(x,y,scale))
        // setTransform(x, y, scale)
        // Calculating center:
        // desired center is (p.x% * width, p.y% * height)
        // With scale S, the view needs to shift so that point is center.
        // This math is tricky. 
        // Simplification: React-Zoom-Pan-Pinch `zoomToElement` might be easier if I had elements.
        // Manual calculation using setTransform:

        const targetX = (p.x / 100) * width;
        const targetY = (p.y / 100) * height;

        // Center logic:
        // NewX = (ContainerWidth / 2) - (TargetX * Scale)
        // NewY = (ContainerHeight / 2) - (TargetY * Scale)

        const newX = (width / 2) - (targetX * p.scale);
        const newY = (height / 2) - (targetY * p.scale);

        setTransform(newX, newY, p.scale, 500, "easeOut");
        setIsZoomed(true);
    }, []);


    // DISABLED: Secret Detection State (feature not working, kept for future)
    const [isInSecretZone] = useState(false);
    const [hasUnlocked] = useState(false); // Always false - disabled
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const secretZoneTimer = useRef<NodeJS.Timeout | null>(null);

    // DISABLED: Tap-Streak
    const [tapStreak] = useState(0);
    const [showStreakIndicator] = useState(false);
    const [personalBest] = useState(false);

    // Double-tap refs
    const lastTapRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);
    const directionDecidedRef = useRef<boolean>(false);
    const isHorizontalRef = useRef<boolean>(false);

    // Spring animation
    const springPosition = useSpring(position, {
        stiffness: 300,
        damping: 30,
        mass: 0.5
    });

    const glowIntensity = useSpring(isDragging ? 1 : 0, {
        stiffness: 200,
        damping: 20
    });

    // Clip path for anime image overlay - MUST be at top level, not in JSX
    const clipPath = useTransform(springPosition, v => `inset(0 ${100 - v}% 0 0)`);

    // Animation Transfers (Must be at top level to avoid hook violations)
    // 1. Slider Line Position
    const sliderLeftPos = useTransform(springPosition, v => `${v}%`);

    // 2. Handle Glow Effect
    const handleGlow = useTransform(glowIntensity, v =>
        `0 0 ${20 * v}px ${8 * v}px rgba(255,255,255,${0.5 * v}), 0 0 ${40 * v}px ${16 * v}px rgba(168,85,247,${0.3 * v})`
    );

    // 3. Progress Bar Width
    const progressBarWidth = useTransform(springPosition, v => `${v}%`);

    // 4. Mystery Veil - blur ON initially, OFF once user starts dragging
    // Simple binary: starts blurred, clears on first interaction for better comparison

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current || isZoomed) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
    }, [isZoomed]);

    const triggerSparkle = useCallback(() => {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 600);
    }, []);

    const triggerHaptic = useCallback((intensity: number[] = [10]) => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(intensity);
        }
    }, []);

    // Check for mystery reveal celebration when user first starts dragging
    useEffect(() => {
        if (isDragging && !hasRevealedMystery) {
            setHasRevealedMystery(true);
            triggerSparkle();
            triggerHaptic([20]);
        }
    }, [isDragging, hasRevealedMystery, triggerHaptic, triggerSparkle]);

    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY && !isZoomed) {
            // Trigger like only if not zoomed (to prevent conflict)
            if (!isLiked) {
                setIsLiked(true);
                onLike?.();
            }
            setShowHeartBurst(true);
            triggerHaptic([50]);
            setTimeout(() => setShowHeartBurst(false), 800);
        }
        lastTapRef.current = now;
    }, [isLiked, onLike, triggerHaptic, isZoomed]);

    // Handle Esc key to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // Reset zoom when toggling to avoid layout jumps
        if (isZoomed) setIsZoomed(false);
    };

    // Check edges
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

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isZoomed) return;

        isDraggingRef.current = false;
        directionDecidedRef.current = false;
        isHorizontalRef.current = false;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isZoomed) return;

        const deltaX = Math.abs(e.clientX - startXRef.current);
        const deltaY = Math.abs(e.clientY - startYRef.current);

        if (!directionDecidedRef.current && (deltaX > 10 || deltaY > 10)) {
            directionDecidedRef.current = true;
            if (deltaX > deltaY) {
                isHorizontalRef.current = true;
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                triggerSparkle();
            }
        }

        if (isHorizontalRef.current && isDragging) {
            isDraggingRef.current = true;
            updatePosition(e.clientX);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isZoomed) return;

        if (isHorizontalRef.current) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);

        if (!directionDecidedRef.current) {
            handleDoubleTap();
        }

        directionDecidedRef.current = false;
        isHorizontalRef.current = false;
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
        triggerHaptic([10, 50, 10]);
        // Also record in gamification DB if ID exists
        if (transformationId && !isLiked) {
            recordInteraction(transformationId, 'like');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && transformationId) {
            const savedReactions = JSON.parse(localStorage.getItem(`reactions_${transformationId}`) || '[]');
            setUserReactions(savedReactions);
        }
    }, [transformationId]);

    const handleReaction = (type: InteractionType) => {
        if (!transformationId) return;

        triggerHaptic([20, 20, 20]);
        triggerSparkle();

        // Single Selection Logic: 
        // If clicking the same one, toggle it off? Or just keep it? 
        // User said "select only one". Usually means specific selection.
        // Let's toggle off if same, switch if different.

        let newReactions: string[] = [];

        if (userReactions.includes(type)) {
            // Toggle off
            newReactions = [];
        } else {
            // Switch to new one (replace entire array)
            newReactions = [type];
            // Only record to DB if adding (toggle off doesn't need DB delete for now, or maybe it should? 
            // DB is append-only log, so we just log the new interaction. Toggling off is purely local UI for now)
            recordInteraction(transformationId, type);
        }

        setUserReactions(newReactions);
        localStorage.setItem(`reactions_${transformationId}`, JSON.stringify(newReactions));
    };

    useEffect(() => {
        springPosition.set(position);
    }, [position, springPosition]);

    return (
        <div
            className={`relative rounded-xl overflow-hidden shadow-2xl bg-black group transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] h-screen w-screen rounded-none' : ''
                }`}
        >
            {/* Zoom Wrapper */}
            <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
                doubleClick={{ disabled: true }}
                panning={{ disabled: !isZoomed }}
                onTransformed={(ref: any) => {
                    // Safe access to scale
                    const scale = ref?.state?.scale ?? 1;
                    if (scale > 1.01) {
                        if (!isZoomed) setIsZoomed(true);
                    } else {
                        if (isZoomed) setIsZoomed(false);
                    }
                }}
            >
                {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
                    <>
                        {/* Controls Overlay */}
                        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => zoomIn()}
                                className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20"
                                aria-label="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20"
                                aria-label="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>

                            {/* Fullscreen Toggle */}
                            <button
                                onClick={toggleFullscreen}
                                className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-white/20"
                                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            >
                                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                            </button>

                            {isZoomed && (
                                <button
                                    onClick={() => resetTransform()}
                                    className="bg-accent text-white p-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300"
                                    aria-label="Reset Zoom"
                                >
                                    <Minimize2 size={20} />
                                </button>
                            )}
                        </div>

                        {/* POI Buttons - Detail Toggles */}
                        {poi && poi.length > 0 && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-auto transition-opacity duration-300" style={{ opacity: isZoomed ? 0 : 1 }}>
                                {poi.map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => handleZoomToPOI(p, setTransform)}
                                        className="bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 backdrop-blur-md uppercase tracking-wider flex items-center gap-1 shadow-lg"
                                    >
                                        <Maximize2 size={10} />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full relative">
                            <div className="relative w-full h-full">
                                <motion.div
                                    ref={containerRef}
                                    className={`relative w-full max-w-2xl mx-auto select-none bg-gray-900 cursor-ew-resize overflow-hidden z-10 touch-pan-y ${isInSecretZone && !hasUnlocked ? 'animate-shake' : ''}`}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerLeave={handlePointerUp}
                                    style={{ touchAction: isZoomed ? 'none' : 'pan-y' }}
                                    animate={{
                                        scale: isDragging ? 1.02 : 1
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Background Image (Real) - with Mystery Veil blur */}
                                    <motion.img
                                        src={realImage}
                                        alt={`${characterName} - Real`}
                                        className="relative block w-full h-auto object-cover pointer-events-none"
                                        draggable={false}
                                        initial={{ filter: 'blur(8px)' }}
                                        animate={{
                                            filter: (isInSecretZone && !hasUnlocked)
                                                ? 'saturate(1.2) invert(1) hue-rotate(180deg)'
                                                : hasRevealedMystery ? 'blur(0px)' : 'blur(8px)'
                                        }}
                                        transition={{ duration: 0.4 }}
                                    />

                                    {/* Foreground Image (Anime) - Clipped */}
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ clipPath }}
                                    >
                                        <motion.img
                                            src={animeImage}
                                            alt={`${characterName} - Anime`}
                                            className={`w-full h-full object-cover ${isInSecretZone && !hasUnlocked ? 'animate-shake' : ''}`}
                                            draggable={false}
                                            animate={{
                                                filter: (isInSecretZone && !hasUnlocked)
                                                    ? 'saturate(1.2) invert(1) hue-rotate(180deg)'
                                                    : (isDragging ? 'saturate(1.2)' : 'saturate(1)')
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>

                                    {/* Heart Burst */}
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

                                    {/* Slider Line & Handle - Hidden when Zoomed */}
                                    {!isZoomed && (
                                        <motion.div
                                            className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-20"
                                            style={{ left: sliderLeftPos, x: '-50%' }}
                                        >
                                            <motion.div
                                                className="absolute inset-y-0 w-1 bg-white"
                                                style={{
                                                    boxShadow: handleGlow
                                                }}
                                            />
                                            <motion.div
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                                animate={{
                                                    scale: isDragging ? 1.2 : 1,
                                                }}
                                                transition={{ type: 'spring', stiffness: 400 }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 w-16 h-16 -m-2 rounded-full bg-white/20"
                                                    animate={{
                                                        scale: isDragging ? [1, 1.5, 1] : 1,
                                                        opacity: isDragging ? [0.5, 0, 0.5] : 0
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                />
                                                <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-purple-500/50">
                                                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}

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
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

            {/* Labels - Only visible when NOT zoomed */}
            {!isZoomed && (
                <>
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
                        className="absolute top-4 right-16 bg-black/70 text-white px-3 py-1.5 text-xs font-bold uppercase pointer-events-none z-10"
                        animate={{ x: isDragging ? 5 : 0 }}
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            REAL
                        </span>
                    </motion.div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                                style={{ width: progressBarWidth }}
                            />
                        </div>
                    </div>

                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 text-xs font-bold uppercase pointer-events-none md:hidden z-10"
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                    >
                        ↔ {dict?.transformation?.slide || 'SLIDE & TAP ❤️'}
                    </motion.div>
                </>
            )}

            {/* Action Buttons */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 p-4 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex gap-3 pointer-events-auto">
                    {onLike && (
                        <div className="flex gap-2">
                            <motion.button
                                onClick={handleLike}
                                className="p-3 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Heart size={20} className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800 dark:text-white'}`} />
                            </motion.button>

                            {/* New Reactions */}
                            <motion.button
                                onClick={() => handleReaction('fire')}
                                className={`p-3 rounded-full shadow-lg transition-colors ${userReactions.includes('fire') ? 'bg-orange-500 text-white' : 'bg-white/90 dark:bg-gray-900/90 text-orange-500 hover:bg-orange-50'}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Fire Reaction"
                            >
                                <Flame size={20} className={userReactions.includes('fire') ? 'fill-white' : ''} />
                            </motion.button>
                            <motion.button
                                onClick={() => handleReaction('mindblown')}
                                className={`p-3 rounded-full shadow-lg transition-colors ${userReactions.includes('mindblown') ? 'bg-yellow-500 text-white' : 'bg-white/90 dark:bg-gray-900/90 text-yellow-500 hover:bg-yellow-50'}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Mindblown Reaction"
                            >
                                <Zap size={20} className={userReactions.includes('mindblown') ? 'fill-white' : ''} />
                            </motion.button>
                            <motion.button
                                onClick={() => handleReaction('diamond')}
                                className={`p-3 rounded-full shadow-lg transition-colors ${userReactions.includes('diamond') ? 'bg-blue-500 text-white' : 'bg-white/90 dark:bg-gray-900/90 text-blue-400 hover:bg-blue-50'}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Diamond Reaction"
                            >
                                <Gem size={20} className={userReactions.includes('diamond') ? 'fill-white' : ''} />
                            </motion.button>
                        </div>
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
                </div>
            </motion.div>

            {/* Fun Fact Reveal */}
            {showFunFact && funFact && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 max-w-xs pointer-events-auto"
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

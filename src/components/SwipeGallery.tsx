'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TransformationExtended } from '@/types/transformations';
import { likeTransformationAction } from '@/app/admin/actions/transformations';
import EnhancedComparisonSlider from './anime-to-real/EnhancedComparisonSlider';

interface SwipeGalleryProps {
    transformations: TransformationExtended[];
    initialIndex?: number;
    lang: 'en' | 'es';
    onClose: () => void;
}

export default function SwipeGallery({
    transformations,
    initialIndex = 0,
    lang,
    onClose
}: SwipeGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLiking, setIsLiking] = useState(false);
    const [likedIds, setLikedIds] = useState<string[]>([]);
    const [showHint, setShowHint] = useState(true);

    // Gesture detection state
    const touchStartRef = useRef({ x: 0, y: 0 });
    const gestureDecidedRef = useRef(false);
    const isVerticalGestureRef = useRef(false);
    const accumulatedDeltaRef = useRef(0);

    const current = transformations[currentIndex];

    // Load liked items from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('likedTransformations');
        if (stored) {
            setLikedIds(JSON.parse(stored));
        }
    }, []);

    // Hide hint after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Prevent body scroll when gallery is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const goNext = useCallback(() => {
        if (currentIndex < transformations.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowHint(false);
        }
    }, [currentIndex, transformations.length]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setShowHint(false);
        }
    }, [currentIndex]);

    // Improved touch handlers with gesture direction detection
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        gestureDecidedRef.current = false;
        isVerticalGestureRef.current = false;
        accumulatedDeltaRef.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const deltaX = e.touches[0].clientX - touchStartRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;

        // Decide gesture direction after 15px of movement
        if (!gestureDecidedRef.current && (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15)) {
            gestureDecidedRef.current = true;

            // If vertical movement is greater, it's a navigation gesture
            if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
                isVerticalGestureRef.current = true;
            }
            // Otherwise, it's horizontal (slider control) - let the slider handle it
        }

        // Track vertical movement for navigation
        if (isVerticalGestureRef.current) {
            accumulatedDeltaRef.current = deltaY;
        }
    };

    const handleTouchEnd = () => {
        // Only navigate if it was a vertical gesture with enough movement
        if (isVerticalGestureRef.current) {
            const threshold = 60;

            if (accumulatedDeltaRef.current < -threshold) {
                goNext(); // Swipe up = next
            } else if (accumulatedDeltaRef.current > threshold) {
                goPrev(); // Swipe down = prev
            }
        }

        // Reset refs
        gestureDecidedRef.current = false;
        isVerticalGestureRef.current = false;
        accumulatedDeltaRef.current = 0;
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'j') goNext();
            if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goNext, goPrev, onClose]);

    // Like handler
    const handleLike = async () => {
        if (isLiking || likedIds.includes(current.id)) return;

        setIsLiking(true);
        try {
            await likeTransformationAction(current.id);
            const newLiked = [...likedIds, current.id];
            setLikedIds(newLiked);
            localStorage.setItem('likedTransformations', JSON.stringify(newLiked));
        } catch (error) {
            console.error('Like failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    // Share handler
    const handleShare = async () => {
        const url = `${window.location.origin}/${lang}/anime-to-real/${current.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: current.characterName,
                    text: `Check out this Anime to Real transformation of ${current.characterName}!`,
                    url
                });
            } catch { }
        } else {
            await navigator.clipboard.writeText(url);
            alert(lang === 'es' ? 'Link copiado!' : 'Link copied!');
        }
    };

    const isLiked = likedIds.includes(current.id);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header - No counter, simulates infinite scroll */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-50">
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Progress dots instead of numbers - subtle indicator without showing total */}
                <div className="flex gap-1">
                    {[...Array(Math.min(5, transformations.length))].map((_, i) => {
                        const relativeIndex = currentIndex - Math.floor(currentIndex / 5) * 5;
                        return (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === relativeIndex % 5
                                        ? 'bg-white scale-125'
                                        : 'bg-white/30'
                                    }`}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex-1 flex flex-col justify-center px-4 pt-16 pb-8"
                >
                    {/* Character Info */}
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-black text-white uppercase">
                            {current.characterName}
                        </h2>
                        {current.series && (
                            <p className="text-white/60 font-mono text-sm">
                                {current.series}
                            </p>
                        )}
                    </div>

                    {/* Slider - touch-auto to allow horizontal gestures */}
                    <div className="flex-1 flex items-center justify-center max-h-[60vh] touch-auto">
                        <div className="w-full max-w-md">
                            <EnhancedComparisonSlider
                                animeImage={current.animeImage}
                                realImage={current.realImage}
                                characterName={current.characterName}
                                isLiked={isLiked}
                                onLike={handleLike}
                                onShare={handleShare}
                                transformationId={current.id}
                            />
                        </div>
                    </div>

                    {/* Detail Link */}
                    <div className="text-center mt-4">
                        <Link
                            href={`/${lang}/anime-to-real/${current.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block px-6 py-2 bg-white text-black font-bold text-sm uppercase hover:bg-gray-200 transition-colors"
                        >
                            {lang === 'es' ? 'Ver detalle' : 'View detail'}
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Hints */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 bottom-8 flex flex-col items-center z-40 pointer-events-none"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex flex-col items-center text-white/70 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
                        >
                            <div className="flex items-center gap-2">
                                <ChevronUp size={18} />
                                <span className="text-xs font-mono">
                                    {lang === 'es' ? 'Desliza' : 'Swipe'}
                                </span>
                                <ChevronDown size={18} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-40">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                    <ChevronUp size={28} />
                </button>
                <button
                    onClick={goNext}
                    disabled={currentIndex === transformations.length - 1}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                    <ChevronDown size={28} />
                </button>
            </div>
        </motion.div>
    );
}

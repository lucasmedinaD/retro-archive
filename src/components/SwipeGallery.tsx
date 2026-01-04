'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Heart, Share2, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TransformationExtended } from '@/types/transformations';
import { likeTransformationAction } from '@/app/admin/actions/transformations';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

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
        }
    }, [currentIndex, transformations.length]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const diff = touchStartY.current - touchEndY.current;
        const threshold = 50;

        if (diff > threshold) {
            goNext();
        } else if (diff < -threshold) {
            goPrev();
        }
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
            className="fixed inset-0 z-[100] bg-black"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white"
            >
                <X size={24} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 right-4 z-50 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-mono">
                {currentIndex + 1} / {transformations.length}
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full flex flex-col"
                >
                    {/* Image Container - Split View */}
                    <div className="flex-1 relative">
                        {/* Anime Image - Top Half */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
                            <Image
                                src={current.animeImage}
                                alt={`${current.characterName} Anime`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                            <span className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase">
                                ANIME
                            </span>
                        </div>

                        {/* Real Image - Bottom Half */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
                            <Image
                                src={current.realImage}
                                alt={`${current.characterName} Real`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                            <span className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs font-bold uppercase">
                                REAL
                            </span>
                        </div>

                        {/* Divider Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white z-10 transform -translate-y-1/2 shadow-lg" />

                        {/* Character Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <h2 className="text-3xl font-black text-white uppercase drop-shadow-lg">
                                {current.characterName}
                            </h2>
                            {current.series && (
                                <p className="text-white/80 font-mono text-sm mt-1">
                                    {current.series}
                                </p>
                            )}
                            <Link
                                href={`/${lang}/anime-to-real/${current.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block mt-3 px-4 py-2 bg-white text-black font-bold text-xs uppercase"
                            >
                                {lang === 'es' ? 'Ver detalle' : 'View detail'}
                            </Link>
                        </div>

                        {/* Side Actions */}
                        <div className="absolute right-4 bottom-32 z-30 flex flex-col gap-4">
                            <button
                                onClick={handleLike}
                                disabled={isLiking}
                                className="flex flex-col items-center"
                            >
                                <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50 backdrop-blur-sm'}`}>
                                    <Heart
                                        size={28}
                                        className={isLiked ? 'text-white fill-white' : 'text-white'}
                                    />
                                </div>
                                <span className="text-white text-xs mt-1 font-bold">
                                    {(current.likes || 0) + (isLiked && !likedIds.includes(current.id) ? 1 : 0)}
                                </span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center"
                            >
                                <div className="p-3 rounded-full bg-black/50 backdrop-blur-sm">
                                    <Share2 size={28} className="text-white" />
                                </div>
                                <span className="text-white text-xs mt-1 font-bold">
                                    {lang === 'es' ? 'Compartir' : 'Share'}
                                </span>
                            </button>
                        </div>
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
                        className="absolute inset-x-0 bottom-8 flex flex-col items-center z-40"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="flex flex-col items-center text-white/60"
                        >
                            <ChevronUp size={24} />
                            <span className="text-xs font-mono">
                                {lang === 'es' ? 'Desliza para navegar' : 'Swipe to navigate'}
                            </span>
                            <ChevronDown size={24} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex absolute inset-y-0 left-4 items-center z-40">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                    <ChevronUp size={32} />
                </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-20 items-center z-40">
                <button
                    onClick={goNext}
                    disabled={currentIndex === transformations.length - 1}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                    <ChevronDown size={32} />
                </button>
            </div>
        </motion.div>
    );
}

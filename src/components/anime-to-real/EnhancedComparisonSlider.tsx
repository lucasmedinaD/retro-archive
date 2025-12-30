'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
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
    const [showActions, setShowActions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInteractingRef = useRef(false);

    // Single unified handler for all input types
    const handleInteractionStart = (clientX: number) => {
        isInteractingRef.current = true;
        updatePosition(clientX);
    };

    const handleInteractionMove = (clientX: number) => {
        if (!isInteractingRef.current) return;
        updatePosition(clientX);
    };

    const handleInteractionEnd = () => {
        isInteractingRef.current = false;
    };

    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    return (
        <div
            className="relative rounded-lg overflow-hidden"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            onTouchStart={() => setShowActions(true)}
        >
            {/* Slider Container - SIMPLIFIED */}
            <div
                ref={containerRef}
                className="relative aspect-[4/5] select-none bg-gray-100 dark:bg-gray-900 cursor-grab active:cursor-grabbing"
                onMouseDown={(e) => handleInteractionStart(e.clientX)}
                onMouseMove={(e) => handleInteractionMove(e.clientX)}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                        handleInteractionStart(e.touches[0].clientX);
                    }
                }}
                onTouchMove={(e) => {
                    if (e.touches.length > 0) {
                        handleInteractionMove(e.touches[0].clientX);
                    }
                }}
                onTouchEnd={handleInteractionEnd}
            >
                {/* Background Image (Real) */}
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={realImage}
                        alt={`${characterName} - Real`}
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
                        alt={`${characterName} - Anime`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Slider Line & Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 pointer-events-none"
                    style={{ left: `${position}%` }}
                >
                    {/* SUPER SIMPLE HANDLE - Just a circle */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-16 md:h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-200"
                    >
                        <svg
                            className="w-10 h-10 md:w-8 md:h-8 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l4-4 4 4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 15l4 4 4-4" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1.5 text-[10px] font-bold uppercase pointer-events-none rounded">
                    ANIME
                </div>

                <div className="absolute top-3 right-3 bg-black/90 text-white px-3 py-1.5 text-[10px] font-bold uppercase pointer-events-none rounded">
                    REAL
                </div>

                {/* Mobile Instruction */}
                <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase pointer-events-none md:hidden"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 3, duration: 0.5 }}
                >
                    👆 Toca cualquier parte
                </motion.div>
            </div>

            {/* Action Buttons - Below image on mobile */}
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
                        <Heart
                            size={20}
                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                        />
                    </button>
                )}

                {onShare && (
                    <button
                        onClick={onShare}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700"
                        aria-label="Share"
                    >
                        <Share2 size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                )}

                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700"
                        aria-label="Download"
                    >
                        <Download size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                )}
            </motion.div>
        </div>
    );
}

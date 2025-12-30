'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosition(parseFloat(e.target.value));
    };

    return (
        <div
            className="relative rounded-lg overflow-hidden"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            onTouchStart={() => setShowActions(true)}
        >
            {/* Slider Container */}
            <div className="relative aspect-[4/5] select-none bg-gray-100 dark:bg-gray-900">

                {/* 1. Background Image (Real) */}
                <img
                    src={realImage}
                    alt={`${characterName} - Real`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />

                {/* 2. Foreground Image (Anime) - Clipped */}
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

                {/* 3. Slider Line Visualization */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-10"
                    style={{ left: `${position}%` }}
                >
                    {/* Visual Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-100">
                        <svg className="w-8 h-8 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l4-4 4 4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 15l4 4 4-4" />
                        </svg>
                    </div>
                </div>

                {/* 4. Native Range Input (Top Layer) - THE MAGIC FIX */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={position}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0 p-0 appearance-none touch-none"
                    style={{ touchAction: 'pan-y' }} // Allow vertical scroll, handle horizontal slide
                    aria-label={`Compare ${characterName}`}
                />

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
                    ↔ Desliza para comparar
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="mt-4 flex justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {/* Like Button */}
                {onLike && (
                    <button
                        onClick={onLike}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700 z-30 relative"
                        aria-label={isLiked ? "Unlike" : "Like"}
                    >
                        <Heart size={20} className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                    </button>
                )}
                {/* Share Button */}
                {onShare && (
                    <button onClick={onShare} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700 z-30 relative"><Share2 size={20} className="text-gray-700 dark:text-gray-300" /></button>
                )}
                {/* Download Button */}
                {onDownload && (
                    <button onClick={onDownload} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-gray-200 dark:border-gray-700 z-30 relative"><Download size={20} className="text-gray-700 dark:text-gray-300" /></button>
                )}
            </motion.div>
        </div>
    );
}

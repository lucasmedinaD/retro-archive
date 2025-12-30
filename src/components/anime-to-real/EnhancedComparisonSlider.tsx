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
    const [isDragging, setIsDragging] = useState(false);
    const [isLiked, setIsLiked] = useState(externalIsLiked);
    const [showActions, setShowActions] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPosition(percentage);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
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
        >
            {/* Slider Container */}
            <div
                className="relative aspect-[4/5] select-none touch-none cursor-ew-resize"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={(e) => {
                    if (isDragging) {
                        setIsDragging(false);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                }}
                style={{ willChange: 'transform' }}
            >
                {/* Background Image (Real) */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900">
                    <img
                        src={realImage}
                        alt={`${characterName} - Real Version`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Foreground Image (Anime) - Clipped */}
                <motion.div
                    className="absolute inset-0 bg-gray-100 dark:bg-gray-900"
                    style={{
                        clipPath: `inset(0 ${100 - position}% 0 0)`,
                        willChange: 'clip-path'
                    }}
                >
                    <img
                        src={animeImage}
                        alt={`${characterName} - Anime Version`}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                </motion.div>

                {/* Slider Divider Line */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"
                    style={{ left: `${position}%` }}
                >
                    {/* Slider Handle */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-white rounded-full shadow-lg flex items-center justify-center"
                        animate={{
                            scale: isDragging ? 1.15 : 1,
                            boxShadow: isDragging
                                ? '0 0 0 8px rgba(255,255,255,0.2), 0 8px 16px rgba(0,0,0,0.2)'
                                : '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Drag Icon */}
                        <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19l7-7-7-7" />
                        </svg>
                    </motion.div>
                </div>

                {/* Labels */}
                <motion.div
                    className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 text-xs font-mono rounded uppercase font-bold"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Anime
                    </span>
                </motion.div>

                <motion.div
                    className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 text-xs font-mono rounded uppercase font-bold"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Real
                    </span>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: showActions || isDragging ? 1 : 0,
                    y: showActions || isDragging ? 0 : 10
                }}
                transition={{ duration: 0.2 }}
            >
                {onLike && (
                    <motion.button
                        onClick={handleLike}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-red-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label={isLiked ? "Unlike" : "Like"}
                    >
                        <Heart
                            size={20}
                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                        />
                    </motion.button>
                )}

                {onShare && (
                    <motion.button
                        onClick={onShare}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-blue-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label="Share"
                    >
                        <Share2 size={20} className="text-gray-700 dark:text-gray-300" />
                    </motion.button>
                )}

                {onDownload && (
                    <motion.button
                        onClick={onDownload}
                        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-transparent hover:border-green-500"
                        whileTap={{ scale: 0.9 }}
                        aria-label="Download"
                    >
                        <Download size={20} className="text-gray-700 dark:text-gray-300" />
                    </motion.button>
                )}
            </motion.div>

            {/* Instruction Hint (shows briefly on first load) */}
            <motion.div
                className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-mono pointer-events-none"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -10 }}
                transition={{ delay: 3, duration: 0.5 }}
            >
                ← Drag to compare →
            </motion.div>
        </div>
    );
}

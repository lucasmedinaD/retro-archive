'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useGyroscope } from '@/hooks/useGyroscope';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';

interface LiquidSliderProps {
    animeImage: string;
    realImage: string;
    characterName: string;
}

export default function LiquidSlider({ animeImage, realImage, characterName }: LiquidSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { permission, requestPermission, sliderPosition: gyroPos } = useGyroscope();

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 && 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Motion values for smooth animation
    const sliderX = useMotionValue(50);
    const sliderPosition = useSpring(sliderX, {
        stiffness: 350,
        damping: 32,
        mass: 0.5
    });

    // Update position from mouse/touch
    const updatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        sliderX.set(Math.max(0, Math.min(100, percentage)));
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    };

    // Sync gyroscope when on mobile and not dragging
    useEffect(() => {
        if (isMobile && permission === 'granted' && !isDragging) {
            sliderX.set(gyroPos);
        }
    }, [gyroPos, isMobile, permission, isDragging, sliderX]);

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Mobile Permission Prompt */}
            {isMobile && permission === 'prompt' && (
                <div className="mb-4 border border-black dark:border-white p-4 bg-white dark:bg-black">
                    <div className="flex items-center gap-3">
                        <Smartphone size={20} />
                        <p className="font-mono text-xs flex-1">
                            Activa el giroscopio para una experiencia inmersiva
                        </p>
                        <button
                            onClick={requestPermission}
                            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase hover:bg-transparent hover:text-black dark:hover:text-white border border-black dark:border-white transition-colors"
                        >
                            Activar
                        </button>
                    </div>
                </div>
            )}

            {/* Comparison Container */}
            <div
                ref={containerRef}
                className="relative aspect-[4/5] border-2 border-black dark:border-white overflow-hidden cursor-ew-resize select-none touch-none"
                onPointerDown={() => setIsDragging(true)}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
                onPointerLeave={() => setIsDragging(false)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background: Anime Image */}
                <div className="absolute inset-0">
                    <img
                        src={animeImage}
                        alt={`${characterName} - Anime`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Foreground: Real Image (Clipped) */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        clipPath: useTransform(sliderPosition, (v) => `inset(0 ${100 - v}% 0 0)`)
                    }}
                >
                    <img
                        src={realImage}
                        alt={`${characterName} - Real`}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Labels (visible on hover/drag) */}
                <motion.div
                    className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 border border-black dark:border-white px-3 py-1.5 font-mono text-xs font-bold uppercase pointer-events-none"
                    animate={{ opacity: isHovered || isDragging ? 1 : 0 }}
                >
                    <ChevronLeft className="inline-block mr-1" size={14} />
                    Anime
                </motion.div>

                <motion.div
                    className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 border border-black dark:border-white px-3 py-1.5 font-mono text-xs font-bold uppercase pointer-events-none"
                    animate={{ opacity: isHovered || isDragging ? 1 : 0 }}
                >
                    Real
                    <ChevronRight className="inline-block ml-1" size={14} />
                </motion.div>

                {/* Separator Line & Handle */}
                <motion.div
                    className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
                    style={{ left: useTransform(sliderPosition, (v) => `${v}%`) }}
                >
                    {/* Circular Handle */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center bg-white dark:bg-white"
                        animate={{
                            scale: isDragging ? 1.1 : 1,
                            opacity: isHovered || isDragging ? 1 : 0.8,
                            width: isDragging ? 48 : 40,
                            height: isDragging ? 48 : 40,
                        }}
                        style={{
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 0 0 4px rgba(255,255,255,0.2)'
                        }}
                    >
                        <div className="flex gap-0.5">
                            <div className="w-[2px] h-4 bg-gray-800 rounded-full" />
                            <div className="w-[2px] h-4 bg-gray-800 rounded-full" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Mobile Tilt Indicator */}
                {isMobile && permission === 'granted' && !isDragging && (
                    <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white dark:bg-white/80 dark:text-black px-4 py-2 font-mono text-xs rounded-full pointer-events-none"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Smartphone className="inline-block mr-2" size={12} />
                        Inclina el dispositivo
                    </motion.div>
                )}
            </div>

            {/* Character Name */}
            <div className="mt-4 text-center">
                <h3 className="font-black text-2xl uppercase tracking-tight">{characterName}</h3>
                <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">TRANSFORMACIÓN 2.5D</p>
            </div>
        </div>
    );
}

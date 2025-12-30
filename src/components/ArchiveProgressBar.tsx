'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import { Archive, Eye } from 'lucide-react';

interface ArchiveProgressBarProps {
    totalCount: number;
}

export default function ArchiveProgressBar({ totalCount }: ArchiveProgressBarProps) {
    const { getViewedCount, isLoaded } = useArchiveProgress();
    const viewedCount = getViewedCount();
    const percentage = totalCount > 0 ? (viewedCount / totalCount) * 100 : 0;

    if (!isLoaded) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-black dark:border-white bg-white/95 dark:bg-black/95 backdrop-blur-md"
            >
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="flex items-center gap-2 text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                            <Archive size={14} />
                            <span className="hidden sm:inline">PROGRESO DEL ARCHIVO</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 border border-black dark:border-white overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>

                        {/* Counter */}
                        <div className="flex items-center gap-2 font-mono text-sm font-bold min-w-[80px] justify-end">
                            <Eye size={14} className="text-accent" />
                            <span>{viewedCount}</span>
                            <span className="text-gray-400">/</span>
                            <span>{totalCount}</span>
                        </div>
                    </div>

                    {/* Motivational Text */}
                    {viewedCount > 0 && viewedCount < totalCount && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-1 text-center"
                        >
                            {viewedCount === 1
                                ? "PRIMER ARCHIVO DESCUBIERTO. CONTINÚA EXPLORANDO."
                                : `${totalCount - viewedCount} ARCHIVOS RESTANTES POR DESCUBRIR`
                            }
                        </motion.p>
                    )}

                    {viewedCount >= totalCount && totalCount > 0 && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[10px] font-mono text-accent mt-1 text-center font-bold"
                        >
                            ★ ARCHIVO COMPLETO. COLECCIONISTA CERTIFICADO. ★
                        </motion.p>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

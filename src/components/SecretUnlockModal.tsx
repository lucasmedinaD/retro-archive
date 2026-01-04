'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Sparkles } from 'lucide-react';

interface SecretUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    secretImage: string;
    characterName: string;
}

export default function SecretUnlockModal({
    isOpen,
    onClose,
    secretImage,
    characterName
}: SecretUnlockModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative max-w-2xl w-full bg-gradient-to-br from-yellow-500/20 to-purple-500/20 border-4 border-yellow-500 rounded-2xl p-8 pointer-events-auto"
                            initial={{ scale: 0.5, rotateY: -180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            exit={{ scale: 0.5, rotateY: 180 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X className="text-white" size={24} />
                            </button>

                            {/* Sparkles Animation */}
                            <motion.div
                                className="absolute -top-12 left-1/2 -translate-x-1/2"
                                animate={{
                                    y: [-10, 10, -10],
                                    rotate: [0, 360]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            >
                                <Sparkles className="text-yellow-400" size={48} />
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                className="text-4xl md:text-5xl font-black uppercase text-center mb-4 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                🎉 SECRET UNLOCKED! 🎉
                            </motion.h2>

                            <motion.p
                                className="text-center text-gray-300 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                You found the hidden sweet spot for <strong>{characterName}</strong>!
                            </motion.p>

                            {/* Secret Image */}
                            <motion.div
                                className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-xl overflow-hidden border-4 border-yellow-400 shadow-2xl"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.6, type: 'spring' }}
                            >
                                <Image
                                    src={secretImage}
                                    alt={`Secret - ${characterName}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Confetti Text */}
                            <motion.p
                                className="text-center text-sm text-gray-400 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                ✨ This bonus photo is now saved to your collection forever! ✨
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

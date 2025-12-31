'use client';

import { useState, useRef } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

interface ShareToStoriesProps {
    transformation: {
        characterName: string;
        animeImage: string;
        realImage: string;
        series?: string;
    };
    dict?: any;
}

export default function ShareToStories({ transformation, dict }: ShareToStoriesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const storyRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!storyRef.current) return;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(storyRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                width: 1080,
                height: 1920,
            });

            const link = document.createElement('a');
            link.download = `${transformation.characterName.replace(/\s+/g, '-')}-story.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Failed to generate story image:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-xs uppercase hover:opacity-90 transition-opacity"
            >
                <Smartphone size={16} />
                {dict?.share?.stories || 'Para Stories'}
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#111] p-4 max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-10 text-white/50 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            {/* Story Preview (9:16 aspect ratio) */}
                            <div
                                ref={storyRef}
                                className="relative bg-black"
                                style={{ width: '270px', height: '480px' }}
                            >
                                {/* Anime Image - Top Half */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
                                    <img
                                        src={transformation.animeImage}
                                        alt="Anime"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase">
                                        ANIME
                                    </div>
                                </div>

                                {/* Real Image - Bottom Half */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
                                    <img
                                        src={transformation.realImage}
                                        alt="Real"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute bottom-4 right-4 bg-green-600 text-white px-2 py-1 text-[10px] font-bold uppercase">
                                        REAL
                                    </div>
                                </div>

                                {/* Center Divider */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white z-10 transform -translate-y-1/2" />

                                {/* Character Name - Center */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black px-4 py-2">
                                    <div className="text-white font-black text-lg uppercase tracking-tighter text-center">
                                        {transformation.characterName}
                                    </div>
                                    {transformation.series && (
                                        <div className="text-gray-400 text-[10px] font-mono text-center">
                                            {transformation.series}
                                        </div>
                                    )}
                                </div>

                                {/* Watermark */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 px-2 py-1 z-20">
                                    <img src="/logo.png" alt="" className="w-4 h-4 invert" crossOrigin="anonymous" />
                                    <span className="text-white text-[10px] font-mono">retro-archive.art</span>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                            >
                                <Download size={18} />
                                {isGenerating ? 'Generando...' : (dict?.share?.downloadStory || 'Descargar para Stories')}
                            </button>

                            <p className="text-center text-gray-500 text-[10px] mt-2">
                                1080x1920 • Formato Instagram/TikTok
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

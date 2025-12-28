'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MockupGeneratorProps {
    baseImage: string; // T-shirt base image URL
    designs: { id: string; url: string; name: string }[];
}

export default function MockupGenerator({ baseImage, designs }: MockupGeneratorProps) {
    const [selectedDesign, setSelectedDesign] = useState(designs[0]);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 glass-panel rounded-2xl max-w-5xl mx-auto mt-10">

            {/* Visualizer */}
            <div className="relative w-[400px] h-[500px] bg-black/50 rounded-xl overflow-hidden shadow-2xl border border-white/10 group">

                {/* Base T-Shirt */}
                <Image
                    src={baseImage}
                    alt="T-Shirt Base"
                    fill
                    className="object-cover opacity-90"
                />

                {/* Design Overlay (Multiply/Screen blend mode for realism) */}
                <motion.div
                    key={selectedDesign.id}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 0.85, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none"
                >
                    <div className="w-[200px] h-[200px] relative">
                        <Image
                            src={selectedDesign.url}
                            alt="Design"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                        />
                    </div>
                </motion.div>

                {/* Helper Badge */}
                <div className="absolute top-4 right-4 bg-neon-cyan/20 text-neon-cyan px-3 py-1 text-xs font-bold rounded-full border border-neon-cyan/50 backdrop-blur-md">
                    PREMIUM PRINT ON DEMAND
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 w-full max-w-xs">
                <h2 className="text-3xl font-bold font-sans tracking-wide text-white">
                    CUSTOMIZE <span className="text-neon-pink text-glow-pink">GEAR</span>
                </h2>

                <div className="space-y-4">
                    <p className="text-sm text-gray-400 uppercase tracking-widest">Select Design</p>
                    <div className="flex gap-4">
                        {designs.map((design) => (
                            <button
                                key={design.id}
                                onClick={() => setSelectedDesign(design)}
                                className={`
                  w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-300
                  ${selectedDesign.id === design.id
                                        ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.4)] scale-110'
                                        : 'border-white/10 hover:border-white/50 opacity-60 hover:opacity-100'}
                `}
                            >
                                <div className="relative w-full h-full bg-black/50">
                                    <Image src={design.url} alt={design.name} fill className="object-cover p-1" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <button className="mt-8 py-4 px-8 bg-neon-cyan text-black font-bold text-lg rounded-none hover:bg-white hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300 uppercase tracking-widest clip-path-slant">
                    Generate Link
                </button>
            </div>
        </div>
    );
}

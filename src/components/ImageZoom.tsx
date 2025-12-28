'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface ImageZoomProps {
    src: string;
    alt: string;
}

export default function ImageZoom({ src, alt }: ImageZoomProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            {/* Image Container with Zoom Trigger */}
            <div
                className="relative aspect-square w-full border-2 border-black dark:border-white shadow-[8px_8px_0px_#111111] dark:shadow-[8px_8px_0px_#f4f4f0] cursor-zoom-in group"
                onClick={() => setIsZoomed(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    unoptimized
                />
                {/* Zoom Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/80 dark:bg-white/80 text-white dark:text-black p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={20} />
                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-accent p-2 border border-white"
                        onClick={() => setIsZoomed(false)}
                    >
                        <X size={32} />
                    </button>
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <p className="absolute bottom-4 text-white text-sm font-mono">
                        Click anywhere to close
                    </p>
                </div>
            )}
        </>
    );
}

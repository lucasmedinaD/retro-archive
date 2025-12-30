'use client';

import { useRef, useState } from 'react';
import { Download, Twitter, Instagram, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { TransformationExtended } from '@/types/transformations';

interface ShareableComparisonProps {
    transformation: TransformationExtended;
}

export default function ShareableComparison({ transformation }: ShareableComparisonProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleDownload = async () => {
        if (!canvasRef.current) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toPng(canvasRef.current, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            link.download = `${transformation.characterName.toLowerCase().replace(/\s+/g, '-')}-comparison.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download image:', err);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareTwitter = () => {
        const text = `Check out this amazing ${transformation.characterName} transformation! 🎨✨\n\nAnime vs Real comparison`;
        const url = `${window.location.origin}/anime-to-real/${transformation.id}`;

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            '_blank',
            'width=550,height=420'
        );
    };

    const handleShareInstagram = async () => {
        await handleDownload();

        // Show instructions modal
        alert(
            '📸 Image downloaded!\n\n' +
            'To share on Instagram:\n' +
            '1. Open Instagram app\n' +
            '2. Create a new post\n' +
            '3. Select the downloaded image\n' +
            '4. Tag us @yourhandle\n\n' +
            'Thank you for sharing! 🙏'
        );
    };

    const handleCopyLink = async () => {
        const url = `${window.location.origin}/anime-to-real/${transformation.id}`;

        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <div className="space-y-4">
            {/* Comparison Canvas */}
            <div
                ref={canvasRef}
                className="relative bg-white"
            >
                <div className="grid grid-cols-2 gap-0">
                    <img
                        src={transformation.animeImage}
                        alt={`${transformation.characterName} - Anime`}
                        className="w-full h-auto"
                    />
                    <img
                        src={transformation.realImage}
                        alt={`${transformation.characterName} - Real`}
                        className="w-full h-auto"
                    />
                </div>

                {/* Branding Watermark - Bottom Right */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/90 text-white px-3 py-1.5">
                    <img src="/logo.png" alt="" className="w-5 h-5" style={{ filter: 'invert(1)' }} />
                    <span className="font-bold text-xs font-mono">retro-archive.art</span>
                </div>

                {/* Character Label - Smaller */}
                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 border border-black">
                    <div className="font-bold text-sm uppercase">{transformation.characterName}</div>
                    {transformation.series && (
                        <div className="text-[10px] font-mono text-gray-600">{transformation.series}</div>
                    )}
                </div>
            </div>

            {/* Share Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm uppercase"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Download'}</span>
                </button>

                <button
                    onClick={handleShareTwitter}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold text-sm uppercase"
                >
                    <Twitter size={16} />
                    <span className="hidden sm:inline">Tweet</span>
                </button>

                <button
                    onClick={handleShareInstagram}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold text-sm uppercase"
                >
                    <Instagram size={16} />
                    <span className="hidden sm:inline">Post</span>
                </button>

                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold text-sm uppercase"
                >
                    {linkCopied ? (
                        <>
                            <Check size={16} />
                            <span className="hidden sm:inline">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            <span className="hidden sm:inline">Copy Link</span>
                        </>
                    )}
                </button>
            </div>

            {/* Share Instructions */}
            <div className="text-center">
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    Share your favorite transformations and tag us! 🎨
                </p>
            </div>
        </div>
    );
}

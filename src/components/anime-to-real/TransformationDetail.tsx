'use client';

import { Heart, Share2, ExternalLink } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';
import EnhancedComparisonSlider from './EnhancedComparisonSlider';
import ShareableComparison from './ShareableComparison';
import OutfitBreakdown from './OutfitBreakdown';
import { useState } from 'react';

interface TransformationDetailProps {
    transformation: TransformationExtended;
    onLike?: () => void;
    initialLiked?: boolean;
}

export default function TransformationDetail({
    transformation,
    onLike,
    initialLiked = false
}: TransformationDetailProps) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [isLiked, setIsLiked] = useState(initialLiked);

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleDownload = () => {
        // This will be triggered from the EnhancedComparisonSlider
        setShowShareModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Slider Section (2/3 width on desktop) */}
                <div className="lg:col-span-2">
                    <EnhancedComparisonSlider
                        animeImage={transformation.animeImage}
                        realImage={transformation.realImage}
                        characterName={transformation.characterName}
                        onLike={handleLike}
                        onShare={handleShare}
                        onDownload={handleDownload}
                        isLiked={isLiked}
                    />
                </div>

                {/* Metadata Sidebar (1/3 width on desktop) */}
                <div className="space-y-6">
                    {/* Character Info */}
                    <div>
                        <h1 className="text-4xl font-black uppercase mb-2">
                            {transformation.characterName}
                        </h1>

                        {transformation.series && (
                            <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-4">
                                from <span className="font-bold">{transformation.series}</span>
                            </p>
                        )}

                        {/* Tags */}
                        {transformation.tags && transformation.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {transformation.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-xs font-mono uppercase"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {transformation.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {transformation.description.en}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="border-2 border-black dark:border-white p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-black">{transformation.likes || 0}</div>
                                <div className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                                    Likes
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-black uppercase">
                                    {transformation.category || '2.5D'}
                                </div>
                                <div className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                                    Category
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Artist Credit */}
                    {transformation.artist && (
                        <div className="border-2 border-black dark:border-white p-4">
                            <div className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400 mb-2">
                                Artist / Cosplayer
                            </div>
                            <div className="font-bold mb-2">{transformation.artist.name}</div>

                            {/* Social Links */}
                            <div className="flex gap-2">
                                {transformation.artist.instagram && (
                                    <a
                                        href={`https://instagram.com/${transformation.artist.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-mono hover:underline"
                                    >
                                        IG <ExternalLink size={12} />
                                    </a>
                                )}
                                {transformation.artist.twitter && (
                                    <a
                                        href={`https://twitter.com/${transformation.artist.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-mono hover:underline"
                                    >
                                        X <ExternalLink size={12} />
                                    </a>
                                )}
                                {transformation.artist.website && (
                                    <a
                                        href={transformation.artist.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-mono hover:underline"
                                    >
                                        Web <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Difficulty Badge */}
                    {transformation.metadata?.difficulty && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400">
                                Difficulty:
                            </span>
                            <span className={`px-3 py-1 font-bold text-xs uppercase ${transformation.metadata.difficulty === 'easy'
                                ? 'bg-green-500 text-white'
                                : transformation.metadata.difficulty === 'medium'
                                    ? 'bg-yellow-500 text-black'
                                    : 'bg-red-500 text-white'
                                }`}>
                                {transformation.metadata.difficulty}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Outfit Breakdown */}
            {transformation.outfit && transformation.outfit.length > 0 && (
                <OutfitBreakdown
                    products={transformation.outfit}
                    characterName={transformation.characterName}
                />
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className="bg-white dark:bg-black border-2 border-black dark:border-white max-w-2xl w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase">Share This Transformation</h2>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-2xl hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <ShareableComparison transformation={transformation} />
                    </div>
                </div>
            )}
        </div>
    );
}

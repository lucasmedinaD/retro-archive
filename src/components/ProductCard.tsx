'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { trackFavorite, trackProductClick } from '@/lib/analytics';
import ScarcityLabel from '@/components/ScarcityLabel';

interface ProductCardProps {
    product: Product;
    lang: 'en' | 'es';
    label: string;
    index?: number;
    dict?: any;
}

export default function ProductCard({ product, lang, label, index = 0, dict }: ProductCardProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
    const [isTouched, setIsTouched] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const wasFavorite = isFavorite(product.id);
        toggleFavorite(product.id);
        trackFavorite(wasFavorite ? 'remove' : 'add', product.id);
    };

    const handleImageTouch = () => {
        setIsTouched(!isTouched);
    };

    const handleProductClick = () => {
        trackProductClick(product.id, product.name, product.category);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }
            } : {}}
            whileHover={{
                y: -8,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link
                href={`/${lang}/product/${product.id}`}
                onClick={handleProductClick}
                className={`group relative border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] transition-all duration-200 hover:-translate-y-1 block`}
            >
                {/* Category Tag - Absolute like TransformationCard */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
                    <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 uppercase">
                        {product.category}
                    </span>
                    <ScarcityLabel productId={product.id} showProbability={0.3} dict={dict} />
                </div>

                {/* Favorite Button */}
                {isLoaded && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent link click
                            handleFavoriteClick(e);
                        }}
                        className="absolute top-2 right-2 z-10 p-2 hover:scale-110 transition-transform"
                        aria-label="Toggle favorite"
                    >
                        <Heart
                            size={20}
                            fill={isFavorite(product.id) ? 'red' : 'rgba(0,0,0,0.5)'}
                            className={isFavorite(product.id) ? 'text-red-500' : 'text-white drop-shadow-md'}
                        />
                    </button>
                )}

                {/* Image Container - Using aspect-[3/4] standard for products but cleaner */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-b-2 border-black dark:border-white">
                    <Image
                        src={product.image || '/mockups/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />

                    {/* Minimal Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-mono text-xs uppercase font-bold tracking-wider">
                            {label} →
                        </span>
                    </div>
                </div>

                {/* Info Footer - Matches TransformationCard Cleanliness */}
                <div className="p-3 bg-white dark:bg-black">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-black uppercase leading-tight truncate">
                                {lang === 'es' && product.name_es ? product.name_es : (product.name_en || product.name)}
                            </h3>
                            <p className="text-xs font-mono text-gray-500 mt-1">
                                {product.price || '$20.00'}
                            </p>
                        </div>
                    </div>
                    {/* Tags - Optional, keeping minimal */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {product.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] text-gray-400 font-mono uppercase">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

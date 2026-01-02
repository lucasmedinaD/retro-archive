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
}

export default function ProductCard({ product, lang, label, index = 0 }: ProductCardProps) {
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
                className={`group relative border-2 border-black dark:border-white bg-white dark:bg-[#111111] flex flex-col h-full transition-all duration-300 block ${isHovered
                        ? 'shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_#f4f4f0]'
                        : ''
                    }`}
            >
                {/* Category Tag */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-mono px-2 py-1 uppercase tracking-tighter"
                    >
                        {product.category}
                    </motion.span>
                    <ScarcityLabel productId={product.id} showProbability={0.3} />
                </div>

                {/* Favorite Button */}
                {isLoaded && (
                    <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleFavoriteClick}
                        className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-black border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        aria-label="Toggle favorite"
                    >
                        <Heart
                            size={16}
                            fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                            className={isFavorite(product.id) ? 'text-red-500' : ''}
                        />
                    </motion.button>
                )}

                {/* Image Container */}
                <div
                    className="relative aspect-square w-full overflow-hidden border-b-2 border-black dark:border-white md:aspect-[3/4]"
                    onTouchStart={handleImageTouch}
                >
                    <Image
                        src={product.image || '/mockups/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className={`object-cover transition-all duration-500 ${isTouched || isHovered ? 'grayscale-0 scale-110' : 'grayscale scale-100'
                            }`}
                        unoptimized
                    />

                    {/* Overlay on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-xs font-mono uppercase opacity-80">
                                {lang === 'es' ? 'Ver detalles' : 'View details'} →
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Info & Action */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold uppercase tracking-tight leading-tight mb-1 text-black dark:text-white line-clamp-2">
                            {lang === 'es' && product.name_es ? product.name_es : (product.name_en || product.name)}
                        </h3>
                        <p className="text-xs font-mono text-gray-500">REF: {product.id.toUpperCase()}</p>
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {product.tags.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 font-mono">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-end justify-between border-t-2 border-black dark:border-white pt-3">
                        <span className="text-sm font-bold font-mono text-black dark:text-white">***</span>
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-black dark:border-white transition-all"
                        >
                            {label} →
                        </motion.span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

'use client';

import { ExternalLink, ShoppingCart } from 'lucide-react';

interface AmazonProduct {
    title: string;
    image: string;
    affiliateUrl: string;
    price?: string;
    category: 'figure' | 'manga' | 'cosplay' | 'accessory' | 'other';
}

interface AmazonAffiliateWidgetProps {
    products: AmazonProduct[];
    characterName?: string;
    dict?: any;
}

const categoryIcons: Record<string, string> = {
    figure: '🗿',
    manga: '📚',
    cosplay: '👘',
    accessory: '💍',
    other: '🎁'
};

const categoryLabels: Record<string, { en: string; es: string }> = {
    figure: { en: 'Figure', es: 'Figura' },
    manga: { en: 'Manga', es: 'Manga' },
    cosplay: { en: 'Cosplay', es: 'Cosplay' },
    accessory: { en: 'Accessory', es: 'Accesorio' },
    other: { en: 'Related', es: 'Relacionado' }
};

export default function AmazonAffiliateWidget({ products, characterName, dict }: AmazonAffiliateWidgetProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="border-2 border-black dark:border-white p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={18} className="text-[#FF9900]" />
                <h3 className="font-bold text-sm uppercase">
                    {dict?.amazon?.title || 'También te puede interesar'}
                </h3>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3">
                {products.map((product, index) => (
                    <a
                        key={index}
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="group border border-black/10 dark:border-white/10 hover:border-[#FF9900] transition-colors bg-white dark:bg-black"
                    >
                        {/* Image */}
                        <div className="aspect-square bg-white overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform p-2"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-1 left-1 bg-black/80 text-white px-1.5 py-0.5 text-[10px] font-mono uppercase">
                                {categoryIcons[product.category]} {categoryLabels[product.category]?.es || product.category}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-2 bg-[#f4f4f0] dark:bg-[#1a1a1a]">
                            <p className="font-bold text-xs truncate mb-1" title={product.title}>
                                {product.title}
                            </p>
                            <div className="flex items-center justify-between">
                                {product.price && (
                                    <span className="text-[#FF9900] font-mono text-xs font-bold">
                                        {product.price}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                    Amazon <ExternalLink size={10} />
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Disclaimer */}
            <p className="text-[9px] text-gray-400 mt-3 font-mono">
                {dict?.amazon?.disclaimer || 'Como Asociado de Amazon, ganamos con compras elegibles.'}
            </p>
        </div>
    );
}

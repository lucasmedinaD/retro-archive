'use client';

import { ExternalLink, ShoppingBag } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';

interface BridgeWidgetProps {
    transformation: TransformationExtended;
    dict: any;
}

export default function BridgeWidget({ transformation, dict }: BridgeWidgetProps) {
    if (!transformation.outfit || transformation.outfit.length === 0) return null;

    const mainProduct = transformation.outfit[0]; // Featured product
    const displayName = mainProduct.name || mainProduct.name_en || mainProduct.name_es || transformation.characterName;

    return (
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black">
            {/* Header - Brutalista Style */}
            <div className="border-b-2 border-black dark:border-white px-4 py-2 bg-[#f4f4f0] dark:bg-[#0a0a0a]">
                <p className="font-mono text-[10px] uppercase tracking-widest text-black dark:text-white">
                    ARCHIVE GEAR // {transformation.characterName}
                </p>
            </div>

            {/* Main Product - Clickable Lifestyle Mockup Area */}
            <a
                href={mainProduct.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
            >
                {/* Product Image */}
                <div className="aspect-square bg-white overflow-hidden relative">
                    <img
                        src={mainProduct.image}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-black px-4 py-2 border-2 border-black dark:border-white">
                            <span className="font-mono text-xs uppercase">Ver Producto</span>
                        </div>
                    </div>
                </div>

                {/* Product Name */}
                <div className="px-4 py-3 border-t border-black/10 dark:border-white/10">
                    <p className="font-bold text-sm truncate">{displayName}</p>
                    <p className="text-accent font-mono text-xs">{mainProduct.price}</p>
                </div>
            </a>

            {/* CTA Button - Full Width */}
            <a
                href={mainProduct.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-black dark:bg-white text-white dark:text-black text-center py-4 font-bold uppercase tracking-widest text-sm hover:bg-accent hover:text-black transition-colors group"
            >
                <span className="flex items-center justify-center gap-2">
                    <ShoppingBag size={16} />
                    {dict?.bridge?.cta || 'ADQUIRIR EQUIPAMIENTO'}
                </span>
            </a>

            {/* Security Validator */}
            <div className="px-4 py-2 bg-[#f4f4f0] dark:bg-[#0a0a0a] border-t border-black/10 dark:border-white/10">
                <p className="font-mono text-[9px] text-gray-500 text-center">
                    {dict?.bridge?.secure || 'Envío seguro vía Redbubble.'}
                </p>
                {/* Available on more products */}
                <p className="font-mono text-[10px] text-gray-600 dark:text-gray-400 text-center mt-1">
                    🎨 {dict?.bridge?.alsoAvailable || 'También en: Stickers • Hoodies • Tazas • Posters y +60 más'}
                </p>
            </div>

            {/* Additional Products (if more than 1) */}
            {transformation.outfit.length > 1 && (
                <div className="border-t-2 border-black dark:border-white p-3">
                    <p className="font-mono text-[9px] uppercase text-gray-500 mb-2">Más diseños:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {transformation.outfit.slice(1, 4).map((product, index) => (
                            <a
                                key={index}
                                href={product.buyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-square bg-white border border-black/10 dark:border-white/10 overflow-hidden hover:border-accent transition-colors"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

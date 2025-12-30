'use client';

import { ExternalLink } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';

interface BridgeWidgetProps {
    transformation: TransformationExtended;
    dict: any;
}

export default function BridgeWidget({ transformation, dict }: BridgeWidgetProps) {
    if (!transformation.outfit || transformation.outfit.length === 0) return null;

    return (
        <div className="space-y-3">
            <p className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
                {dict?.catalog?.buy || 'Get this design'}
            </p>

            {/* Products Grid */}
            <div className="space-y-3">
                {transformation.outfit.map((product, index) => (
                    <a
                        key={index}
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-black/10 dark:border-white/10 hover:border-accent transition-colors group"
                    >
                        {/* Product Image */}
                        <div className="aspect-square bg-white overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="p-3 bg-[#f4f4f0] dark:bg-[#111111]">
                            <p className="font-bold text-sm truncate">{product.name}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-accent font-mono text-sm">{product.price}</span>
                                <ExternalLink size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}


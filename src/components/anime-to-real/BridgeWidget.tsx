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
        <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase text-gray-500 dark:text-gray-400">
                {dict?.catalog?.buy || 'Get this design'}
            </p>

            {/* Products - Compact 2-Column Grid */}
            <div className="grid grid-cols-2 gap-2">
                {transformation.outfit.map((product, index) => (
                    <a
                        key={index}
                        href={product.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-black/10 dark:border-white/10 hover:border-accent transition-colors group"
                    >
                        {/* Product Image - 1:1 cover fill */}
                        <div className="aspect-square bg-white overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                        </div>

                        {/* Minimal Product Info */}
                        <div className="p-2 bg-[#f4f4f0] dark:bg-[#111111]">
                            <p className="font-bold text-[10px] truncate">{product.name}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-accent font-mono text-xs">${product.price}</span>
                                <ExternalLink size={10} className="text-gray-400" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

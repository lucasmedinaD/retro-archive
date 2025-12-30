'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Flame, Sparkles } from 'lucide-react';

type ScarcityType = 'limited' | 'rotation' | 'last_units' | 'temporal' | 'featured';

interface ScarcityLabelProps {
    productId?: string;
    showProbability?: number;
    className?: string;
    forceType?: ScarcityType;
    dict?: {
        scarcity: {
            limited_stock: string;
            rotation: string;
            last_units: string;
            temporal: string;
            featured: string;
        };
    };
}

const LABEL_ICONS: Record<ScarcityType, any> = {
    limited: AlertTriangle,
    rotation: Clock,
    last_units: Flame,
    temporal: Clock,
    featured: Sparkles
};

const LABEL_BG: Record<ScarcityType, string> = {
    limited: 'bg-gradient-to-r from-orange-600 to-red-600',
    rotation: 'bg-gradient-to-r from-purple-600 to-pink-600',
    last_units: 'bg-gradient-to-r from-red-600 to-red-700',
    temporal: 'bg-gradient-to-r from-blue-600 to-purple-600',
    featured: 'bg-gradient-to-r from-yellow-500 to-orange-500'
};

function getScarcityForProduct(productId: string, showProbability: number): ScarcityType | null {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dayOfYear = Math.floor(Date.now() / 86400000);
    const combinedHash = (hash + dayOfYear) % 100;

    if (combinedHash >= showProbability * 100) return null;

    const types: ScarcityType[] = ['limited', 'rotation', 'last_units', 'temporal'];
    return types[combinedHash % types.length];
}

export default function ScarcityLabel({
    productId = 'default',
    showProbability = 0.4,
    className = '',
    forceType,
    dict
}: ScarcityLabelProps) {
    const [labelType, setLabelType] = useState<ScarcityType | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (forceType) {
            setLabelType(forceType);
        } else {
            setLabelType(getScarcityForProduct(productId, showProbability));
        }
    }, [productId, showProbability, forceType]);

    if (!isClient || !labelType) return null;

    const Icon = LABEL_ICONS[labelType];
    const bgClass = LABEL_BG[labelType];

    // Get text from dict or fallback
    const getText = (type: ScarcityType): string => {
        if (dict?.scarcity) {
            const textMap: Record<ScarcityType, string> = {
                limited: dict.scarcity.limited_stock,
                rotation: dict.scarcity.rotation,
                last_units: dict.scarcity.last_units,
                temporal: dict.scarcity.temporal,
                featured: dict.scarcity.featured
            };
            return textMap[type];
        }
        // Fallback
        const fallbackMap: Record<ScarcityType, string> = {
            limited: 'LIMITED STOCK',
            rotation: 'DESIGN IN ROTATION',
            last_units: 'LAST UNITS',
            temporal: 'TEMPORAL ARCHIVE',
            featured: 'FEATURED'
        };
        return fallbackMap[type];
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 ${bgClass} text-white text-[10px] font-bold uppercase px-2 py-1 shadow-lg ${className}`}
        >
            <Icon size={10} />
            {getText(labelType)}
        </motion.div>
    );
}


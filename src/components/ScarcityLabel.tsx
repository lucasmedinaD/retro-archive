'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Flame, Sparkles } from 'lucide-react';

type ScarcityType = 'limited' | 'rotation' | 'last_units' | 'temporal' | 'featured';

interface ScarcityLabelProps {
    productId?: string;
    showProbability?: number; // 0-1, probability of showing any label
    className?: string;
    forceType?: ScarcityType;
}

const LABELS: Record<ScarcityType, { icon: any; text: string; bgClass: string }> = {
    limited: {
        icon: AlertTriangle,
        text: 'STOCK LIMITADO',
        bgClass: 'bg-gradient-to-r from-orange-600 to-red-600'
    },
    rotation: {
        icon: Clock,
        text: 'DISEÑO EN ROTACIÓN',
        bgClass: 'bg-gradient-to-r from-purple-600 to-pink-600'
    },
    last_units: {
        icon: Flame,
        text: 'ÚLTIMAS UNIDADES',
        bgClass: 'bg-gradient-to-r from-red-600 to-red-700'
    },
    temporal: {
        icon: Clock,
        text: 'ARCHIVO TEMPORAL',
        bgClass: 'bg-gradient-to-r from-blue-600 to-purple-600'
    },
    featured: {
        icon: Sparkles,
        text: 'DESTACADO',
        bgClass: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    }
};

// Deterministic "random" based on product ID
function getScarcityForProduct(productId: string, showProbability: number): ScarcityType | null {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dayOfYear = Math.floor(Date.now() / 86400000);
    const combinedHash = (hash + dayOfYear) % 100;

    // Probability check
    if (combinedHash >= showProbability * 100) return null;

    // Select label type
    const types: ScarcityType[] = ['limited', 'rotation', 'last_units', 'temporal'];
    return types[combinedHash % types.length];
}

export default function ScarcityLabel({
    productId = 'default',
    showProbability = 0.4,
    className = '',
    forceType
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

    const config = LABELS[labelType];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 ${config.bgClass} text-white text-[10px] font-bold uppercase px-2 py-1 shadow-lg ${className}`}
        >
            <Icon size={10} />
            {config.text}
        </motion.div>
    );
}

'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
    fallbackSrc?: string;
}

export default function SafeImage({
    src,
    fallbackSrc = '/placeholder.png',
    alt,
    ...props
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setImgSrc(fallbackSrc);
                }
            }}
        />
    );
}

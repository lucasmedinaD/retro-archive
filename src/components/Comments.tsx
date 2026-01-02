'use client';

import { useEffect, useRef } from 'react';

// Giscus configuration for lucasmedinaD/retro-archive
const GISCUS_CONFIG = {
    repo: 'lucasmedinaD/retro-archive' as const,
    repoId: 'R_kgDOQv3i6A',
    category: 'Announcements',
    categoryId: 'DIC_kwDOQv3i6M4C0fwB',
};

interface CommentsProps {
    lang?: 'en' | 'es';
}

export default function Comments({ lang = 'es' }: CommentsProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Clear previous iframe if exists
        ref.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', GISCUS_CONFIG.repo);
        script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
        script.setAttribute('data-category', GISCUS_CONFIG.category);
        script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme'); // Auto dark/light
        script.setAttribute('data-lang', lang);
        script.crossOrigin = 'anonymous';
        script.async = true;

        ref.current.appendChild(script);
    }, [lang]);

    return (
        <section className="mt-12 pt-8 border-t-2 border-black/10 dark:border-white/10">
            <h3 className="text-xl font-bold uppercase mb-6">
                {lang === 'es' ? '💬 Comentarios' : '💬 Comments'}
            </h3>
            <div ref={ref} className="giscus" />
        </section>
    );
}

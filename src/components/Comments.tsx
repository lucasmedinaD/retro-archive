'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface CommentsProps {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping?: 'pathname' | 'url' | 'title' | 'og:title';
    lang?: 'en' | 'es';
}

export default function Comments({
    repo,
    repoId,
    category,
    categoryId,
    mapping = 'pathname',
    lang = 'en'
}: CommentsProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!ref.current) return;

        // Clear previous iframe if exists
        ref.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', repo);
        script.setAttribute('data-repo-id', repoId);
        script.setAttribute('data-category', category);
        script.setAttribute('data-category-id', categoryId);
        script.setAttribute('data-mapping', mapping);
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', theme === 'dark' ? 'dark_dimmed' : 'light');
        script.setAttribute('data-lang', lang);
        script.crossOrigin = 'anonymous';
        script.async = true;

        ref.current.appendChild(script);
    }, [repo, repoId, category, categoryId, mapping, theme, lang]);

    return (
        <section className="mt-12 pt-8 border-t-2 border-black/10 dark:border-white/10">
            <h3 className="text-xl font-bold uppercase mb-6">
                {lang === 'es' ? 'Comentarios' : 'Comments'}
            </h3>
            <div ref={ref} className="giscus" />
        </section>
    );
}

'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
    currentLang: 'en' | 'es';
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        // Replace the language segment in the path (e.g. /en/about -> /es/about)
        const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="font-mono text-xs font-bold border border-black dark:border-white px-2 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors uppercase"
        >
            {currentLang === 'en' ? 'EN' : 'ES'}
        </button>
    );
}

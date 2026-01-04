'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
}

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '', autoFocus = false }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle Enter key to submit search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(query);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
        inputRef.current?.focus();
    };

    // Keyboard shortcut: Ctrl/Cmd + K
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape' && isFocused) {
                inputRef.current?.blur();
                handleClear();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isFocused]);

    return (
        <div className={`relative ${className}`}>
            <div className={`
                flex items-center gap-3 
                border-2 border-black dark:border-white 
                bg-white dark:bg-black
                px-4 py-3
                transition-all duration-200
                ${isFocused ? 'shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)]' : ''}
            `}>
                <Search size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="
                        w-full bg-transparent outline-none 
                        font-mono text-sm
                        placeholder:text-gray-400 dark:placeholder:text-gray-600
                    "
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="flex-shrink-0 hover:text-accent transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Keyboard hint */}
                <div className="hidden sm:flex items-center gap-1 text-gray-400 text-xs font-mono">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-[10px]">
                        Enter
                    </kbd>
                </div>
            </div>
        </div>
    );
}

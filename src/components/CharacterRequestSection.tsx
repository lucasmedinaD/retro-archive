'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';

interface CharacterRequest {
    id: string;
    characterName: string;
    series?: string;
    votes: number;
}

interface CharacterRequestSectionProps {
    lang: 'en' | 'es';
}

const VOTE_COOLDOWN_KEY = 'lastCharacterVote';
const COOLDOWN_HOURS = 24;

export default function CharacterRequestSection({ lang }: CharacterRequestSectionProps) {
    const [input, setInput] = useState('');
    const [series, setSeries] = useState('');
    const [rankings, setRankings] = useState<CharacterRequest[]>([]);
    const [suggestions, setSuggestions] = useState<CharacterRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasVotedToday, setHasVotedToday] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Check if user already voted today
    useEffect(() => {
        const lastVote = localStorage.getItem(VOTE_COOLDOWN_KEY);
        if (lastVote) {
            const lastVoteTime = parseInt(lastVote, 10);
            const hoursSinceVote = (Date.now() - lastVoteTime) / (1000 * 60 * 60);
            setHasVotedToday(hoursSinceVote < COOLDOWN_HOURS);
        }
    }, []);

    // Fetch rankings
    const fetchRankings = useCallback(async () => {
        try {
            const res = await fetch('/api/character-requests');
            if (res.ok) {
                const data = await res.json();
                setRankings(data.requests || []);
            }
        } catch (error) {
            console.error('Failed to fetch rankings:', error);
        }
    }, []);

    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);

    // Fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(rankings, {
            keys: ['characterName', 'series'],
            threshold: 0.4,
            includeScore: true
        });
    }, [rankings]);

    // Handle input change with fuzzy matching
    useEffect(() => {
        if (input.length >= 2) {
            const results = fuse.search(input);
            setSuggestions(results.slice(0, 5).map(r => r.item));
        } else {
            setSuggestions([]);
        }
    }, [input, fuse]);

    // Submit vote
    const handleVote = async (characterName?: string) => {
        const nameToVote = characterName || input.trim();

        if (!nameToVote || nameToVote.length < 2) {
            setMessage({ type: 'error', text: lang === 'es' ? 'Escribe un nombre válido' : 'Enter a valid name' });
            return;
        }

        if (hasVotedToday) {
            setMessage({ type: 'error', text: lang === 'es' ? 'Ya votaste hoy. Vuelve mañana!' : 'Already voted today. Come back tomorrow!' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/character-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterName: nameToVote, series: series.trim() || undefined })
            });

            if (res.ok) {
                localStorage.setItem(VOTE_COOLDOWN_KEY, Date.now().toString());
                setHasVotedToday(true);
                setMessage({ type: 'success', text: lang === 'es' ? '¡Voto registrado!' : 'Vote registered!' });
                setInput('');
                setSeries('');
                fetchRankings();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Error' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error submitting vote' });
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate max votes for progress bar
    const maxVotes = rankings.length > 0 ? Math.max(...rankings.map(r => r.votes)) : 1;

    return (
        <section className="border-2 border-black dark:border-white p-6 bg-white dark:bg-black">
            <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                🎯 {lang === 'es' ? 'Solicitar Personaje' : 'Request Character'}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {lang === 'es'
                    ? '¿Qué personaje querés ver transformado? Los más votados tienen prioridad.'
                    : 'Which character do you want to see transformed? Most voted get priority.'}
            </p>

            {/* Input Form */}
            <div className="space-y-3 mb-8">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={lang === 'es' ? 'Ej: Makima, Gojo, Yor...' : 'E.g.: Makima, Gojo, Yor...'}
                        className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-black font-mono text-sm focus:outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:focus:shadow-[3px_3px_0px_rgba(255,255,255,1)]"
                        disabled={hasVotedToday}
                    />

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && !hasVotedToday && (
                        <div className="absolute z-10 w-full mt-1 border-2 border-black dark:border-white bg-white dark:bg-black">
                            {suggestions.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => handleVote(s.characterName)}
                                    className="w-full px-4 py-2 text-left hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-sm font-mono flex justify-between items-center"
                                >
                                    <span>{s.characterName}</span>
                                    {s.series && <span className="text-xs text-gray-500">{s.series}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    placeholder={lang === 'es' ? 'Serie/Anime (opcional)' : 'Series/Anime (optional)'}
                    className="w-full px-4 py-2 border border-black/30 dark:border-white/30 bg-white dark:bg-black font-mono text-xs focus:outline-none"
                    disabled={hasVotedToday}
                />

                <button
                    onClick={() => handleVote()}
                    disabled={isLoading || hasVotedToday || input.length < 2}
                    className={`w-full py-3 font-bold uppercase text-sm transition-all ${hasVotedToday
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white dark:bg-white dark:text-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_rgba(255,255,255,1)]'
                        }`}
                >
                    {isLoading ? '...' : hasVotedToday
                        ? (lang === 'es' ? '✓ Ya votaste hoy' : '✓ Already voted today')
                        : (lang === 'es' ? '🗳️ Votar' : '🗳️ Vote')
                    }
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-3 text-sm font-mono ${message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Rankings */}
            <div>
                <h4 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                    📊 {lang === 'es' ? 'Top Solicitados' : 'Top Requested'}
                </h4>

                <div className="space-y-2">
                    {rankings.slice(0, 10).map((r, i) => (
                        <div key={r.id} className="flex items-center gap-3">
                            <span className="w-6 text-center font-bold text-sm">
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                            </span>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{r.characterName}</span>
                                    <span className="font-mono text-xs text-gray-500">{r.votes}</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-800">
                                    <div
                                        className="h-full bg-accent transition-all duration-500"
                                        style={{ width: `${(r.votes / maxVotes) * 100}%` }}
                                    />
                                </div>
                                {r.series && (
                                    <span className="text-[10px] text-gray-500 font-mono">{r.series}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {rankings.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">
                            {lang === 'es' ? 'Sé el primero en votar!' : 'Be the first to vote!'}
                        </p>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-[10px] text-gray-500 font-mono">
                ⚠️ {lang === 'es'
                    ? 'Los más votados tienen prioridad pero no garantía de creación.'
                    : 'Most voted have priority but no guarantee of creation.'}
            </p>
        </section>
    );
}

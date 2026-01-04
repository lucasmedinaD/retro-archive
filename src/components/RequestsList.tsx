'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useAuth } from '@/contexts/AuthContext';
import { createRequestAction, voteRequestAction } from '@/app/requests/actions';
import { ThumbsUp, Plus, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary } from '@/get-dictionary'; // This wont work in client component directly if not passed as prop or fetched differently. 
// Actually I'll make this a client component wrapped by a server page to pass dict, or just fetch dict.
// Let's make the main page a Server Component and importing a Client Component for the list.

// THIS FILE IS THE CLIENT COMPONENT
interface Request {
    id: string;
    character_name: string;
    series: string;
    votes: number;
    status: string;
    user_has_voted?: boolean;
}

interface RequestsListProps {
    initialRequests: Request[];
    lang: 'en' | 'es';
    dict: any; // Passed from server page
}

export default function RequestsList({ initialRequests, lang, dict }: RequestsListProps) {
    const { user, signInWithGoogle } = useAuth();
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [showForm, setShowForm] = useState(false);
    const [newCharacter, setNewCharacter] = useState('');
    const [newSeries, setNewSeries] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const supabase = createSupabaseBrowserClient();

    // Subscribe to realtime updates
    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('requests_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
                // Refresh list or optimistic update equivalent
                // For simplicity, let's just re-fetch everything or handle simple updates
                if (payload.eventType === 'INSERT') {
                    setRequests(prev => [payload.new as Request, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setRequests(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r));
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [supabase]);

    // Check user votes on mount
    useEffect(() => {
        const checkVotes = async () => {
            if (!user || !supabase) return;

            const { data: userVotes } = await supabase
                .from('request_votes')
                .select('request_id')
                .eq('user_id', user.id);

            if (userVotes) {
                const votedIds = new Set(userVotes.map(v => v.request_id));
                setRequests(prev => prev.map(r => ({
                    ...r,
                    user_has_voted: votedIds.has(r.id)
                })));
            }
        };
        checkVotes();
    }, [user, supabase]);

    const handleVote = async (requestId: string) => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        // Optimistic update
        setRequests(prev => prev.map(r => {
            if (r.id === requestId) {
                const isVoted = !r.user_has_voted;
                return {
                    ...r,
                    user_has_voted: isVoted,
                    votes: r.votes + (isVoted ? 1 : -1)
                };
            }
            return r;
        }));

        await voteRequestAction(requestId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            signInWithGoogle();
            return;
        }
        if (!newCharacter.trim()) return;

        setIsSubmitting(true);
        const res = await createRequestAction(newCharacter, newSeries);
        setIsSubmitting(false);

        if (res.success) {
            setShowForm(false);
            setNewCharacter('');
            setNewSeries('');
            // Optimistic add (though realtime should catch it too)
            // setRequests(prev => [{ ...res.data, votes: 1, user_has_voted: true }, ...prev]); 
        } else {
            alert(res.error);
        }
    };

    const filteredRequests = requests
        .filter(r => r.character_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.series?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.votes - a.votes); // Sort by popularity

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase mb-2">
                        {lang === 'es' ? 'Peticiones' : 'Requests'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm max-w-lg">
                        {lang === 'es'
                            ? 'Vota por los personajes que quieres ver convertidos a real. Los más votados serán priorizados.'
                            : 'Vote for the characters you want to see in real life. Most voted get priority.'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (!user) signInWithGoogle();
                        else setShowForm(true);
                    }}
                    className="px-6 py-3 bg-accent text-black font-bold uppercase hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <Plus size={20} />
                    {lang === 'es' ? 'Pedir Personaje' : 'Request Character'}
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder={lang === 'es' ? 'Buscar personaje o serie...' : 'Search character or series...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-3 pl-12 pr-4 outline-none focus:border-accent transition-colors"
                />
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#111] p-6 rounded-xl max-w-md w-full border border-gray-200 dark:border-gray-800">
                        <h3 className="text-xl font-bold uppercase mb-4">
                            {lang === 'es' ? 'Nueva Petición' : 'New Request'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase mb-1 text-gray-500">Character Name</label>
                                <input
                                    type="text"
                                    value={newCharacter}
                                    onChange={(e) => setNewCharacter(e.target.value)}
                                    className="w-full p-2 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-accent outline-none rounded"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase mb-1 text-gray-500">Series (Optional)</label>
                                <input
                                    type="text"
                                    value={newSeries}
                                    onChange={(e) => setNewSeries(e.target.value)}
                                    className="w-full p-2 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-accent outline-none rounded"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2 text-sm uppercase font-bold text-gray-500 hover:text-black dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 bg-accent text-black font-bold uppercase rounded text-sm hover:opacity-90 disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : (lang === 'es' ? 'Enviar' : 'Submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {filteredRequests.map((req) => (
                    <div
                        key={req.id}
                        className={`flex items-center justify-between p-4 bg-white dark:bg-white/5 border ${req.status === 'completed' ? 'border-green-500/50' : 'border-black/5 dark:border-white/5'} rounded-lg hover:border-accent transition-colors`}
                    >
                        <div>
                            <h3 className="font-bold text-lg">{req.character_name}</h3>
                            <p className="text-sm text-gray-500 font-mono uppercase">{req.series || 'Unknown Series'}</p>
                            {req.status === 'completed' && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold uppercase rounded">
                                    {lang === 'es' ? '¡Completado!' : 'Completed!'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-black font-mono opacity-50">#{filteredRequests.indexOf(req) + 1}</span>
                            <button
                                onClick={() => handleVote(req.id)}
                                disabled={req.status === 'completed'}
                                className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-colors ${req.user_has_voted
                                        ? 'bg-accent text-black'
                                        : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'
                                    }`}
                            >
                                <ThumbsUp size={20} className={req.user_has_voted ? 'fill-black' : ''} />
                                <span className="font-mono font-bold text-sm">{req.votes}</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="text-center py-12 opacity-50">
                        <p>{lang === 'es' ? 'No se encontraron peticiones.' : 'No requests found.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

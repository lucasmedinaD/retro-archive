'use client';

import { useState, useEffect } from 'react';
import { Check, X, Crown, Trash2, Star, Eye, EyeOff } from 'lucide-react';

interface HeroClaim {
    id: string;
    name: string;
    email: string;
    bmc_name: string | null;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Hero {
    id: string;
    name: string;
    email: string | null;
    is_verified: boolean;
    is_anonymous: boolean;
    featured: boolean;
    created_at: string;
}

export default function HeroesAdminPage() {
    const [claims, setClaims] = useState<HeroClaim[]>([]);
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'claims' | 'heroes'>('claims');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch claims
            const claimsRes = await fetch('/api/admin/hero-claims');
            if (claimsRes.ok) {
                const claimsData = await claimsRes.json();
                setClaims(claimsData);
            }

            // Fetch heroes
            const heroesRes = await fetch('/api/admin/heroes');
            if (heroesRes.ok) {
                const heroesData = await heroesRes.json();
                setHeroes(heroesData);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
        setIsLoading(false);
    };

    const handleApproveClaim = async (claim: HeroClaim) => {
        const res = await fetch('/api/admin/hero-claims', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve', claimId: claim.id, name: claim.name, email: claim.email })
        });

        if (res.ok) {
            fetchData();
        }
    };

    const handleRejectClaim = async (claimId: string) => {
        const res = await fetch('/api/admin/hero-claims', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reject', claimId })
        });

        if (res.ok) {
            fetchData();
        }
    };

    const handleToggleFeatured = async (heroId: string, currentFeatured: boolean) => {
        const res = await fetch('/api/admin/heroes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heroId, featured: !currentFeatured })
        });

        if (res.ok) {
            fetchData();
        }
    };

    const handleDeleteHero = async (heroId: string) => {
        if (!confirm('¿Eliminar este héroe?')) return;

        const res = await fetch('/api/admin/heroes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heroId })
        });

        if (res.ok) {
            fetchData();
        }
    };

    const pendingClaims = claims.filter(c => c.status === 'pending');

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Crown className="text-yellow-500" size={32} />
                    <h1 className="text-3xl font-black">Héroes de la Tribu - Admin</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('claims')}
                        className={`px-4 py-2 font-bold ${activeTab === 'claims' ? 'bg-black text-white' : 'bg-white'}`}
                    >
                        Claims Pendientes ({pendingClaims.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('heroes')}
                        className={`px-4 py-2 font-bold ${activeTab === 'heroes' ? 'bg-black text-white' : 'bg-white'}`}
                    >
                        Héroes ({heroes.length})
                    </button>
                </div>

                {isLoading ? (
                    <p>Cargando...</p>
                ) : activeTab === 'claims' ? (
                    /* Claims Tab */
                    <div className="bg-white border-2 border-black">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-3 text-left">Nombre</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">BMC Name</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-gray-500">
                                            No hay claims
                                        </td>
                                    </tr>
                                ) : claims.map((claim) => (
                                    <tr key={claim.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 font-bold">{claim.name}</td>
                                        <td className="p-3 text-sm">{claim.email}</td>
                                        <td className="p-3 text-sm">{claim.bmc_name || '-'}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-bold uppercase ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(claim.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            {claim.status === 'pending' && (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveClaim(claim)}
                                                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                        title="Aprobar"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClaim(claim.id)}
                                                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                        title="Rechazar"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Heroes Tab */
                    <div className="bg-white border-2 border-black">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-3 text-left">Nombre</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-center">Featured</th>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {heroes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-gray-500">
                                            No hay héroes todavía
                                        </td>
                                    </tr>
                                ) : heroes.map((hero) => (
                                    <tr key={hero.id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 font-bold flex items-center gap-2">
                                            {hero.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                                            {hero.name}
                                        </td>
                                        <td className="p-3 text-sm">{hero.email || '-'}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleToggleFeatured(hero.id, hero.featured)}
                                                className={`p-2 rounded ${hero.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'}`}
                                                title={hero.featured ? 'Quitar destacado' : 'Destacar'}
                                            >
                                                <Star size={16} fill={hero.featured ? 'currentColor' : 'none'} />
                                            </button>
                                        </td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(hero.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteHero(hero.id)}
                                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
    fetchTransformationsAction,
    createTransformationAction,
    deleteTransformationAction,
    updateTransformationAction,
    deleteAllTransformationsAction
} from '../actions/transformations';
import { TransformationExtended as TransformationData } from '@/types/transformations';
import TransformationEditor from '../TransformationEditor';

export default function TransformationsPage() {
    const [transformations, setTransformations] = useState<TransformationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTransformation, setEditingTransformation] = useState<TransformationData | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTransformations();
    }, []);

    const loadTransformations = async () => {
        setIsLoading(true);
        const result = await fetchTransformationsAction();
        if (result.success && result.data) {
            setTransformations(result.data as TransformationData[]);
        } else if (result.error) {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleCreateNew = () => {
        const emptyTransformation: TransformationData = {
            id: '',
            characterName: '',
            animeImage: '',
            realImage: '',
            series: '',
            category: 'cosplay',
            tags: [],
            description: { en: '', es: '' },
            likes: 0,
            metadata: {}
        };
        setEditingTransformation(emptyTransformation);
        setIsCreating(true);
    };

    const handleSave = async (data: TransformationData) => {
        try {
            let result;
            if (isCreating) {
                result = await createTransformationAction(data);
            } else {
                result = await updateTransformationAction(editingTransformation!.id, data);
            }

            if (result.success) {
                setEditingTransformation(null);
                setIsCreating(false);
                loadTransformations();
            } else {
                setError(result.error || 'Failed to save');
            }
        } catch (err) {
            setError(String(err));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('⚠️ Delete this transformation? This cannot be undone!')) return;

        const result = await deleteTransformationAction(id);
        if (result.success) {
            loadTransformations();
        } else {
            setError(result.error || 'Failed to delete');
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('⚠️⚠️⚠️ DELETE ALL TRANSFORMATIONS? THIS CANNOT BE UNDONE!')) return;
        if (!confirm('Are you ABSOLUTELY SURE? Type YES in the console.')) return;

        const result = await deleteAllTransformationsAction();
        if (result.success) {
            loadTransformations();
        } else {
            setError(result.error || 'Failed to delete all');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-mono">LOADING TRANSFORMATIONS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase mb-2">Transformations</h1>
                        <p className="text-gray-400 font-mono text-sm">
                            {transformations.length} total entries
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/admin"
                            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white font-bold uppercase text-sm transition-colors"
                        >
                            ← Back to Admin
                        </Link>
                        <button
                            onClick={handleCreateNew}
                            className="px-4 py-2 bg-accent hover:bg-red-600 text-white font-bold uppercase text-sm flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} /> New Transformation
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 text-red-200">
                        <p className="font-mono text-sm">ERROR: {error}</p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transformations.map((t) => (
                        <div
                            key={t.id}
                            className="border-2 border-[#333] hover:border-accent transition-colors bg-[#0a0a0a] overflow-hidden"
                        >
                            <div className="relative aspect-[4/5]">
                                <Image
                                    src={t.realImage}
                                    alt={t.characterName}
                                    fill
                                    className="object-cover"
                                />
                                {t.secretImage && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs font-black">
                                        🎮 SECRET
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-1">{t.characterName}</h3>
                                <p className="text-sm text-gray-400 mb-2 font-mono">{t.series}</p>
                                <p className="text-xs text-gray-500 mb-2">
                                    {t.category} • {t.tags?.join(', ')}
                                </p>
                                <p className="text-xs text-gray-600 mb-4 font-mono">
                                    ❤️ {t.likes || 0} likes
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingTransformation(t);
                                            setIsCreating(false);
                                        }}
                                        className="flex-1 px-3 py-2 bg-[#333] hover:bg-accent text-white font-bold uppercase text-xs flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="px-3 py-2 bg-red-900 hover:bg-red-700 text-white font-bold uppercase text-xs flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div className="mt-12 p-6 border-2 border-red-500 bg-red-500/10">
                    <h3 className="text-xl font-black uppercase mb-2 text-red-500">⚠️ Danger Zone</h3>
                    <p className="text-sm text-gray-400 mb-4">Irreversible actions that permanently delete data</p>
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm"
                    >
                        Delete All Transformations
                    </button>
                </div>
            </div>

            {/* Editor Modal */}
            {editingTransformation && (
                <TransformationEditor
                    transformation={editingTransformation}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingTransformation(null);
                        setIsCreating(false);
                    }}
                    isNew={isCreating}
                />
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Upload, Trash2, Edit } from 'lucide-react';
import {
    fetchTransformationsAction,
    createTransformationAction,
    deleteTransformationAction,
    updateTransformationAction,
    uploadTransformationImageAction,
    deleteAllTransformationsAction,
    TransformationData
} from '../actions/transformations';
import TransformationEditor from '../TransformationEditor';

export default function TransformationsPage() {
    const [transformations, setTransformations] = useState<TransformationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTransformation, setEditingTransformation] = useState<TransformationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [characterName, setCharacterName] = useState('');
    const [descriptionEn, setDescriptionEn] = useState('');
    const [descriptionEs, setDescriptionEs] = useState('');
    const [series, setSeries] = useState('');
    const [category, setCategory] = useState<'cosplay' | 'fanart' | '2.5d' | 'other'>('cosplay');
    const [tags, setTags] = useState('');
    const [animeImage, setAnimeImage] = useState<File | null>(null);
    const [realImage, setRealImage] = useState<File | null>(null);
    const [animePreview, setAnimePreview] = useState<string>('');
    const [realPreview, setRealPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleAnimeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAnimeImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setAnimePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRealImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRealImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setRealPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!animeImage || !realImage || !characterName) {
            alert('⚠️ VALIDATION ERROR: Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Upload anime image
            const animeUpload = await uploadTransformationImageAction(animeImage, 'anime');
            if (animeUpload.error) throw new Error(`Anime upload failed: ${animeUpload.error}`);

            // 2. Upload real image
            const realUpload = await uploadTransformationImageAction(realImage, 'real');
            if (realUpload.error) throw new Error(`Real upload failed: ${realUpload.error}`);

            // 3. Create transformation
            const transformation = {
                characterName,
                animeImage: animeUpload.path!,
                realImage: realUpload.path!,
                series: series || undefined,
                category,
                tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : undefined,
                description: descriptionEn || descriptionEs ? {
                    en: descriptionEn,
                    es: descriptionEs
                } : undefined,
                likes: 0
            };

            const result = await createTransformationAction(transformation);
            if (result.error) throw new Error(result.error);

            // Success!
            alert('✅ TRANSFORMATION CREATED: Upload successful. Deployment initiated (ETA: 2 mins).');

            // Reset form
            setIsCreating(false);
            setCharacterName('');
            setDescriptionEn('');
            setDescriptionEs('');
            setSeries('');
            setCategory('cosplay');
            setTags('');
            setAnimeImage(null);
            setRealImage(null);
            setAnimePreview('');
            setRealPreview('');

            // Reload data
            loadTransformations();
        } catch (err: any) {
            setError(err.message);
            alert(`❌ UPLOAD FAILED: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (transformation: TransformationData) => {
        if (!confirm(`⚠️ DELETE TRANSFORMATION "${transformation.characterName}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        const result = await deleteTransformationAction(transformation.id);
        if (result.error) {
            alert(`DELETE FAILED: ${result.error}`);
        } else {
            alert('DELETE SUCCESSFUL: Transformation removed. Deployment initiated.');
            loadTransformations();
        }
    };

    const handleUpdate = async (updatedTransformation: TransformationData) => {
        const result = await updateTransformationAction(updatedTransformation.id, updatedTransformation);
        if (result.error) {
            alert(`❌ UPDATE FAILED: ${result.error}`);
        } else {
            alert('✅ UPDATE SUCCESSFUL');
            setEditingTransformation(null);
            loadTransformations();
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm(`⚠️ DELETE ALL TRANSFORMATIONS?\n\nThis will remove ${transformations.length} transformations permanently!`)) return;
        if (!confirm('Are you absolutely sure? This cannot be undone.')) return;

        const result = await deleteAllTransformationsAction();
        if (result.error) {
            alert(`DELETE ALL FAILED: ${result.error}`);
        } else {
            setTransformations([]);
            alert('ALL TRANSFORMATIONS DELETED');
        }
    };

    return (
        <main className="min-h-screen bg-[#111] text-white font-mono p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Anime to Real <span className="text-accent">Manager</span>
                    </h1>
                    <p className="text-xs text-gray-500">Transformation Gallery Control Panel</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="px-4 py-2 bg-accent text-black hover:bg-white transition-colors uppercase text-xs font-bold"
                    >
                        {isCreating ? '✕ CANCEL' : '+ NEW TRANSFORMATION'}
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors uppercase text-xs font-bold"
                    >
                        🗑️ Delete All
                    </button>
                    <Link
                        href="/admin"
                        className="px-4 py-2 border border-[#333] hover:bg-white hover:text-black hover:border-white transition-colors uppercase text-xs"
                    >
                        ← BACK TO ADMIN
                    </Link>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Total Transformations</div>
                    <div className="text-3xl font-bold text-white">{transformations.length}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Status</div>
                    <div className="text-lg font-bold text-green-400">OPERATIONAL</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Storage</div>
                    <div className="text-lg font-bold text-accent">GITHUB</div>
                </div>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="border border-accent bg-[#0a0a0a] p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-6 uppercase">New Transformation</h2>

                    {error && (
                        <div className="mb-4 border border-red-500 bg-red-500/10 p-4">
                            <p className="text-xs text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Character Name */}
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">
                                Character Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                placeholder="e.g., Makima, Gojo, Nezuko..."
                                required
                            />
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Series */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Anime Series
                                </label>
                                <input
                                    type="text"
                                    value={series}
                                    onChange={(e) => setSeries(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g., Chainsaw Man"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as any)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors uppercase"
                                >
                                    <option value="cosplay">Cosplay</option>
                                    <option value="fanart">Fanart</option>
                                    <option value="2.5d">2.5D</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g., protagonist, popular"
                                />
                                <p className="text-[10px] text-gray-600 mt-1">Separate tags with commas</p>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Anime Image */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Anime Image <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-[#333] p-4 text-center hover:border-accent transition-colors">
                                    {animePreview ? (
                                        <div className="relative aspect-[4/5] w-full max-w-xs mx-auto">
                                            <Image src={animePreview} alt="Anime preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <Upload className="mx-auto mb-2 text-gray-600" size={32} />
                                            <p className="text-xs text-gray-500">Drop anime image here</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAnimeImageChange}
                                        className="hidden"
                                        id="anime-upload"
                                        required
                                    />
                                    <label
                                        htmlFor="anime-upload"
                                        className="inline-block mt-4 px-4 py-2 bg-black border border-[#333] text-xs uppercase cursor-pointer hover:bg-accent hover:text-black hover:border-accent transition-colors"
                                    >
                                        {animePreview ? 'Change Image' : 'Select Image'}
                                    </label>
                                </div>
                            </div>

                            {/* Real Image */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Real/Cosplay Image <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-[#333] p-4 text-center hover:border-accent transition-colors">
                                    {realPreview ? (
                                        <div className="relative aspect-[4/5] w-full max-w-xs mx-auto">
                                            <Image src={realPreview} alt="Real preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <Upload className="mx-auto mb-2 text-gray-600" size={32} />
                                            <p className="text-xs text-gray-500">Drop real/cosplay image here</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleRealImageChange}
                                        className="hidden"
                                        id="real-upload"
                                        required
                                    />
                                    <label
                                        htmlFor="real-upload"
                                        className="inline-block mt-4 px-4 py-2 bg-black border border-[#333] text-xs uppercase cursor-pointer hover:bg-accent hover:text-black hover:border-accent transition-colors"
                                    >
                                        {realPreview ? 'Change Image' : 'Select Image'}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Description (English)
                                </label>
                                <textarea
                                    value={descriptionEn}
                                    onChange={(e) => setDescriptionEn(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors h-24 resize-none"
                                    placeholder="Optional description..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Descripción (Español)
                                </label>
                                <textarea
                                    value={descriptionEs}
                                    onChange={(e) => setDescriptionEs(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors h-24 resize-none"
                                    placeholder="Descripción opcional..."
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-accent text-black font-bold uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'UPLOADING...' : '✓ CREATE TRANSFORMATION'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-8 py-4 border border-[#333] hover:bg-white hover:text-black transition-colors uppercase"
                            >
                                CANCEL
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Transformations List */}
            <section>
                <h2 className="text-2xl font-bold text-white uppercase mb-6">Current Transformations</h2>

                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>LOADING DATA FROM MAINFRAME...</p>
                    </div>
                ) : transformations.length === 0 ? (
                    <div className="border border-[#333] bg-[#0a0a0a] p-12 text-center">
                        <p className="text-gray-500 mb-4">NO TRANSFORMATIONS FOUND</p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-3 bg-accent text-black font-bold uppercase hover:bg-white transition-colors"
                        >
                            + CREATE FIRST TRANSFORMATION
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transformations.map((transformation) => (
                            <div key={transformation.id} className="border border-[#333] bg-[#0a0a0a] overflow-hidden group">
                                {/* Images Preview */}
                                <div className="grid grid-cols-2">
                                    <div className="relative aspect-[4/5] border-r border-[#333]">
                                        <Image
                                            src={transformation.animeImage}
                                            alt={`${transformation.characterName} - Anime`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 text-[10px] uppercase">
                                            Anime
                                        </div>
                                    </div>
                                    <div className="relative aspect-[4/5]">
                                        <Image
                                            src={transformation.realImage}
                                            alt={`${transformation.characterName} - Real`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-[10px] uppercase">
                                            Real
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4 border-t border-[#333]">
                                    <h3 className="font-bold text-accent mb-1">{transformation.characterName}</h3>
                                    <p className="text-xs text-gray-600 mb-2 font-mono">ID: {transformation.id}</p>
                                    {transformation.description && (
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                                            {transformation.description.en || transformation.description.es}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setEditingTransformation(transformation)}
                                            className="px-4 py-2 border border-accent/30 text-accent hover:bg-accent hover:text-black transition-colors uppercase text-xs flex items-center justify-center gap-2"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transformation)}
                                            className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors uppercase text-xs flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Transformation Editor Modal */}
            {editingTransformation && (
                <TransformationEditor
                    transformation={editingTransformation}
                    onCancel={() => setEditingTransformation(null)}
                    onSave={handleUpdate}
                />
            )}
        </main>
    );
}

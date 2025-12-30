'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { TransformationData } from './actions/transformations';
import { uploadTransformationImageAction } from './actions/transformations';

interface TransformationEditorProps {
    transformation: TransformationData;
    isNew?: boolean;
    onCancel: () => void;
    onSave: (transformation: TransformationData) => void;
}

export default function TransformationEditor({ transformation, isNew = false, onCancel, onSave }: TransformationEditorProps) {
    const [characterName, setCharacterName] = useState(transformation.characterName);
    const [series, setSeries] = useState(transformation.series || '');
    const [category, setCategory] = useState<'cosplay' | 'fanart' | '2.5d' | 'other'>(transformation.category || 'cosplay');
    const [tags, setTags] = useState(transformation.tags?.join(', ') || '');
    const [descriptionEn, setDescriptionEn] = useState(transformation.description?.en || '');
    const [descriptionEs, setDescriptionEs] = useState(transformation.description?.es || '');
    const [artistName, setArtistName] = useState(transformation.artist?.name || '');
    const [artistInstagram, setArtistInstagram] = useState(transformation.artist?.instagram || '');
    const [artistTwitter, setArtistTwitter] = useState(transformation.artist?.twitter || '');
    const [artistWebsite, setArtistWebsite] = useState(transformation.artist?.website || '');
    const [animeImage, setAnimeImage] = useState<File | null>(null);
    const [realImage, setRealImage] = useState<File | null>(null);
    const [animePreview, setAnimePreview] = useState(transformation.animeImage);
    const [realPreview, setRealPreview] = useState(transformation.realImage);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        if (!characterName) {
            alert('⚠️ Character name is required');
            return;
        }

        setIsSubmitting(true);

        try {
            let finalAnimeImage = transformation.animeImage;
            let finalRealImage = transformation.realImage;

            // Upload new images if selected
            if (animeImage) {
                const upload = await uploadTransformationImageAction(animeImage, 'anime');
                if (upload.error) throw new Error('Anime image upload failed');
                finalAnimeImage = upload.path!;
            }

            if (realImage) {
                const upload = await uploadTransformationImageAction(realImage, 'real');
                if (upload.error) throw new Error('Real image upload failed');
                finalRealImage = upload.path!;
            }

            const updatedTransformation: TransformationData = {
                ...transformation,
                characterName,
                series: series || undefined,
                category,
                tags: tags ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : undefined,
                artist: artistName ? {
                    name: artistName,
                    instagram: artistInstagram || undefined,
                    twitter: artistTwitter || undefined,
                    website: artistWebsite || undefined
                } : undefined,
                animeImage: finalAnimeImage,
                realImage: finalRealImage,
                description: descriptionEn || descriptionEs ? {
                    en: descriptionEn,
                    es: descriptionEs
                } : undefined,
            };

            onSave(updatedTransformation);
        } catch (err: any) {
            alert(`❌ ERROR: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-[#0a0a0a] border-2 border-accent w-full max-w-4xl my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-accent">
                    <h2 className="text-2xl font-bold uppercase">
                        {isNew ? 'New Transformation' : 'Edit Transformation'}
                    </h2>
                    <button onClick={onCancel} className="text-accent hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">Series</label>
                            <input
                                type="text"
                                value={series}
                                onChange={(e) => setSeries(e.target.value)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                placeholder="e.g., Chainsaw Man"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                            >
                                <option value="cosplay">Cosplay</option>
                                <option value="fanart">Fanart</option>
                                <option value="2.5d">2.5D</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                placeholder="e.g., protagonist, popular"
                            />
                        </div>
                    </div>

                    {/* Artist Information */}
                    <div className="border-2 border-[#333] p-4">
                        <h3 className="text-sm font-bold uppercase mb-4 text-gray-400">Artist / Cosplayer Credits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">Artist Name</label>
                                <input
                                    type="text"
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g., CosplayQueen"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">Instagram (username only)</label>
                                <input
                                    type="text"
                                    value={artistInstagram}
                                    onChange={(e) => setArtistInstagram(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g., cosplayqueen_official"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">Twitter (username only)</label>
                                <input
                                    type="text"
                                    value={artistTwitter}
                                    onChange={(e) => setArtistTwitter(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g., CQCosplay"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">Website URL</label>
                                <input
                                    type="url"
                                    value={artistWebsite}
                                    onChange={(e) => setArtistWebsite(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">
                                Anime Image {isNew && <span className="text-red-500">*</span>}
                            </label>
                            <div className="border border-[#333] p-4 text-center">
                                {animePreview && (
                                    <div className="relative aspect-[4/5] w-full max-w-xs mx-auto mb-2">
                                        <Image src={animePreview} alt="Anime" fill className="object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAnimeImageChange}
                                    className="hidden"
                                    id="edit-anime-upload"
                                />
                                <label
                                    htmlFor="edit-anime-upload"
                                    className="inline-block px-4 py-2 bg-black border border-[#333] text-xs uppercase cursor-pointer hover:bg-accent hover:text-black hover:border-accent transition-colors"
                                >
                                    {animeImage ? '✓ New Image Selected' : 'Change Image'}
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">
                                Real Image {isNew && <span className="text-red-500">*</span>}
                            </label>
                            <div className="border border-[#333] p-4 text-center">
                                {realPreview && (
                                    <div className="relative aspect-[4/5] w-full max-w-xs mx-auto mb-2">
                                        <Image src={realPreview} alt="Real" fill className="object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleRealImageChange}
                                    className="hidden"
                                    id="edit-real-upload"
                                />
                                <label
                                    htmlFor="edit-real-upload"
                                    className="inline-block px-4 py-2 bg-black border border-[#333] text-xs uppercase cursor-pointer hover:bg-accent hover:text-black hover:border-accent transition-colors"
                                >
                                    {realImage ? '✓ New Image Selected' : 'Change Image'}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">Description (English)</label>
                            <textarea
                                value={descriptionEn}
                                onChange={(e) => setDescriptionEn(e.target.value)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors h-20 resize-none"
                                placeholder="Optional description..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase mb-2 text-gray-400">Descripción (Español)</label>
                            <textarea
                                value={descriptionEs}
                                onChange={(e) => setDescriptionEs(e.target.value)}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors h-20 resize-none"
                                placeholder="Descripción opcional..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 p-6 border-t border-[#333]">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-accent text-black font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'SAVING...' : '✓ SAVE CHANGES'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-8 py-3 border border-[#333] hover:bg-white hover:text-black transition-colors uppercase"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}

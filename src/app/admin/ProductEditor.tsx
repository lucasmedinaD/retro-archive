'use client';

import { useState } from 'react';
import { updateProductAction, createProductAction } from './actions';
import { uploadImageToCloud } from '@/lib/uploadHelper';
import Image from 'next/image';
import { X, Upload, Save, Loader2, Link as LinkIcon, DollarSign, Tag } from 'lucide-react';

interface ProductEditorProps {
    product: any;
    onCancel: () => void;
    onSave: (p: any) => void;
    isNew?: boolean;
}

export default function ProductEditor({ product, onCancel, onSave, isNew }: ProductEditorProps) {
    // State management mirroring TransformationEditor style
    const [nameEn, setNameEn] = useState(product.name_en || product.name || '');
    const [nameEs, setNameEs] = useState(product.name_es || '');
    const [descriptionEn, setDescriptionEn] = useState(product.description_en || product.description || '');
    const [descriptionEs, setDescriptionEs] = useState(product.description_es || '');

    const [price, setPrice] = useState(product.price || '');
    const [category, setCategory] = useState(product.category || 'DESIGN');
    const [buyUrl, setBuyUrl] = useState(product.buyUrl || '');
    const [tags, setTags] = useState(Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '');
    const [isFeatured, setIsFeatured] = useState(product.featured || false);

    // Image handling
    const [imagePreview, setImagePreview] = useState(product.image || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create local preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!nameEn || !price) {
            alert('Please fill in at least Name (English) and Price');
            return;
        }

        setIsSaving(true);

        try {
            let finalImageUrl = product.image;

            // 1. Upload new image if selected
            if (imageFile) {
                const uploadResult = await uploadImageToCloud(
                    imageFile,
                    'products',
                    { title: nameEn || 'product', prefix: 'prod' }
                );

                if (!uploadResult.success || !uploadResult.publicUrl) {
                    throw new Error(uploadResult.error || 'Failed to upload image');
                }
                finalImageUrl = uploadResult.publicUrl;
            }

            // 2. Prepare payload
            const payload = {
                ...product,
                name: nameEn, // Default name
                name_en: nameEn,
                name_es: nameEs,
                description: descriptionEn, // Default desc
                description_en: descriptionEn,
                description_es: descriptionEs,
                price,
                category,
                buyUrl,
                tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                featured: isFeatured,
                image: finalImageUrl
            };

            // 3. Save via server action
            const result = isNew
                ? await createProductAction(payload)
                // @ts-ignore - TS doesn't know update returns same shape
                : await updateProductAction(payload);

            // @ts-ignore
            if (result?.error) {
                // @ts-ignore
                throw new Error(result.error);
            }

            // @ts-ignore
            onSave(result?.product || payload);
            onCancel();

        } catch (error: any) {
            console.error(error);
            alert(`ERROR: ${error.message || 'Failed to save product'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border-2 border-accent w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[8px_8px_0px_rgba(255,51,51,0.5)]">

                {/* Header */}
                <div className="bg-accent text-white p-4 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-xl uppercase tracking-widest flex items-center gap-2">
                        {isNew ? <Upload size={20} /> : <Save size={20} />}
                        {isNew ? 'New Product Protocol' : `Edit Protocol: ${product.id}`}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-black/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 grid md:grid-cols-2 gap-8">

                    {/* Left Column: Media & Core Info */}
                    <div className="space-y-6">
                        {/* Image Uploader */}
                        <div className="space-y-2">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider uppercase">Product Image</label>
                            <div
                                className="relative aspect-square w-full rounded-lg bg-[#222] border-2 border-dashed border-[#444] hover:border-accent transition-colors group cursor-pointer overflow-hidden"
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                {imagePreview ? (
                                    <>
                                        {/* Use img for natural aspect ratio preview or cover */}
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover group-hover:opacity-75 transition-opacity"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
                                                <Upload size={24} className="text-white" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2">
                                        <Upload size={32} />
                                        <span className="text-xs font-mono">CLICK TO UPLOAD</span>
                                    </div>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono text-center">
                                Recommended: Square (1:1) or Portrait logic
                            </p>
                        </div>

                        {/* Featured Toggle */}
                        <div className="p-4 bg-[#222] rounded-lg border border-[#333] flex items-center justify-between">
                            <span className="text-white font-bold text-sm">FEATURED ITEM</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-4">

                        {/* Core Details Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-white/60 text-xs font-mono font-bold tracking-wider">PRICE</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full bg-[#222] border border-[#333] p-3 pl-8 text-white focus:border-accent outline-none font-mono rounded"
                                        placeholder="29.99"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-white/60 text-xs font-mono font-bold tracking-wider">CATEGORY</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#222] border border-[#333] p-3 text-white focus:border-accent outline-none font-mono rounded appearance-none"
                                >
                                    <option value="DESIGN">DESIGN</option>
                                    <option value="APPAREL">APPAREL</option>
                                    <option value="ACCESSORY">ACCESSORY</option>
                                    <option value="PRINT">PRINT</option>
                                </select>
                            </div>
                        </div>

                        {/* Names */}
                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">NAME (ENGLISH)</label>
                            <input
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                className="w-full bg-[#222] border border-[#333] p-3 text-white focus:border-accent outline-none font-bold rounded placeholder:font-normal"
                                placeholder="e.g., Cyber Demon Tee"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">NAME (ESPAÑOL)</label>
                            <input
                                value={nameEs}
                                onChange={(e) => setNameEs(e.target.value)}
                                className="w-full bg-[#222] border border-[#333] p-3 text-white focus:border-accent outline-none font-bold rounded placeholder:font-normal"
                                placeholder="e.g., Camiseta Cyber Demon"
                            />
                        </div>

                        {/* Descriptions */}
                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">DESCRIPTION (ENGLISH)</label>
                            <textarea
                                value={descriptionEn}
                                onChange={(e) => setDescriptionEn(e.target.value)}
                                className="w-full bg-[#222] border border-[#333] p-3 text-white focus:border-accent outline-none rounded resize-none min-h-[80px]"
                                placeholder="Product details..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">DESCRIPTION (ESPAÑOL)</label>
                            <textarea
                                value={descriptionEs}
                                onChange={(e) => setDescriptionEs(e.target.value)}
                                className="w-full bg-[#222] border border-[#333] p-3 text-white focus:border-accent outline-none rounded resize-none min-h-[80px]"
                                placeholder="Detalles del producto..."
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">BUY LINK (REDBUBBLE/AMAZON)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    value={buyUrl}
                                    onChange={(e) => setBuyUrl(e.target.value)}
                                    className="w-full bg-[#222] border border-[#333] p-3 pl-8 text-blue-400 focus:border-accent outline-none font-mono text-sm rounded"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                            <label className="text-white/60 text-xs font-mono font-bold tracking-wider">TAGS</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-[#222] border border-[#333] p-3 pl-8 text-white focus:border-accent outline-none font-mono text-xs rounded"
                                    placeholder="cyberpunk, anime, glitch (comma separated)"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#333] bg-[#0a0a0a] flex justify-end gap-4 shrink-0">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="px-6 py-3 text-gray-400 hover:text-white font-mono uppercase text-sm tracking-wider transition-colors"
                    >
                        Cancel / Abort
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-accent hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving && <Loader2 size={16} className="animate-spin" />}
                        {isSaving ? 'Processing...' : 'Commit Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

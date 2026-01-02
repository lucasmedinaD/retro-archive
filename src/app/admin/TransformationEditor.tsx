'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Upload, ExternalLink } from 'lucide-react';
import { TransformationData } from './actions/transformations';
import { uploadImageToCloud, getStoredAdminPassword } from '@/lib/uploadHelper';
import { getProducts, Product } from '@/data/products';
import { AmazonProduct } from '@/types/transformations';

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
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
        transformation.outfit?.map((p: any) => p.id) || []
    );
    const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>(
        transformation.amazonProducts || []
    );
    const [newAmazonProduct, setNewAmazonProduct] = useState<Partial<AmazonProduct>>({
        title: '',
        image: '',
        affiliateUrl: '',
        price: '',
        category: 'figure'
    });
    const [amazonImageFile, setAmazonImageFile] = useState<File | null>(null);
    const [amazonImagePreview, setAmazonImagePreview] = useState<string>('');

    // Get all available products
    const allProducts = getProducts('en'); // Use 'en' as default for admin

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
                const upload = await uploadImageToCloud(animeImage, 'transformations', getStoredAdminPassword());
                if (!upload.success) throw new Error('Anime image upload failed: ' + upload.error);
                finalAnimeImage = upload.path!;
            }

            if (realImage) {
                const upload = await uploadImageToCloud(realImage, 'transformations', getStoredAdminPassword());
                if (!upload.success) throw new Error('Real image upload failed: ' + upload.error);
                finalRealImage = upload.path!;
            }

            // Get full product objects for selected IDs
            const selectedProducts = selectedProductIds
                .map(id => allProducts.find(p => p.id === id))
                .filter(Boolean) as Product[];

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
                outfit: selectedProducts.length > 0 ? selectedProducts : undefined,
                amazonProducts: amazonProducts.length > 0 ? amazonProducts : undefined,
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

                    {/* Related Products */}
                    <div className="border-2 border-[#333] p-4 mt-6">
                        <h3 className="text-sm font-bold uppercase mb-4 text-gray-400">Related Products (Affiliate Links)</h3>

                        {/* Product Selector */}
                        <div className="mb-4">
                            <label className="block text-xs uppercase mb-2 text-gray-400">Add Products</label>
                            <select
                                onChange={(e) => {
                                    const productId = e.target.value;
                                    if (productId && !selectedProductIds.includes(productId)) {
                                        setSelectedProductIds([...selectedProductIds, productId]);
                                    }
                                    e.target.value = '';
                                }}
                                className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-accent transition-colors"
                            >
                                <option value="">-- Select a product to add --</option>
                                {allProducts
                                    .filter(p => !selectedProductIds.includes(p.id))
                                    .map(product => {
                                        const displayName = product.name || product.name_en || product.name_es || product.id;
                                        return (
                                            <option key={product.id} value={product.id}>
                                                {displayName} - ${product.price}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>

                        {/* Selected Products Preview */}
                        {selectedProductIds.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 mb-2">
                                    {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
                                </p>
                                {selectedProductIds.map(productId => {
                                    const product = allProducts.find(p => p.id === productId);
                                    if (!product) return null;
                                    const displayName = product.name || product.name_en || product.name_es || product.id;

                                    return (
                                        <div key={productId} className="flex items-center gap-3 bg-black border border-[#333] p-3">
                                            {/* Product Image */}
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={displayName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{displayName}</p>
                                                <p className="text-xs text-gray-500">${product.price}</p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => setSelectedProductIds(selectedProductIds.filter(id => id !== productId))}
                                                className="p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Remove product"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Amazon Affiliate Products */}
                    <div className="border-2 border-[#FF9900] p-4 mt-6">
                        <h3 className="text-sm font-bold uppercase mb-4 text-[#FF9900]">
                            🛒 Amazon Affiliate Products
                        </h3>

                        {/* Add New Amazon Product Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Product Title"
                                value={newAmazonProduct.title || ''}
                                onChange={(e) => setNewAmazonProduct({ ...newAmazonProduct, title: e.target.value })}
                                className="bg-black border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF9900]"
                            />
                            {/* Image Upload */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="amazon-product-image"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setAmazonImageFile(file);
                                            const reader = new FileReader();
                                            reader.onloadend = () => setAmazonImagePreview(reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="amazon-product-image"
                                    className="flex-1 bg-black border border-[#333] p-2 text-gray-400 text-sm cursor-pointer hover:border-[#FF9900] transition-colors text-center"
                                >
                                    {amazonImageFile ? '✓ ' + amazonImageFile.name.slice(0, 20) : '📷 Upload Image'}
                                </label>
                                {amazonImagePreview && (
                                    <img src={amazonImagePreview} alt="Preview" className="w-10 h-10 object-cover border border-[#FF9900]" />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Amazon Affiliate URL (with your tag)"
                                value={newAmazonProduct.affiliateUrl || ''}
                                onChange={(e) => setNewAmazonProduct({ ...newAmazonProduct, affiliateUrl: e.target.value })}
                                className="bg-black border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF9900] md:col-span-2"
                            />
                            <input
                                type="text"
                                placeholder="Price (e.g. $29.99)"
                                value={newAmazonProduct.price || ''}
                                onChange={(e) => setNewAmazonProduct({ ...newAmazonProduct, price: e.target.value })}
                                className="bg-black border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF9900]"
                            />
                            <select
                                value={newAmazonProduct.category || 'figure'}
                                onChange={(e) => setNewAmazonProduct({ ...newAmazonProduct, category: e.target.value as AmazonProduct['category'] })}
                                className="bg-black border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF9900]"
                            >
                                <option value="figure">🗿 Figure</option>
                                <option value="manga">📚 Manga</option>
                                <option value="cosplay">👘 Cosplay</option>
                                <option value="accessory">💍 Accessory</option>
                                <option value="other">🎁 Other</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={async () => {
                                if (newAmazonProduct.title && amazonImageFile && newAmazonProduct.affiliateUrl) {
                                    try {
                                        // Upload image first
                                        const upload = await uploadImageToCloud(amazonImageFile, 'products', getStoredAdminPassword());
                                        if (!upload.success) {
                                            alert('Image upload failed: ' + upload.error);
                                            return;
                                        }

                                        // Add product with uploaded image path
                                        const productWithImage: AmazonProduct = {
                                            title: newAmazonProduct.title,
                                            image: upload.path!,
                                            affiliateUrl: newAmazonProduct.affiliateUrl,
                                            price: newAmazonProduct.price || '',
                                            category: newAmazonProduct.category || 'figure'
                                        };

                                        setAmazonProducts([...amazonProducts, productWithImage]);
                                        setNewAmazonProduct({ title: '', image: '', affiliateUrl: '', price: '', category: 'figure' });
                                        setAmazonImageFile(null);
                                        setAmazonImagePreview('');
                                    } catch (err: any) {
                                        alert('Error: ' + err.message);
                                    }
                                } else {
                                    alert('Title, Image, and Affiliate URL are required');
                                }
                            }}
                            className="px-4 py-2 bg-[#FF9900] text-black font-bold text-xs uppercase hover:bg-[#cc7a00] transition-colors"
                        >
                            + Add Amazon Product
                        </button>

                        {/* Added Amazon Products List - Always visible */}
                        <div className="mt-4 border-t border-[#FF9900]/30 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-[#FF9900]">
                                    📦 Productos Agregados: {amazonProducts.length}
                                </h4>
                            </div>

                            {amazonProducts.length === 0 ? (
                                <p className="text-xs text-gray-500 italic py-4 text-center border border-dashed border-[#333]">
                                    No hay productos Amazon agregados aún
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {amazonProducts.map((product, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#FF9900]/30 p-3 rounded">
                                            {/* Product Image */}
                                            <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate text-white">{product.title}</p>
                                                <p className="text-xs text-[#FF9900]">{product.price || 'Sin precio'} • {product.category}</p>
                                                <a href={product.affiliateUrl} target="_blank" rel="noopener" className="text-[10px] text-gray-500 hover:text-[#FF9900] truncate block">
                                                    {product.affiliateUrl.slice(0, 40)}...
                                                </a>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => setAmazonProducts(amazonProducts.filter((_, i) => i !== index))}
                                                className="p-2 text-red-500 hover:bg-red-500/20 transition-colors rounded"
                                                title="Eliminar producto"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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

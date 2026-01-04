'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, ExternalLink } from 'lucide-react';
import { TransformationExtended as TransformationData } from '@/types/transformations';
import { uploadImageToCloud } from '@/lib/uploadHelper';
import { getProducts, Product } from '@/data/products';
import { AmazonProduct } from '@/types/transformations';
import { fetchAmazonProductsAction, StoredAmazonProduct } from './actions/amazonProducts';
import ImageCropperModal from '@/components/ImageCropperModal';

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
    const [catalogProducts, setCatalogProducts] = useState<StoredAmazonProduct[]>([]);

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string>('');
    const [cropTarget, setCropTarget] = useState<'anime' | 'real' | 'secret' | null>(null);

    // Easter Egg: Secret Photo State
    const [secretImage, setSecretImage] = useState<File | null>(null);
    const [secretPreview, setSecretPreview] = useState(transformation.secretImage || '');
    const [secretPosition, setSecretPosition] = useState<number>(transformation.secretPosition || 50);

    // Get all available products
    const allProducts = getProducts('en'); // Use 'en' as default for admin

    // Load Amazon products catalog on mount
    useEffect(() => {
        const loadCatalog = async () => {
            const result = await fetchAmazonProductsAction();
            if (result.success && result.data) {
                setCatalogProducts(result.data);
            }
        };
        loadCatalog();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, target: 'anime' | 'real' | 'secret') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropImageSrc(reader.result as string);
                setCropTarget(target);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        e.target.value = '';
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        if (!cropTarget) return;

        const file = new File([croppedBlob], `${cropTarget}-cropped.jpg`, { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(croppedBlob);

        if (cropTarget === 'anime') {
            setAnimeImage(file);
            setAnimePreview(previewUrl);
        } else if (cropTarget === 'real') {
            setRealImage(file);
            setRealPreview(previewUrl);
        } else if (cropTarget === 'secret') {
            setSecretImage(file);
            setSecretPreview(previewUrl);
        }

        setCropModalOpen(false);
        setCropImageSrc('');
        setCropTarget(null);
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
            let finalSecretImage = transformation.secretImage;

            // Upload new images if selected
            if (animeImage) {
                const upload = await uploadImageToCloud(animeImage, 'transformations');
                if (!upload.success) throw new Error('Anime image upload failed: ' + upload.error);
                finalAnimeImage = upload.publicUrl!;
            }

            if (realImage) {
                const upload = await uploadImageToCloud(realImage, 'transformations');
                if (!upload.success) throw new Error('Real image upload failed: ' + upload.error);
                finalRealImage = upload.publicUrl!;
            }

            // Upload secret image if selected
            if (secretImage) {
                const upload = await uploadImageToCloud(secretImage, 'transformations');
                if (!upload.success) throw new Error('Secret image upload failed: ' + upload.error);
                finalSecretImage = upload.publicUrl!;
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
                secretImage: finalSecretImage,
                secretPosition: secretPosition || undefined
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
                                    onChange={(e) => handleImageSelect(e, 'anime')}
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
                                    onChange={(e) => handleImageSelect(e, 'real')}
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase text-[#FF9900]">
                                🛒 Amazon Affiliate Products
                            </h3>
                            <a
                                href="/admin/amazon-products"
                                target="_blank"
                                className="text-xs text-[#FF9900] hover:underline"
                            >
                                Manage Catalog →
                            </a>
                        </div>

                        {/* Product Selector from Catalog */}
                        <div className="mb-4">
                            <label className="block text-xs uppercase mb-2 text-gray-400">
                                Add from Catalog ({catalogProducts.length} available)
                            </label>
                            <select
                                onChange={(e) => {
                                    const productId = e.target.value;
                                    const catalogProduct = catalogProducts.find(p => p.id === productId);
                                    if (catalogProduct) {
                                        // Check if already added
                                        const alreadyAdded = amazonProducts.some(p =>
                                            p.title === catalogProduct.title && p.affiliateUrl === catalogProduct.affiliateUrl
                                        );
                                        if (!alreadyAdded) {
                                            setAmazonProducts([...amazonProducts, {
                                                title: catalogProduct.title,
                                                image: catalogProduct.image,
                                                affiliateUrl: catalogProduct.affiliateUrl,
                                                price: catalogProduct.price || '',
                                                category: catalogProduct.category
                                            }]);
                                        } else {
                                            alert('Este producto ya está agregado');
                                        }
                                    }
                                    e.target.value = '';
                                }}
                                className="w-full bg-black border border-[#FF9900]/50 p-3 text-white outline-none focus:border-[#FF9900] transition-colors"
                            >
                                <option value="">-- Seleccionar producto del catálogo --</option>
                                {catalogProducts.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.title} - {product.price || 'Sin precio'} ({product.category})
                                    </option>
                                ))}
                            </select>
                            {catalogProducts.length === 0 && (
                                <p className="text-xs text-gray-500 mt-2">
                                    No hay productos en el catálogo. <a href="/admin/amazon-products" target="_blank" className="text-[#FF9900] hover:underline">Crear productos →</a>
                                </p>
                            )}
                        </div>

                        {/* Added Products List */}
                        <div className="border-t border-[#FF9900]/30 pt-4">
                            <h4 className="text-sm font-bold text-[#FF9900] mb-3">
                                📦 Productos Agregados: {amazonProducts.length}
                            </h4>

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

                    {/* Easter Egg: Secret Photo Unlock (Optional) */}
                    <div className="border-2 border-yellow-500/30 bg-yellow-500/5 p-4">
                        <h3 className="text-sm font-bold uppercase mb-4 text-yellow-400 flex items-center gap-2">
                            🎮 Easter Egg: Secret Photo Unlock (Optional)
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">
                            Upload a secret bonus photo and set the slider position where it unlocks. Users must find it!
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Secret Photo Upload */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-yellow-400">
                                    Secret Bonus Photo
                                </label>
                                <div className="border border-yellow-500/30 p-4 text-center bg-black/50">
                                    {secretPreview && (
                                        <div className="relative aspect-[4/5] w-full max-w-xs mx-auto mb-2">
                                            <Image src={secretPreview} alt="Secret" fill className="object-cover" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageSelect(e, 'secret')}
                                        className="hidden"
                                        id="edit-secret-upload"
                                    />
                                    <label
                                        htmlFor="edit-secret-upload"
                                        className="inline-block px-4 py-2 bg-black border border-yellow-500/50 text-xs uppercase cursor-pointer hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-colors"
                                    >
                                        {secretImage ? '✓ Secret Photo Selected' : 'Upload Secret'}
                                    </label>
                                </div>
                            </div>

                            {/* Secret Position Slider */}
                            <div>
                                <label className="block text-xs uppercase mb-2 text-yellow-400">
                                    Secret Trigger Position (0-100%)
                                </label>
                                <div className="border border-yellow-500/30 p-4 bg-black/50">
                                    <div className="text-center mb-4">
                                        <span className="text-4xl font-black text-yellow-400">{secretPosition}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={secretPosition}
                                        onChange={(e) => setSecretPosition(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Where should the slider be to trigger the unlock? (±10% tolerance)
                                    </p>
                                </div>
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

            {/* Cropper Modal */}
            <ImageCropperModal
                isOpen={cropModalOpen}
                onClose={() => setCropModalOpen(false)}
                imageSrc={cropImageSrc}
                aspect={4 / 5}
                onCropComplete={handleCropComplete}
            />
        </div>
    );
}

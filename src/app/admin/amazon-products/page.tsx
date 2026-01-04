'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, Upload, Trash2, Edit, ExternalLink } from 'lucide-react';
import {
    fetchAmazonProductsAction,
    createAmazonProductAction,
    deleteAmazonProductAction,
    updateAmazonProductAction,
    StoredAmazonProduct
} from '../actions/amazonProducts';
import { uploadImageToCloud } from '@/lib/uploadHelper';
import { AmazonProduct } from '@/types/transformations';

export default function AmazonProductsPage() {
    const [products, setProducts] = useState<StoredAmazonProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingProduct, setEditingProduct] = useState<StoredAmazonProduct | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [affiliateUrl, setAffiliateUrl] = useState('');
    const [category, setCategory] = useState<AmazonProduct['category']>('figure');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        const result = await fetchAmazonProductsAction();
        if (result.success && result.data) {
            setProducts(result.data);
        } else if (result.error) {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setTitle('');
        setPrice('');
        setAffiliateUrl('');
        setCategory('figure');
        setImageFile(null);
        setImagePreview('');
        setIsCreating(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !affiliateUrl) {
            alert('Title and Affiliate URL are required');
            return;
        }

        if (!editingProduct && !imageFile) {
            alert('Image is required for new products');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            let imagePath = editingProduct?.image || '';

            // Upload new image if provided
            if (imageFile) {
                const upload = await uploadImageToCloud(imageFile, 'amazon-products');
                if (!upload.success) throw new Error('Image upload failed: ' + upload.error);
                imagePath = upload.path!;
            }

            if (editingProduct) {
                // Update existing product
                const result = await updateAmazonProductAction(editingProduct.id, {
                    title,
                    price,
                    affiliateUrl,
                    category,
                    image: imagePath
                });
                if (!result.success) throw new Error(result.error);
            } else {
                // Create new product
                const result = await createAmazonProductAction({
                    title,
                    price,
                    affiliateUrl,
                    category,
                    image: imagePath
                });
                if (!result.success) throw new Error(result.error);
            }

            await loadProducts();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este producto?')) return;

        const result = await deleteAmazonProductAction(id);
        if (result.success) {
            await loadProducts();
        } else {
            setError(result.error || 'Error deleting product');
        }
    };

    const startEdit = (product: StoredAmazonProduct) => {
        setEditingProduct(product);
        setTitle(product.title);
        setPrice(product.price || '');
        setAffiliateUrl(product.affiliateUrl);
        setCategory(product.category);
        setImagePreview(product.image);
        setIsCreating(true);
    };

    const categoryEmojis: Record<AmazonProduct['category'], string> = {
        figure: '🗿',
        manga: '📚',
        cosplay: '👘',
        accessory: '💍',
        other: '🎁'
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-[#FF9900]">🛒 Amazon Products Catalog</h1>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-[#FF9900] text-black font-bold uppercase hover:bg-[#cc7a00] transition-colors"
                >
                    + New Product
                </button>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500 p-4 mb-6 text-red-400">
                    {error}
                </div>
            )}

            {/* Product Form Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0a0a0a] border-2 border-[#FF9900] w-full max-w-lg">
                        <div className="flex justify-between items-center p-4 border-b border-[#FF9900]">
                            <h2 className="text-xl font-bold text-[#FF9900]">
                                {editingProduct ? '✏️ Edit Product' : '➕ New Product'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-[#FF9900]"
                                    placeholder="e.g., Makima Figure - Chainsaw Man"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase mb-2 text-gray-400">Price</label>
                                    <input
                                        type="text"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-[#FF9900]"
                                        placeholder="$29.99"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase mb-2 text-gray-400">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as AmazonProduct['category'])}
                                        className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-[#FF9900]"
                                    >
                                        <option value="figure">🗿 Figure</option>
                                        <option value="manga">📚 Manga</option>
                                        <option value="cosplay">👘 Cosplay</option>
                                        <option value="accessory">💍 Accessory</option>
                                        <option value="other">🎁 Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Affiliate URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={affiliateUrl}
                                    onChange={(e) => setAffiliateUrl(e.target.value)}
                                    className="w-full bg-black border border-[#333] p-3 text-white outline-none focus:border-[#FF9900]"
                                    placeholder="https://amazon.com/dp/XXX?tag=yourtag"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase mb-2 text-gray-400">
                                    Image {!editingProduct && <span className="text-red-500">*</span>}
                                </label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="relative w-20 h-20 bg-white rounded overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="product-image"
                                    />
                                    <label
                                        htmlFor="product-image"
                                        className="flex-1 px-4 py-3 bg-black border border-[#333] text-center cursor-pointer hover:border-[#FF9900] transition-colors"
                                    >
                                        <Upload size={16} className="inline mr-2" />
                                        {imageFile ? imageFile.name.slice(0, 20) : 'Upload Image'}
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-[#FF9900] text-black font-bold uppercase hover:bg-[#cc7a00] transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-[#333] hover:bg-white hover:text-black transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-[#333]">
                    <p className="text-gray-400 mb-4">No Amazon products yet</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 bg-[#FF9900] text-black font-bold"
                    >
                        Create First Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="bg-[#111] border border-[#FF9900]/30 p-4 group hover:border-[#FF9900] transition-colors">
                            {/* Image */}
                            <div className="relative aspect-square bg-white rounded mb-3 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                                <span className="absolute top-2 right-2 bg-[#FF9900] text-black text-xs px-2 py-1 font-bold">
                                    {categoryEmojis[product.category]} {product.category}
                                </span>
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-sm mb-1 truncate">{product.title}</h3>
                            <p className="text-[#FF9900] font-bold mb-2">{product.price || 'Sin precio'}</p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(product)}
                                    className="flex-1 py-2 bg-[#222] hover:bg-[#FF9900] hover:text-black transition-colors text-xs uppercase font-bold"
                                >
                                    <Edit size={14} className="inline mr-1" /> Edit
                                </button>
                                <a
                                    href={product.affiliateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-2 px-3 bg-[#222] hover:bg-white hover:text-black transition-colors"
                                >
                                    <ExternalLink size={14} />
                                </a>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="py-2 px-3 bg-[#222] hover:bg-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                Total: {products.length} product{products.length !== 1 ? 's' : ''} in catalog
            </div>
        </div>
    );
}

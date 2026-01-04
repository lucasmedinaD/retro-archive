'use client';

import { logoutAction, deleteProductAction, deleteAllProductsAction } from './actions';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import SettingsEditor from './SettingsEditor';
import { Product } from '@/data/products';

import productsRaw from '@/data/products.json';
import settingsRaw from '@/data/settings.json';
import { useEffect } from 'react';
import { fetchLatestInventory } from './actions';

export default function AdminDashboard() {
    // Initial state from build-time file (instant load)
    const [products, setProducts] = useState<Product[]>((productsRaw?.en || []) as Product[]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

    // Filter products based on search
    const filteredProducts = products.filter(p => {
        const displayName = p.name || p.name_en || p.name_es || p.id;
        return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDelete = async (product: Product) => {
        if (!confirm(`⚠️ DELETE UNIT ${product.id}?\n\nThis action cannot be undone.`)) return;

        const result = await deleteProductAction(product.id);
        if (result?.error) {
            alert(`DELETE FAILED: ${result.error}`);
        } else {
            setProducts(prev => prev.filter(p => p.id !== product.id));
            alert('DELETE SUCCESSFUL');
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm(`⚠️ DELETE ALL PRODUCTS?\n\nThis will remove ${products.length} products permanently!`)) return;
        if (!confirm('Are you absolutely sure? Type DELETE in the next prompt.')) return;

        const result = await deleteAllProductsAction();
        if (result?.error) {
            alert(`DELETE ALL FAILED: ${result.error}`);
        } else {
            setProducts([]);
            alert('ALL PRODUCTS DELETED');
        }
    };

    // Sync with GitHub on mount (to show latest commits even if Vercel is building)
    useEffect(() => {
        const sync = async () => {
            const result = await fetchLatestInventory();
            // @ts-ignore
            if (result?.success && result.data) {
                // @ts-ignore
                setProducts(result.data);
            }
        };
        sync();
    }, []);

    return (
        <main className="min-h-screen bg-[#111] text-accent font-mono p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Admin <span className="text-accent">Console</span>
                    </h1>
                    <p className="text-xs text-gray-500">Access Level: 0 (ROOT) | Connected to GitHub</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-accent text-black hover:bg-white transition-colors uppercase text-xs font-bold"
                    >
                        + NEW PRODUCT
                    </button>
                    <Link
                        href="/admin/transformations"
                        className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-500 transition-colors uppercase text-xs font-bold flex items-center gap-2"
                    >
                        🎭 TRANSFORMATIONS
                    </Link>
                    <Link
                        href="/admin/amazon-products"
                        className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-400 transition-colors uppercase text-xs font-bold flex items-center gap-2"
                    >
                        📦 AMAZON
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="px-4 py-2 bg-black border border-accent text-accent hover:bg-accent hover:text-black transition-colors uppercase text-xs font-bold flex items-center gap-2"
                    >
                        ⚙️ SETTINGS
                    </Link>
                    <form action={logoutAction}>
                        <button className="px-4 py-2 border border-[#333] hover:bg-white hover:text-black hover:border-white transition-colors uppercase text-xs">
                            Terminate Session
                        </button>
                    </form>
                </div>
            </header>

            {/* Stats / Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Total Units</div>
                    <div className="text-3xl font-bold text-white">{products.length}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Design</div>
                    <div className="text-3xl font-bold text-accent">{products.filter(p => p.category === 'DESIGN').length}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Art</div>
                    <div className="text-3xl font-bold text-accent">{products.filter(p => p.category === 'ART').length}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Digital</div>
                    <div className="text-3xl font-bold text-accent">{products.filter(p => p.category === 'DIGITAL').length}</div>
                </div>
            </div>

            {/* Inventory List */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white uppercase">Inventory Matrix</h2>
                    <button
                        onClick={handleDeleteAll}
                        className="border border-red-500 text-red-500 px-4 py-2 font-bold uppercase hover:bg-red-500 hover:text-white transition-colors text-xs"
                    >
                        🗑️ Delete All
                    </button>
                </div>

                <div className="border border-[#333] bg-[#0a0a0a]">
                    <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-[#333] text-xs uppercase text-gray-500 font-bold">
                        <div>Visual</div>
                        <div>ID / Name</div>
                        <div>Category</div>
                        <div>Link Target</div>
                        <div>Action</div>
                    </div>

                    {filteredProducts.map((product) => (
                        <div key={product.id} className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-[#333] items-center hover:bg-[#1a1a1a] transition-colors group">
                            <div className="relative w-12 h-12 border border-[#333] overflow-hidden bg-black">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="text-xs text-accent mb-1">{product.id}</div>
                                <div className="font-bold text-white">{product.name || product.name_en || product.name_es || product.id}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="border border-[#333] px-2 py-1 rounded-none">{product.category}</span>
                            </div>
                            <div className="text-xs text-gray-600 truncate font-mono">
                                {product.buyUrl}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="text-xs text-white underline hover:no-underline hover:text-accent"
                                >
                                    EDIT
                                </button>
                                <span className="text-gray-600">|</span>
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="text-xs text-red-500 underline hover:no-underline hover:text-red-400"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {
                editingProduct && (
                    <ProductEditor
                        product={editingProduct}
                        onCancel={() => setEditingProduct(null)}
                        onSave={(updatedProduct) => {
                            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                            alert('UPDATE SUCCESSFUL');
                        }}
                    />
                )
            }

            {
                isCreating && (
                    <ProductEditor
                        product={{
                            id: '',
                            name: '',
                            price: '$0.00',
                            image: '',
                            buyUrl: 'https://www.redbubble.com/',
                            category: 'DESIGN',
                            description: ''
                        }}
                        isNew={true}
                        onCancel={() => setIsCreating(false)}
                        onSave={(newProduct) => {
                            setProducts(prev => [...prev, newProduct]);
                            alert('PRODUCT CREATED');
                            setIsCreating(false);
                        }}
                    />
                )
            }
        </main >
    );
}

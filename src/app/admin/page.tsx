'use client';

import { logoutAction } from './actions';
import Image from 'next/image';
import { useState } from 'react';
import ProductEditor from './ProductEditor';
import { Product } from '@/data/products';

// This is a client component now receiving data via props or just importing directly (since it's a file read)
// However, direct file read of 'src/data/json' works in Server Components better.
// Let's keep it simple: We fetch the data via a server action or we accept that for this MVP
// we import the JSON directly which works in Client Components during build time (static).
// For real dynamic updates without rebuild, we need to fetch from an API route.
// BUT, since we are REWRITING the file, the next build will have new data.
// For instant gratification, we can update local state.

import productsRaw from '@/data/products.json';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>((productsRaw?.en || []) as Product[]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
                    <div className="text-xs text-gray-500 uppercase mb-2">Systems Online</div>
                    <div className="text-3xl font-bold text-green-500">100%</div>
                </div>
                {/* Placeholder stats */}
                <div className="border border-[#333] p-6 bg-black/50 opacity-50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Traffic</div>
                    <div className="text-3xl font-bold text-white">---</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50 opacity-50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Sales</div>
                    <div className="text-3xl font-bold text-white">---</div>
                </div>
            </div>

            {/* Inventory List */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-white uppercase">Inventory Matrix</h2>
                    <button className="bg-accent text-white px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors text-xs tracking-widest">
                        + Initialize New Unit
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

                    {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-[#333] items-center hover:bg-[#1a1a1a] transition-colors group">
                            <div className="relative w-12 h-12 border border-[#333] overflow-hidden bg-black">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="text-xs text-accent mb-1">{product.id}</div>
                                <div className="font-bold text-white">{product.name}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="border border-[#333] px-2 py-1 rounded-none">{product.category}</span>
                            </div>
                            <div className="text-xs text-gray-600 truncate font-mono">
                                {product.buyUrl}
                            </div>
                            <div>
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="text-xs text-white underline hover:no-underline hover:text-accent"
                                >
                                    EDIT
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {editingProduct && (
                <ProductEditor
                    product={editingProduct}
                    onCancel={() => setEditingProduct(null)}
                    onSave={(updatedProduct) => {
                        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                        alert('UPDATE SUCCESSFUL: Changes committed to Mainframe. Deployment of static assets initiated (ETA: 2 mins). Local view updated.');
                    }}
                />
            )}
        </main>
    );
}

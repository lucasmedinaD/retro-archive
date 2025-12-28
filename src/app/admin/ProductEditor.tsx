'use client';

import { useState } from 'react';
import { updateProductAction } from '../actions';
import Image from 'next/image';

export default function ProductEditor({ product, onCancel }: { product: any, onCancel: () => void }) {
    const [formData, setFormData] = useState(product);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateProductAction(formData);
        setIsSaving(false);
        onCancel(); // Close editor matching success redirect or just close
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto brutal-shadow">
                <div className="bg-accent text-white p-2 flex justify-between items-center">
                    <h3 className="font-bold uppercase tracking-widest">Editing Unit: {product.id}</h3>
                    <button onClick={onCancel} className="text-black font-mono font-bold hover:bg-white px-2">X</button>
                </div>

                <div className="p-6 grid gap-6 font-mono text-xs">
                    <div className="flex gap-6">
                        <div className="w-1/3 aspect-square relative border border-[#333]">
                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        </div>
                        <div className="w-2/3 grid gap-4">
                            <div>
                                <label className="text-gray-500 block mb-1">IMAGE URL</label>
                                <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none" />
                            </div>
                            <div>
                                <label className="text-gray-500 block mb-1">NAME</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none font-bold text-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-500 block mb-1">PRICE</label>
                            <input name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none" />
                        </div>
                        <div>
                            <label className="text-gray-500 block mb-1">CATEGORY</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none">
                                <option value="APPAREL">APPAREL</option>
                                <option value="ACCESSORIES">ACCESSORIES</option>
                                <option value="STICKERS">STICKERS</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 block mb-1">BUY LINK</label>
                        <input name="buyUrl" value={formData.buyUrl} onChange={handleChange} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none" />
                    </div>

                    <div>
                        <label className="text-gray-500 block mb-1">DESCRIPTION</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none resize-none" />
                    </div>

                    <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-[#333]">
                        <button onClick={onCancel} className="px-6 py-3 border border-[#333] text-gray-400 hover:text-white hover:border-white uppercase tracking-wider">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-accent text-white font-bold hover:bg-white hover:text-black uppercase tracking-wider disabled:opacity-50">
                            {isSaving ? 'UPLOADING TO MAINFRAME...' : 'COMMIT CHANGES'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

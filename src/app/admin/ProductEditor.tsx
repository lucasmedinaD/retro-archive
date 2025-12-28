'use client';

import { useState } from 'react';
import { updateProductAction, createProductAction, uploadImageAction } from './actions';
import Image from 'next/image';

export default function ProductEditor({ product, onCancel, onSave, isNew }: { product: any, onCancel: () => void, onSave: (p: any) => void, isNew?: boolean }) {
    const [formData, setFormData] = useState(product);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('ERROR: Please select an image file');
            return;
        }

        setIsUploadingImage(true);
        const result = await uploadImageAction(file);
        setIsUploadingImage(false);

        // @ts-ignore
        if (result?.error) {
            // @ts-ignore
            alert(`IMAGE UPLOAD ERROR: ${result.error}`);
        } else {
            // @ts-ignore
            setFormData({ ...formData, image: result.path });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = isNew
            ? await createProductAction(formData)
            : await updateProductAction(formData);
        setIsSaving(false);

        // @ts-ignore
        if (result?.error) {
            // @ts-ignore
            alert(`ERROR: ${result.error}`);
        } else {
            // @ts-ignore
            onSave(result?.product || formData);
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto brutal-shadow">
                <div className="bg-accent text-white p-2 flex justify-between items-center">
                    <h3 className="font-bold uppercase tracking-widest">{isNew ? 'Creating New Unit' : `Editing Unit: ${product.id}`}</h3>
                    <button onClick={onCancel} className="text-black font-mono font-bold hover:bg-white px-2">X</button>
                </div>

                <div className="p-6 grid gap-6 font-mono text-xs">
                    <div className="flex gap-6">
                        <div className="w-1/3 aspect-square relative border border-[#333] bg-[#222] flex items-center justify-center">
                            {formData.image ? (
                                <Image
                                    src={formData.image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <span className="text-gray-600 text-xs">NO IMAGE</span>
                            )}
                        </div>
                        <div className="w-2/3 grid gap-4">
                            <div>
                                <label className="text-gray-500 block mb-1">UPLOAD IMAGE</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploadingImage}
                                    className="w-full bg-[#222] border border-[#333] p-2 text-white focus:border-accent outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-accent file:text-black file:font-mono file:text-xs file:uppercase file:cursor-pointer hover:file:bg-white"
                                />
                                {isUploadingImage && (
                                    <p className="text-accent text-xs mt-1 animate-pulse">UPLOADING TO MAINFRAME...</p>
                                )}
                                {formData.image && !isUploadingImage && (
                                    <p className="text-gray-500 text-xs mt-1">✓ {formData.image}</p>
                                )}
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

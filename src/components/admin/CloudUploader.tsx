'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

interface CloudUploaderProps {
    folder: 'products' | 'transformations' | 'slider-demos';
    onUploadComplete: (publicUrl: string) => void;
    onError?: (error: string) => void;
    accept?: string;
    label?: string;
    currentImage?: string;
    adminPassword: string;
}

interface UploadState {
    status: 'idle' | 'signing' | 'uploading' | 'complete' | 'error';
    progress: number;
    error?: string;
    publicUrl?: string;
}

export default function CloudUploader({
    folder,
    onUploadComplete,
    onError,
    accept = 'image/*',
    label = 'Upload Image',
    currentImage,
    adminPassword
}: CloudUploaderProps) {
    const [state, setState] = useState<UploadState>({ status: 'idle', progress: 0 });
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // Start upload process
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        try {
            // Step 1: Get signed URL from our API
            setState({ status: 'signing', progress: 10 });

            const signResponse = await fetch('/api/admin/sign-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': adminPassword
                },
                body: JSON.stringify({
                    folder,
                    filename: file.name,
                    contentType: file.type
                })
            });

            if (!signResponse.ok) {
                const error = await signResponse.json();
                throw new Error(error.error || 'Failed to get upload URL');
            }

            const { signedUrl, token, publicUrl } = await signResponse.json();

            // Step 2: Upload directly to Supabase
            setState({ status: 'uploading', progress: 30 });

            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload to storage failed');
            }

            // Step 3: Complete
            setState({ status: 'complete', progress: 100, publicUrl });
            onUploadComplete(publicUrl);

        } catch (error: any) {
            const errorMessage = error.message || 'Upload failed';
            setState({ status: 'error', progress: 0, error: errorMessage });
            onError?.(errorMessage);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleClear = () => {
        setPreview(null);
        setState({ status: 'idle', progress: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Preview or Upload Button */}
            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full aspect-square object-cover border-2 border-black dark:border-white"
                    />

                    {/* Status overlay */}
                    {state.status === 'signing' || state.status === 'uploading' ? (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                <p className="font-mono text-xs">
                                    {state.status === 'signing' ? 'Preparing...' : 'Uploading...'}
                                </p>
                                <div className="w-32 h-1 bg-white/30 mt-2 mx-auto">
                                    <div
                                        className="h-full bg-accent transition-all"
                                        style={{ width: `${state.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : state.status === 'complete' ? (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle size={16} />
                        </div>
                    ) : state.status === 'error' ? (
                        <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-mono text-xs">{state.error}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Change/Clear buttons */}
                    {(state.status === 'idle' || state.status === 'complete' || state.status === 'error') && (
                        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="bg-black text-white px-3 py-1 text-xs font-bold hover:bg-accent transition-colors"
                            >
                                Change
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="bg-red-500 text-white p-1 hover:bg-red-600 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    className="w-full aspect-square border-2 border-dashed border-black dark:border-white flex flex-col items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <span className="font-mono text-xs text-gray-500">{label}</span>
                    <span className="font-mono text-[10px] text-gray-400 mt-1">Click to select</span>
                </button>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import CloudUploader from '@/components/admin/CloudUploader';

export default function UploadTestPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [folder, setFolder] = useState<'products' | 'transformations' | 'slider-demos'>('transformations');

    const handleAuth = () => {
        if (password) {
            setIsAuthenticated(true);
        }
    };

    const handleUploadComplete = (url: string) => {
        setUploadedUrls(prev => [...prev, url]);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <h1 className="text-2xl font-bold mb-4">Admin Upload Test</h1>
                <div className="max-w-md">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Admin password"
                        className="w-full bg-black border border-white/30 p-3 mb-4"
                        onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                    />
                    <button
                        onClick={handleAuth}
                        className="bg-accent text-white px-6 py-3 font-bold"
                    >
                        Enter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-2xl font-bold mb-4">☁️ Cloud Upload Test</h1>
            <p className="text-gray-400 mb-8 font-mono text-sm">
                Test direct uploads to Supabase Storage
            </p>

            {/* Folder selector */}
            <div className="mb-6">
                <label className="block text-xs uppercase mb-2 text-gray-400">Folder</label>
                <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value as any)}
                    className="bg-black border border-white/30 p-3 text-white"
                >
                    <option value="transformations">Transformations</option>
                    <option value="products">Products</option>
                    <option value="slider-demos">Slider Demos</option>
                </select>
            </div>

            {/* Uploader */}
            <div className="max-w-md mb-8">
                <CloudUploader
                    folder={folder}
                    onUploadComplete={handleUploadComplete}
                    onError={(err) => alert('Error: ' + err)}
                    adminPassword={password}
                    label="Click to upload image"
                />
            </div>

            {/* Uploaded URLs */}
            {uploadedUrls.length > 0 && (
                <div className="border border-white/20 p-4">
                    <h2 className="font-bold mb-2">✅ Uploaded Files:</h2>
                    <ul className="space-y-2">
                        {uploadedUrls.map((url, i) => (
                            <li key={i} className="font-mono text-xs break-all">
                                <a href={url} target="_blank" className="text-accent hover:underline">{url}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { getUserProfile, upsertUserProfile, isUsernameAvailable } from '@/lib/profile';
import { Upload, Check, X, Loader, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UnlockedSecret {
    transformationId: string;
    characterName?: string;
    secretImage?: string;
}

export default function ProfilePage() {
    const [user,] = useState(() => {
        const supabase = createSupabaseBrowserClient();
        return supabase?.auth.getUser();
    });

    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [maxStreak, setMaxStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [unlockedSecrets, setUnlockedSecrets] = useState<UnlockedSecret[]>([]);

    useEffect(() => {
        loadProfile();
        loadUnlockedSecrets();
    }, []);

    const loadUnlockedSecrets = async () => {
        // Get all unlocked secrets from localStorage
        const secrets: UnlockedSecret[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('secret_') && localStorage.getItem(key) === 'true') {
                const transformationId = key.replace('secret_', '');

                // Try to get transformation details from Supabase
                try {
                    const supabase = createSupabaseBrowserClient();
                    if (supabase) {
                        const { data } = await supabase
                            .from('transformations')
                            .select('character_name, secret_image')
                            .eq('id', transformationId)
                            .single();

                        if (data) {
                            secrets.push({
                                transformationId,
                                characterName: data.character_name,
                                secretImage: data.secret_image
                            });
                        } else {
                            secrets.push({ transformationId });
                        }
                    }
                } catch {
                    secrets.push({ transformationId });
                }
            }
        }

        setUnlockedSecrets(secrets);
    };

    const loadProfile = async () => {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            setMessage({ type: 'error', text: 'Please log in to access your profile' });
            setIsLoading(false);
            return;
        }

        const profile = await getUserProfile(authUser.id);

        if (profile) {
            setUsername(profile.username);
            setAvatarPreview(profile.avatar_url || '');
            setMaxStreak(profile.max_tap_streak);
            setUsernameStatus('available');
        }

        setIsLoading(false);
    };

    const checkUsername = async (value: string) => {
        if (value.length < 3) {
            setUsernameStatus('idle');
            return;
        }

        setUsernameStatus('checking');

        const available = await isUsernameAvailable(value);
        setUsernameStatus(available ? 'available' : 'taken');
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
        setUsername(value);

        // Debounce check
        clearTimeout((window as any)._usernameTimeout);
        (window as any)._usernameTimeout = setTimeout(() => checkUsername(value), 500);
    };

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!username || username.length < 3) {
            setMessage({ type: 'error', text: 'Username must be at least 3 characters' });
            return;
        }

        if (usernameStatus === 'taken') {
            setMessage({ type: 'error', text: 'Username is already taken' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const supabase = createSupabaseBrowserClient();
            if (!supabase) throw new Error('Supabase not available');

            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('Not authenticated');

            let avatarUrl = avatarPreview;

            // Upload avatar if new file selected
            if (avatarFile) {
                const fileName = `${authUser.id}-${Date.now()}.jpg`;
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, { upsert: true });

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                avatarUrl = publicUrl;
            }

            const result = await upsertUserProfile(authUser.id, {
                username,
                avatar_url: avatarUrl || undefined
            });

            if (result.success) {
                setMessage({ type: 'success', text: 'Profile saved successfully!' });
            } else {
                throw new Error(result.error || 'Failed to save profile');
            }
        } catch (err) {
            setMessage({ type: 'error', text: String(err) });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f4f0] dark:bg-[#111111]">
                <Loader className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-2">Your Profile</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Set up your username and avatar to compete for transformation ownership
                </p>

                {message && (
                    <div className={`mb-6 p-4 border-2 ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400'
                        : 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Stats Card */}
                <div className="mb-8 p-6 border-2 border-black dark:border-white bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <h3 className="text-xs uppercase font-bold mb-2 text-gray-600 dark:text-gray-400">
                        Personal Best
                    </h3>
                    <div className="text-6xl font-black">
                        🔥 {maxStreak} <span className="text-2xl">taps</span>
                    </div>
                </div>

                {/* My Collections - Unlocked Secrets */}
                <div className="mb-8">
                    <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                        <Unlock size={20} />
                        My Collections
                    </h2>

                    {unlockedSecrets.length === 0 ? (
                        <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <Lock className="mx-auto mb-3 text-gray-400" size={40} />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">
                                No secrets unlocked yet
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Find hidden spots in transformations to unlock secret photos!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {unlockedSecrets.map((secret) => (
                                <Link
                                    key={secret.transformationId}
                                    href={`/anime-to-real/${secret.transformationId}`}
                                    className="group relative aspect-square border-2 border-black dark:border-white overflow-hidden bg-gradient-to-br from-yellow-500/20 to-purple-500/20"
                                >
                                    {secret.secretImage ? (
                                        <Image
                                            src={secret.secretImage}
                                            alt={secret.characterName || 'Secret'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">
                                            🎁
                                        </div>
                                    )}

                                    {/* Overlay with character name */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                        <p className="text-xs font-bold text-white truncate">
                                            {secret.characterName || 'Secret Unlocked'}
                                        </p>
                                        <p className="text-[10px] text-yellow-400 flex items-center gap-1">
                                            ✨ Unlocked
                                        </p>
                                    </div>

                                    {/* Gold border glow on hover */}
                                    <div className="absolute inset-0 border-4 border-yellow-400/0 group-hover:border-yellow-400/100 transition-colors pointer-events-none" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Avatar Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-bold uppercase mb-3">Avatar</label>
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-black dark:border-white bg-gray-200 dark:bg-gray-800">
                            {avatarPreview ? (
                                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                    👤
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarSelect}
                                className="hidden"
                                id="avatar-upload"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-sm cursor-pointer hover:scale-105 transition-transform"
                            >
                                <Upload size={16} /> Upload Photo
                            </label>
                        </div>
                    </div>
                </div>

                {/* Username Input */}
                <div className="mb-8">
                    <label className="block text-sm font-bold uppercase mb-3">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="your_username"
                            maxLength={20}
                            className="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono text-lg outline-none"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {usernameStatus === 'checking' && <Loader className="animate-spin" size={20} />}
                            {usernameStatus === 'available' && <Check className="text-green-500" size={20} />}
                            {usernameStatus === 'taken' && <X className="text-red-500" size={20} />}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        3-20 characters. Letters, numbers, and underscores only.
                    </p>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving || usernameStatus === 'taken' || username.length < 3}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
                >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
}

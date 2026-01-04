'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { getTransformations } from '@/data/transformations';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'en' | 'es';
}

export default function ProfileModal({ isOpen, onClose, lang }: ProfileModalProps) {
    const { user, updateProfile } = useAuth();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.user_metadata?.avatar_url || '');
    const [isSaving, setIsSaving] = useState(false);

    // Get avatar options from existing transformations
    const avatarOptions = getTransformations().map(t => ({
        id: t.id,
        url: t.animeImage,
        name: t.characterName
    }));

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                full_name: fullName,
                avatar_url: selectedAvatar
            });
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(lang === 'es' ? 'Error al guardar perfil' : 'Error saving profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-center uppercase">
                    {lang === 'es' ? 'Personalizar Perfil' : 'Customize Profile'}
                </h2>

                <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                            {lang === 'es' ? 'Nombre de Usuario' : 'Username'}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none font-medium"
                                placeholder={lang === 'es' ? 'Tu nombre...' : 'Your name...'}
                            />
                            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
                            {lang === 'es' ? 'Elige un Avatar' : 'Choose an Avatar'}
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => setSelectedAvatar(avatar.url)}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedAvatar === avatar.url
                                            ? 'border-black dark:border-white scale-95 ring-2 ring-offset-2 ring-black dark:ring-offset-black dark:ring-white'
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                                        }`}
                                >
                                    <Image
                                        src={avatar.url}
                                        alt={avatar.name}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSaving
                            ? (lang === 'es' ? 'Guardando...' : 'Saving...')
                            : (lang === 'es' ? 'Guardar Cambios' : 'Save Changes')}
                    </button>
                </div>
            </div>
        </div>
    );
}

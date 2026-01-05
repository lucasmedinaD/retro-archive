'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'en' | 'es';
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return '';
    }

    canvas.width = 150;
    canvas.height = 150;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        150,
        150
    );

    return canvas.toDataURL('image/jpeg');
};

export default function ProfileModal({ isOpen, onClose, lang }: ProfileModalProps) {
    const { user, updateProfile, showNsfw, toggleNsfw } = useAuth();
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.user_metadata?.avatar_url || '');
    const [isSaving, setIsSaving] = useState(false);
    const [avatarOptions, setAvatarOptions] = useState<any[]>([]);

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Fetch avatar options from Supabase DB
    useEffect(() => {
        if (!isOpen) return;

        const fetchAvatars = async () => {
            const { createSupabaseBrowserClient } = await import('@/lib/supabase-browser');
            const supabase = createSupabaseBrowserClient();

            if (!supabase) return;

            const { data } = await supabase
                .from('transformations')
                .select('id, anime_image, character_name')
                .limit(20);

            if (data) {
                setAvatarOptions(data.map((t: any) => ({
                    id: t.id,
                    url: t.anime_image,
                    name: t.character_name
                })));
            }
        };

        fetchAvatars();
    }, [isOpen]);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let finalAvatarUrl = selectedAvatar;

            // If an avatar is selected and we have crop data, generate the cropped image data URL
            if (selectedAvatar && croppedAreaPixels) {
                // Only crop if it's one of our gallery images (starts with /) or has changed
                // Simple logic: if user touched the cropper, we crop.
                try {
                    finalAvatarUrl = await getCroppedImg(selectedAvatar, croppedAreaPixels);
                } catch (e) {
                    console.error("Crop failed", e);
                    // Fallback to original
                }
            }

            await updateProfile({
                full_name: fullName,
                avatar_url: finalAvatarUrl
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
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors z-10"
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

                    {/* Content Preferences */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                            {lang === 'es' ? 'Preferencias de Contenido' : 'Content Preferences'}
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {lang === 'es' ? 'Mostrar Contenido Spicy (+18)' : 'Show Spicy Content (+18)'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {lang === 'es' ? 'Ver transformaciones marcadas como NSFW' : 'View transformations marked as NSFW'}
                                </span>
                            </div>
                            <button
                                onClick={toggleNsfw}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${showNsfw ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                            >
                                <span
                                    className={`${showNsfw ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Avatar Selection & Cropper */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-3">
                            {lang === 'es' ? 'Elige un Avatar' : 'Choose an Avatar'}
                        </label>

                        {/* Cropper Area */}
                        {selectedAvatar && (
                            <div className="mb-4 relative h-64 w-full bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden">
                                <Cropper
                                    image={selectedAvatar}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>
                        )}

                        {selectedAvatar && (
                            <div className="mb-6 px-2">
                                <label className="text-xs text-gray-500 mb-1 block">Zoom</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-3">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => {
                                        setSelectedAvatar(avatar.url);
                                        setZoom(1); // Reset zoom on change
                                    }}
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

'use client';

import { useState } from 'react';
import { updateSocialMediaAction } from '@/app/admin/actions/settings';
import type { SiteSettings } from '@/data/settings';

interface SettingsEditorProps {
    initialSettings: SiteSettings;
}

export default function SettingsEditor({ initialSettings }: SettingsEditorProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);
        const result = await updateSocialMediaAction(formData);

        if (result.success) {
            setMessage('✓ Guardado exitosamente');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage('✗ Error al guardar');
        }

        setSaving(false);
    }

    return (
        <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white p-6">
            <h2 className="text-2xl font-black mb-6 uppercase">Configuración del Sitio</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Social Media Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span>🔗</span> Redes Sociales
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-mono mb-2">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                name="instagram"
                                defaultValue={settings.socialMedia.instagram}
                                placeholder="https://instagram.com/tu_usuario"
                                className="w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2">
                                Twitter/X URL
                            </label>
                            <input
                                type="url"
                                name="twitter"
                                defaultValue={settings.socialMedia.twitter}
                                placeholder="https://twitter.com/tu_usuario"
                                className="w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2">
                                TikTok URL (opcional)
                            </label>
                            <input
                                type="url"
                                name="tiktok"
                                defaultValue={settings.socialMedia.tiktok}
                                placeholder="https://tiktok.com/@tu_usuario"
                                className="w-full p-3 border-2 border-black dark:border-white bg-white dark:bg-gray-800 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-bold uppercase text-sm hover:invert transition-all disabled:opacity-50 border-2 border-black dark:border-white"
                    >
                        {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                    </button>

                    {message && (
                        <span className={`font-mono text-sm ${message.includes('✓') ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {message}
                        </span>
                    )}
                </div>

                <p className="text-xs font-mono text-gray-500 mt-4">
                    💡 Tip: Deja vacío si no quieres mostrar esa red social en el footer
                </p>
            </form>
        </div>
    );
}

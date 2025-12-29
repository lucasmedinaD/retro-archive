import { getSettings } from '@/data/settings';
import SettingsEditor from '../SettingsEditor';
import Link from 'next/link';

export default async function SettingsPage() {
    const settings = getSettings();

    return (
        <main className="min-h-screen bg-[#111] text-accent font-mono p-8">
            <header className="flex justify-between items-center mb-12 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Settings <span className="text-accent">Panel</span>
                    </h1>
                    <p className="text-xs text-gray-500">Site Configuration & Social Media</p>
                </div>
                <Link
                    href="/admin"
                    className="px-4 py-2 border border-[#333] hover:bg-white hover:text-black hover:border-white transition-colors uppercase text-xs"
                >
                    ← Back to Dashboard
                </Link>
            </header>

            <SettingsEditor initialSettings={settings} />
        </main>
    );
}

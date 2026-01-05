'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Ban, Activity, Calendar, Mail, Shield, Eye, EyeOff } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    provider: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    show_nsfw: boolean;
    stats: {
        comments: number;
        favorites: number;
        reactions: number;
        votes: number;
    };
    is_banned: boolean;
}

export default function UsersAdminPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showBannedOnly, setShowBannedOnly] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on search and banned filter
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (showBannedOnly) {
            filtered = filtered.filter(user => user.is_banned);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, showBannedOnly]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
        setIsLoading(false);
    };

    const handleToggleBan = async (userId: string, currentBanned: boolean) => {
        if (!confirm(currentBanned ? '¿Desbanear este usuario?' : '¿Banear este usuario?')) return;

        const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, is_banned: !currentBanned })
        });

        if (res.ok) {
            fetchUsers();
        }
    };

    const getTotalActivity = (stats: UserData['stats']) => {
        return stats.comments + stats.favorites + stats.reactions + stats.votes;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Users className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-black">Gestión de Usuarios</h1>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border-2 border-black p-4">
                        <div className="text-sm font-mono text-gray-500">Total Usuarios</div>
                        <div className="text-3xl font-black">{users.length}</div>
                    </div>
                    <div className="bg-white border-2 border-black p-4">
                        <div className="text-sm font-mono text-gray-500">Activos (7d)</div>
                        <div className="text-3xl font-black text-green-600">
                            {users.filter(u => {
                                const lastLogin = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null;
                                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                                return lastLogin && lastLogin > sevenDaysAgo;
                            }).length}
                        </div>
                    </div>
                    <div className="bg-white border-2 border-black p-4">
                        <div className="text-sm font-mono text-gray-500">Con Actividad</div>
                        <div className="text-3xl font-black text-blue-600">
                            {users.filter(u => getTotalActivity(u.stats) > 0).length}
                        </div>
                    </div>
                    <div className="bg-white border-2 border-black p-4">
                        <div className="text-sm font-mono text-gray-500">Baneados</div>
                        <div className="text-3xl font-black text-red-600">
                            {users.filter(u => u.is_banned).length}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-2 border-black p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por email, username o nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowBannedOnly(!showBannedOnly)}
                            className={`px-4 py-2 font-bold ${showBannedOnly ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                            {showBannedOnly ? 'Mostrando Baneados' : 'Mostrar Solo Baneados'}
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                {isLoading ? (
                    <p className="text-center py-12">Cargando usuarios...</p>
                ) : (
                    <div className="bg-white border-2 border-black overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-3 text-left">Usuario</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-center">Registro</th>
                                    <th className="p-3 text-center">Último Login</th>
                                    <th className="p-3 text-center">Actividad</th>
                                    <th className="p-3 text-center">NSFW</th>
                                    <th className="p-3 text-center">Estado</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-6 text-center text-gray-500">
                                            No se encontraron usuarios
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((user) => {
                                    const totalActivity = getTotalActivity(user.stats);
                                    const lastLogin = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
                                    const daysAgo = lastLogin ? Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : null;

                                    return (
                                        <tr key={user.id} className={`border-t border-gray-200 hover:bg-gray-50 ${user.is_banned ? 'bg-red-50' : ''}`}>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {user.avatar_url && (
                                                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                                                    )}
                                                    <div>
                                                        <div className="font-bold">{user.username || user.full_name || 'Sin username'}</div>
                                                        <div className="text-xs text-gray-500">{user.provider}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">{user.email}</td>
                                            <td className="p-3 text-center text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-center text-sm">
                                                {lastLogin ? (
                                                    <span className={daysAgo! < 7 ? 'text-green-600' : 'text-gray-500'}>
                                                        {daysAgo === 0 ? 'Hoy' : `Hace ${daysAgo}d`}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Nunca</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-bold text-lg">{totalActivity}</span>
                                                    <div className="text-[10px] text-gray-500 space-x-2">
                                                        <span>💬{user.stats.comments}</span>
                                                        <span>❤️{user.stats.favorites}</span>
                                                        <span>🔥{user.stats.reactions}</span>
                                                        <span>⭐{user.stats.votes}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                {user.show_nsfw ? (
                                                    <Eye size={16} className="inline text-orange-500" />
                                                ) : (
                                                    <EyeOff size={16} className="inline text-gray-400" />
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {user.is_banned ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase">
                                                        Baneado
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase">
                                                        Activo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleToggleBan(user.id, user.is_banned)}
                                                    className={`p-2 rounded ${user.is_banned ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                                    title={user.is_banned ? 'Desbanear' : 'Banear'}
                                                >
                                                    {user.is_banned ? <Shield size={16} /> : <Ban size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

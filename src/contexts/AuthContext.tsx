'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>;
    showNsfw: boolean;
    toggleNsfw: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNsfw, setShowNsfw] = useState(false);

    // Memoize supabase client to avoid recreating on every render
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);

    useEffect(() => {
        // Skip auth if no supabase client (during build/SSR)
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Fetch profile settings
                const { data } = await supabase
                    .from('profiles')
                    .select('show_nsfw')
                    .eq('id', session.user.id)
                    .single();
                if (data) setShowNsfw(data.show_nsfw);
            }

            setIsLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signInWithGoogle = async () => {
        if (!supabase) return;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const signOut = async () => {
        if (!supabase) return;

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
        if (!supabase || !user) return;

        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }

        if (data.user) {
            setUser(data.user);
            setSession(prev => prev ? { ...prev, user: data.user } : null);
        }
    };

    const toggleNsfw = async () => {
        if (!supabase || !user) return;

        const newValue = !showNsfw;
        // Optimistic update
        setShowNsfw(newValue);

        const { error } = await supabase
            .from('profiles')
            .upsert({ id: user.id, show_nsfw: newValue, updated_at: new Date().toISOString() });

        if (error) {
            console.error('Error updating NSFW preference:', error);
            // Revert
            setShowNsfw(!newValue);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isLoading,
            signInWithGoogle,
            signOut,
            updateProfile,
            showNsfw,
            toggleNsfw
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    // Return safe defaults if used outside provider (SSR, missing provider)
    if (context === undefined) {
        return {
            user: null,
            session: null,
            isLoading: false,
            signInWithGoogle: async () => { },
            signOut: async () => { },
            updateProfile: async () => { },
            showNsfw: false,
            toggleNsfw: async () => { }
        };
    }
    return context;
}


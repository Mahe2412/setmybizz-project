"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    dbUser: any | null;
    dbBusiness: any | null;
    guestId: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    dbUser: null,
    dbBusiness: null,
    guestId: null,
    loading: true,
    signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [dbUser, setDbUser] = useState<any | null>(null);
    const [dbBusiness, setDbBusiness] = useState<any | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Guest ID
        let storedGuestId = localStorage.getItem('setmybizz_guest_id');
        if (!storedGuestId) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            storedGuestId = `Guest-${randomNum}`;
            localStorage.setItem('setmybizz_guest_id', storedGuestId);
        }
        setGuestId(storedGuestId);

        // Get initial session
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await fetchDbUser(session.user.id);
            }
            setLoading(false);
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                await fetchDbUser(session.user.id);
            } else {
                setDbUser(null);
                setDbBusiness(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchDbUser = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.error("Error fetching profile:", error);
            }
            
            if (data) {
                setDbUser(data);
            }

            // Concurrently pull the verified business identity to drive UI shells
            const { data: bizData } = await supabase
                .from('businesses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (bizData) {
                setDbBusiness(bizData);
            } else {
                setDbBusiness(null);
            }
        } catch (err) {
            console.error("DB Context Synchronization Error:", err);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, dbUser, dbBusiness, guestId, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

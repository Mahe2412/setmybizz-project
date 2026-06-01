"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
  DEV_MOCK_DB_BUSINESS,
  DEV_MOCK_DB_USER,
  DEV_MOCK_USER,
  isDevAuthBypass,
} from '@/lib/devAuth';

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
        if (isDevAuthBypass()) {
            console.warn('[SetMyBizz] DEV auth bypass active — localhost only');
            setUser(DEV_MOCK_USER);
            setDbUser(DEV_MOCK_DB_USER);
            setDbBusiness(DEV_MOCK_DB_BUSINESS);
            setLoading(false);
            if (typeof window !== 'undefined') {
                localStorage.setItem('setmybizz_session', 'true');
            }
        }

        // Safety timeout: guarantee loading finishes in 2.5s even if Supabase hangs
        const safetyTimeout = setTimeout(() => {
            setLoading(false);
            console.warn("[Arkle OS] Supabase auth fallback triggered.");
        }, 2500);

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
            if (isDevAuthBypass()) {
                clearTimeout(safetyTimeout);
                return;
            }
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    await fetchDbUser(session.user.id, session.user.email);
                }
            } catch (e) {
                console.error("Failed to initialize session", e);
            } finally {
                clearTimeout(safetyTimeout);
                setLoading(false);
            }
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (isDevAuthBypass()) return;
            try {
                setSession(session);
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    await fetchDbUser(session.user.id, session.user.email);
                } else {
                    setDbUser(null);
                    setDbBusiness(null);
                }
            } catch (e) {
                console.error("Auth state change error", e);
            } finally {
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchDbUser = async (userId: string, userEmail?: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            
            let activeDbUser = data;

            if (error && error.code === 'PGRST116') {
                // New User First Time Login -> Generate Dedicated Unique ID
                const uniqueId = `SMB-UID-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                
                const newUserPayload = {
                    id: userId,
                    registeredId: uniqueId,
                    email: userEmail || '',
                    updated_at: new Date().toISOString()
                };

                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert([newUserPayload])
                    .select()
                    .single();

                if (!insertError && newUser) {
                    activeDbUser = newUser;
                    console.log(`[Arkle OS] New Operator Registered: ${uniqueId}`);
                } else {
                    console.error("Failed to initialize user identity:", insertError);
                }
            } else if (error && error.code !== 'PGRST116') {
                console.error("Error fetching profile:", error);
            }
            
            if (activeDbUser) {
                setDbUser(activeDbUser);
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

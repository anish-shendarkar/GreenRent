import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthContextType {
    isLoading: boolean;
    hasOnboarded: boolean;
    isLoggedIn: boolean;
    completeOnboarding: () => Promise<void>;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    hasOnboarded: false,
    isLoggedIn: false,
    completeOnboarding: async () => { },
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loadStates = async () => {
            try {
                const onboarded = await AsyncStorage.getItem('hasOnboarded');
                const token = await AsyncStorage.getItem('authToken');
                setHasOnboarded(onboarded === 'true');
                setIsLoggedIn(!!token);
            } catch (error) {
                console.error('Error loading auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStates();
    }, []);

    const completeOnboarding = useCallback(async () => {
        setHasOnboarded(true);
        await AsyncStorage.setItem('hasOnboarded', 'true');
    }, []);

    const login = useCallback(async (token: string) => {
        setIsLoggedIn(true);
        await AsyncStorage.setItem('authToken', token);
    }, []);

    const logout = useCallback(async () => {
        setIsLoggedIn(false);
        await AsyncStorage.removeItem('authToken');
    }, []);

    return (
        <AuthContext.Provider
            value={{ isLoading, hasOnboarded, isLoggedIn, completeOnboarding, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

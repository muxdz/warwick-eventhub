"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { User } from "@/types/users";
import { getUserData, Login } from "@/services/auth";

type AuthContext = {
    user: User | null;
    token: string | null;
    loading: boolean;

    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContext | undefined>(
    undefined
);

type AuthProviderProps = {
    children: React.ReactNode;
};

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
    }

    async function login(email: string, password: string) {
        const response = await Login(email, password);
        const data = await response.json();

        const token = data.access_token;

        if (token) {
            localStorage.setItem("access_token", token);
            setToken(token);
            const user = await getUserData(token);
            setUser(user);
        }

    }
    useEffect(() => {
        async function restoreSession() {
            const storedToken =
            localStorage.getItem("access_token");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            setToken(storedToken);

            try {
                const user = await getUserData(storedToken);
                setUser(user);
            } catch {
                logout();
            }

            setLoading(false);
        }

        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


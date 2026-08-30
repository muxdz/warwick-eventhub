"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {            
            await login(email, password);
            router.push("/profile");
        } catch (error) {
            setError(error instanceof ApiError ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email" 
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}     
            />
            <label htmlFor="password">Password</label>
            <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             />
            <button 
                type="submit"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}

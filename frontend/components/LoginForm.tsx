"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const { login } = useAuth();

    async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        await login(email, password);
        router.push("/profile");
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                id="email"
                name="email"
                type="email" 
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}     
            />
            <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             />
            <button type="submit">Login</button>
        </form>
    );
}

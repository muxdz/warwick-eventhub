"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_CHANGED_EVENT, Login } from "@/services/auth";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const email = form.get("email") as string;
        const password = form.get("password") as string;

        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await Login(formData);
        
        const data = await response.json();

        if (!response.ok) {
            return console.error(data.detail ?? `Request failed with status ${response.status}`);
        }

        localStorage.setItem("access_token", data.access_token);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
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

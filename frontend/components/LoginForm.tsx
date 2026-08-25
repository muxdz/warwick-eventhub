"use client";

import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: React.SubmitEvent) {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const reponse = await fetch (
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            }
        );
        
        const data = await reponse.json();

        if (!reponse.ok) {
            const error = await reponse.json();
            return console.error(error.detail ?? `Request failed with status ${reponse.status}`);
        }

        localStorage.setItem("access_token", data.access_token);
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                id="email"
                type="email" 
                placeholder="alice@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}     
            />
            <input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             />
            <button type="submit">Login</button>
        </form>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Register } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const form = new FormData(e.currentTarget);

            const username = form.get("username") as string;
            const email = form.get("email") as string;
            const password = form.get("password") as string;
            const confirm_password = form.get("confirm_password") as string;

            if (password !== confirm_password) {
                throw new ApiError("Passwords do not match", 400);
            }

            const response = await Register(username, email, password);

            if (response.status === 400) {
                throw new ApiError("User already exists", 400);
            }

            await login(email, password);
            router.push("/profile");
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 400) {
                    setError("User already exists");
                }  else {
                    setError("An error occurred while registering");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleRegister} className="styled-form">
            <div className="mb-7"><p className="eyebrow">Join the community</p><h1 className="mt-2 text-3xl font-bold text-[#44188c]">Create your account</h1><p className="mt-2 text-slate-600">Start discovering more of campus.</p></div>
            {error && <p role="alert">{error}</p>}
            <label htmlFor="username">Username</label>
            <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            />
            <button 
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>
    );
}

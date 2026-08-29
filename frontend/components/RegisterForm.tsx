"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Register } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

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
                throw new Error("Passwords do not match");
            }

            const response = await Register(username, email, password);

            if (response.status === 400) {
                throw new Error("User already exists");
            }

            await login(email, password);
            router.push("/profile");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
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
                Register
            </button>
        </form>
    );
}
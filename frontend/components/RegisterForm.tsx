"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Register } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

const passwordRequirements = [
    { label: "At least 10 characters", test: (value: string) => Array.from(value).length >= 10 },
    { label: "At least one uppercase letter (A-Z)", test: (value: string) => /[A-Z]/.test(value) },
    { label: "At least one lowercase letter (a-z)", test: (value: string) => /[a-z]/.test(value) },
    { label: "At least one symbol (e.g. !, @, #)", test: (value: string) => /[\p{P}\p{S}]/u.test(value) },
];

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

            const missing = passwordRequirements.filter(requirement => !requirement.test(password));
            if (missing.length) {
                throw new ApiError(`Password must contain ${missing.map(requirement => requirement.label.toLowerCase()).join("; ")}.`, 422);
            }

            if (password !== confirm_password) {
                throw new ApiError("Passwords do not match", 400);
            }

            await Register(username, email, password);

            await login(email, password);
            router.push("/profile");
        } catch (error) {
            setError(error instanceof ApiError && error.status < 500
                ? error.message
                : "An error occurred while registering. Please try again.");
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
                aria-describedby="password-requirements"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <ul id="password-requirements" className="list-disc pl-5 text-sm text-slate-600">
                {passwordRequirements.map(requirement => <li key={requirement.label}>{requirement.label}</li>)}
            </ul>
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

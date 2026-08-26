"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_CHANGED_EVENT, Register } from "@/services/auth";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const router = useRouter();

    async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const username = form.get("username") as string;
        const email = form.get("email") as string;
        const password = form.get("password") as string;
        const confirm_password = form.get("confirm_password") as string;

        if (password !== confirm_password) {
            return console.error("Passwords do not match");
        }

        const response = await Register(username, email, password);

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            return console.error(data.detail ?? `Request failed with status ${response.status}`);
        }

        localStorage.setItem("access_token", data.access_token);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
        router.push("/profile");
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
            <button type="submit">Register</button>
        </form>
    );
}
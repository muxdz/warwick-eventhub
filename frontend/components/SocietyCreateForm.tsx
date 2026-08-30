"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateSociety } from "@/services/societies";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";
import type { SocietyCreate } from "@/types/societies";

export default function SocietyCreateForm() {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { token } = useAuth();

    async function handleCreateSociety(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            if (!token) {
                throw new ApiError("You are not logged in", 401);
            }

            const society: SocietyCreate = {society_name: name};

            const response = await CreateSociety(society, token);
            if (!response) {
                throw new ApiError("Failed to create society", 500);
            }

            router.push("/societies/" + response.id);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            }
        }
    }

    return (
        <form onSubmit={handleCreateSociety}>
            {error && <p role="alert">{error}</p>}
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Create Society</button>
        </form>
    );
}
"use client";

import { useState } from "react";
import { getCurrentUser } from "@/services/auth";

export default function Profile() {
    const [user, setUser] = useState<any>(null);

    async function getUserData() {
        const reponse = await getCurrentUser(localStorage.getItem("access_token"));

        if (!reponse.ok) {
            throw new Error(reponse.status.toString());
        }

        const data = await reponse.json();
        setUser(data);
    }

    getUserData();

    return (
        <main>
            <h1>Profile</h1>
            <p>{JSON.stringify(user)}</p>
        </main>
    );
}
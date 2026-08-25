"use client";

import { useState } from "react";
import { getCurrentUser } from "@/services/auth";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const createdTime = new Date(user?.created_at);

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
            <p>ID: {user?.id}</p>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>
                <time dateTime={user?.created_at}>{createdTime.toLocaleString("en-GB")}</time>
            </p>
        </main>
    );
}
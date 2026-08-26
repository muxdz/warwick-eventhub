"use client";

import { useState, useEffect } from "react";
import { AUTH_CHANGED_EVENT, getUserData } from "@/services/auth";

type User = {
    id: string | number;
    name: string;
    email: string;
    created_at: string;
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await getUserData(token);

                if (!response.ok) {
                    localStorage.removeItem("access_token");
                    setUser(null);
                    return;
                }

                setUser(await response.json());
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        void getData();
        window.addEventListener(AUTH_CHANGED_EVENT, getData);

        return () => window.removeEventListener(AUTH_CHANGED_EVENT, getData);
    }, []);

    if (loading) {
        return <main><p>Loading profile...</p></main>;
    }

    if (!user) {
        return <main><h1>Profile</h1><p>You are not logged in.</p></main>;
    }

    const createdTime = new Date(user.created_at);

    return (
        <main>
            <h1>Profile</h1>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>
                <time dateTime={user.created_at}>{createdTime.toLocaleString("en-GB")}</time>
            </p>
        </main>
    );
}

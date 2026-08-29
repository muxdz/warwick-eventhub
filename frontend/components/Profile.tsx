"use client";

import { useAuth } from "@/context/AuthContext";

export default function Profile() {
    const { user, loading } = useAuth();

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
            <p>Name: {user.user_name}</p>
            <p>Email: {user.email}</p>
            <p>
                <time dateTime={user.created_at.toString()}>{createdTime.toLocaleString("en-GB")}</time>
            </p>
        </main>
    );
}

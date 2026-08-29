"use client";

import type { Event } from "@/types/events";
import { useAuth } from "@/context/AuthContext";

export async function GetBookmarks(): Promise<Event[]> {
    const { token } = useAuth();

    if (!token) {
        return [];
    }
    
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
    }

    return response.json();
}

export async function AddBookmark(event_id: number) {
    const { token } = useAuth();
    
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${event_id}`, 
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail ?? "Failed to add bookmark");
    }
}

export async function RemoveBookmark(event_id: number) {
    const { token } = useAuth();

    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${event_id}`, 
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail ?? "Failed to remove bookmark");
    }
}

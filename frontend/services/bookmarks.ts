import type { Event } from "@/types/events";
import { ApiError } from "./errors";

export async function GetBookmarks(token: string): Promise<Event[]> {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();

        throw new ApiError(
            error.detail ?? "Failed to get bookmarks",
            response.status
        );
    }

    return response.json();
}

export async function AddBookmark(event_id: number, token: string) {
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
        
        throw new ApiError(
            error.detail ?? "Failed to add bookmark",
            response.status
        )
    }
}

export async function RemoveBookmark(event_id: number, token: string) {
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

        throw new ApiError(
            error.detail ?? "Failed to remove bookmark",
            response.status
        )
    }
}

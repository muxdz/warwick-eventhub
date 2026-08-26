import { Event } from "@/types/events";

export async function GetEvents(): Promise<Event[] | null> {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/events`
    );

    if (reponse.status === 404) {
        return null;
    }

    if (!reponse.ok) {
        const error = await reponse.json();
        throw new Error(error.detail ?? `Request failed with status ${reponse.status}`);
    }

    return reponse.json();
}

export async function GetEvent(id: number): Promise<Event | null> {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
    );

    if (reponse.status === 404) {
        return null;
    }

    if (!reponse.ok) {
        const error = await reponse.json();
        throw new Error(error.detail ?? `Request failed with status ${reponse.status}`);
    }

    return reponse.json();
}

export async function CreateEvent(eventData: URLSearchParams) {
    const token = localStorage.getItem("access_token");

    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(Object.fromEntries(eventData))
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail ?? `Request failed with status ${response.status}`);
    }

    return response.json();
}

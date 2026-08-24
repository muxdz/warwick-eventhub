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
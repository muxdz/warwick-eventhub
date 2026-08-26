import type { Society } from "@/types/societies";

export async function GetSocieties(): Promise<Society[]> {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/societies`
    );

    if (!reponse.ok) {
        throw new Error(reponse.status.toString());
    }

    return reponse.json();
}

export async function GetSociety(id: number): Promise<Society | null> {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/societies/${id}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    return response.json();
}

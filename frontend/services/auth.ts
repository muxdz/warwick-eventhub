import { User } from "@/types/users";
import { ApiError } from "./errors";

export const AUTH_CHANGED_EVENT = "auth-changed";

export async function Login(email: string, password: string) {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                "username": email,
                "password": password
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        
        throw new ApiError(
            error.detail ?? "Login failed",
            response.status
        )
    }

    return response;
}

export async function getUserData(token: string): Promise<User> {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/data`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        
        throw new ApiError(
            error.detail ?? "Failed to get user data",
            response.status
        )
    }

    return response.json();
}

export async function checkAuth(token: string | null) {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    return response;
}

export async function Register(user_name: string, email: string, password: string) {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_name": user_name,
                "email": email,
                "password": password
            })
        }
    );

    return response;
}

type Membership = {
    society_id: number;
    role: "organiser" | "member";
};

export async function isOrganiser(token: string | null, societyId: number): Promise<boolean> {
    if (!token) {
        return false;
    }

    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/memberships`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        return false;
    }

    const memberships: Membership[] = await response.json();
    const isOrganiser = memberships.some(
        (membership) =>
            membership.society_id === societyId && membership.role === "organiser"
    );

    return isOrganiser;
}

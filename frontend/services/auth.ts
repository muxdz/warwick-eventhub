import { User } from "@/types/users";

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
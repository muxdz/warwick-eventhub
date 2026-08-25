export async function Login(formData: URLSearchParams) {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData
        }
    );

    return response;
}

export async function getCurrentUser(token: string | null) {
    const response = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/data`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    return response;
}
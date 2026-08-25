export async function login(formData: URLSearchParams) {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData
        }
    );

    return reponse;
}

export async function get_current_user(token: string) {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    return reponse.json();
}
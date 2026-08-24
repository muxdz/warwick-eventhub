export async function login(email : string, password : string) {
    const reponse = await fetch (
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
    );

    return reponse.json();
}
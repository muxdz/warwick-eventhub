import { ApiError } from "./errors";

export async function changePassword(token: string, oldPassword: string, newPassword: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    if (!response.ok) {
        const error = await response.json();
        const detail = error.detail;
        const message = Array.isArray(detail)
            ? detail.map((item: { msg: string }) => item.msg.replace(/^Value error, /, "")).join(" ")
            : typeof detail === "string" ? detail : "Unable to change password";
        throw new ApiError(message, response.status);
    }
}

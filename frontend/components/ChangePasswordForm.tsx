"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { passwordRequirements } from "@/lib/passwordValidation";
import { changePassword } from "@/services/users";
import { ApiError } from "@/services/errors";

export default function ChangePasswordForm() {
    const { token, loading } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!token || saving) return;
        setError(null);
        setSuccess(false);
        const missing = passwordRequirements.filter(requirement => !requirement.test(newPassword));
        if (missing.length) {
            setError(`Password must contain ${missing.map(requirement => requirement.label.toLowerCase()).join("; ")}.`);
            return;
        }
        if (newPassword !== confirmation) {
            setError("Passwords do not match");
            return;
        }
        setSaving(true);
        try {
            await changePassword(token, oldPassword, newPassword);
            setOldPassword("");
            setNewPassword("");
            setConfirmation("");
            setSuccess(true);
        } catch (error) {
            setError(error instanceof ApiError && error.status < 500
                ? error.message
                : "Unable to change password. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p role="status">Loading...</p>;
    if (!token) return <p>Please <Link href="/login" className="text-link">log in</Link> to change your password.</p>;

    return (
        <form className="styled-form" onSubmit={handleSubmit}>
            <div className="mb-7">
                <p className="eyebrow">Account security</p>
                <h1 className="mt-2 text-3xl font-bold text-[#44188c]">Change password</h1>
                <p className="mt-2 text-slate-600">Enter your old password and choose a new one.</p>
            </div>
            {error && <p role="alert">{error}</p>}
            {success && <p role="status">Your password has been changed successfully.</p>}
            <label htmlFor="old-password">Old password</label>
            <input id="old-password" name="old_password" type="password" autoComplete="current-password" required disabled={saving} value={oldPassword} onChange={event => setOldPassword(event.target.value)} />
            <label htmlFor="new-password">New password</label>
            <input id="new-password" name="new_password" type="password" autoComplete="new-password" aria-describedby="password-requirements" required disabled={saving} value={newPassword} onChange={event => setNewPassword(event.target.value)} />
            <ul id="password-requirements" className="list-disc pl-5 text-sm text-slate-600">
                {passwordRequirements.map(requirement => <li key={requirement.label}>{requirement.label}</li>)}
            </ul>
            <label htmlFor="confirm-password">Confirm new password</label>
            <input id="confirm-password" name="confirm_password" type="password" autoComplete="new-password" required disabled={saving} value={confirmation} onChange={event => setConfirmation(event.target.value)} />
            <button type="submit" disabled={saving}>{saving ? "Changing password..." : "Change password"}</button>
            <Link href="/profile" className="text-link">Back to profile</Link>
        </form>
    );
}

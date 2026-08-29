"use client";

import { DeleteEvent } from "@/services/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

type EventActionsProps = {
    eventId: number;
    createdByUserId: number;
};

export default function EventActions({ eventId, createdByUserId }: EventActionsProps) {
    const router = useRouter();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return null;
    }

    const canEdit =
        user.id === createdByUserId;

    if (!canEdit) {
        return null;
    }

    async function handleDeleteEvent(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const confirmed = window.confirm(
                "Are you sure you want to delete this event?"
            )

            if (!confirmed) {
                throw new Error("Event not deleted");
            }

            if (!token) {
                throw new Error("No token");
            }

            DeleteEvent(eventId, token);
            router.push("/events");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {canEdit && (
                <>
                <Link href={`/events/${eventId}/edit`}>
                    Edit
                </Link>

                <button
                    onClick={handleDeleteEvent}
                    className="inline-flex rounded-md py-2 font-medium text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
                </>
            )}
        </div>
    );
}
"use client";

import { DeleteEvent } from "@/services/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { ApiError } from "@/services/errors";

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
                throw new ApiError("Event not deleted", 422);
            }

            if (!token) {
                throw new ApiError("No token", 401);
            }

            DeleteEvent(eventId, token);
            router.push("/events");
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setError("Please log in to delete events");
                }
                else if (error.status === 403) {
                    setError("You do not have permission to delete this event");
                }
                else if (error.status === 404) {
                    setError("Event not found");
                }
                else if (error.status === 422) {
                    setError("Invalid request");
                }
                else if (error.status === 500) {
                    setError("Internal server error");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {canEdit && (
                <>
                {error && <p role="alert">{error}</p>}
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
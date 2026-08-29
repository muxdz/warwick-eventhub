"use client";

import { DeleteEvent } from "@/services/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type EventActionsProps = {
    eventId: number;
    createdByUserId: number;
};

export default function EventActions({ eventId, createdByUserId }: EventActionsProps) {
    const router = useRouter();
    const { user, token } = useAuth();

    if (!user) {
        return null;
    }

    const canEdit =
        user.id === createdByUserId;

    if (!canEdit) {
        return null;
    }

    async function handleDeleteEvent() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        if (!token) {
            console.log("No token");
            return;
        }       

        DeleteEvent(eventId, token);

        router.push("/events");
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
                >
                    Delete
                </button>
                </>
            )}
        </div>
    );
}
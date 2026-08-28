"use client";

import { DeleteEvent } from "@/services/events";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData } from "@/services/auth";
import Link from "next/link";

type EventActionsProps = {
    eventId: number;
    createdByUserId: number;
};

export default function EventActions({ eventId, createdByUserId }: EventActionsProps) {
    const router = useRouter();
    const [currentUserID, setCurrentUserID] = useState<number | null>(null);

    useEffect(() => {
/*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Load the current user's data from local storage
         * and set the current user ID to the state
         */
/*******  a5f8d853-8fd4-403b-b07d-ef280b0da3d3  *******/
        async function loadUser() {
            const currentUser = await getUserData(localStorage.getItem("access_token"));

            const userData = await currentUser.json();

            if (currentUser) {
                setCurrentUserID(userData.id);
            }
        }

        loadUser();
    }, []);

    const canEdit =
        currentUserID === createdByUserId;

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

        const token = localStorage.getItem("access_token");

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
"use client";

import EventList from "@/components/EventList";
import { GetEvents } from "@/services/events";
import { useEffect, useState } from "react";
import { GetBookmarks } from "@/services/bookmarks";
import type { Event } from "@/types/events";
import { useAuth } from "@/context/AuthContext";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[] | null>(null);
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
    const [loadError, setLoadError] = useState("");
    const { token, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) {
            return;
        }

        async function loadEventsAndBookmarks() {
            try {
                const [eventData, bookmarkData] = await Promise.all([
                    GetEvents(),
                    token ? GetBookmarks(token) : Promise.resolve([]),
                ]);
                setEvents(eventData ?? []);
                setBookmarkedIds(bookmarkData.map((event) => event.id));
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : "Failed to load events");
            }
        }

        void loadEventsAndBookmarks();
    }, [authLoading, token]);

    function handleBookmarkChange(eventId: number, isBookmarked: boolean) {
        setBookmarkedIds((currentIds) =>
            isBookmarked
                ? [...new Set([...currentIds, eventId])]
                : currentIds.filter((id) => id !== eventId)
        );
    }

    return (
        <main className="page-shell">
            <div className="mb-8 text-center">
                <p className="eyebrow">What&apos;s on</p><h1 className="page-title mt-2">Discover events</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find events happening around Warwick.
                </p>
            </div>

            {loadError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700" role="alert">
                    {loadError}
                </p>
            )}
            {!loadError && events === null && (
                <p className="state-panel">Loading events...</p>
            )}
            {events?.length === 0 && (
                <div className="state-panel mt-8">
                    <p className="text-base leading-7 text-slate-600 sm:text-lg">
                        No upcoming events found.
                    </p>
                </div>
            )}
            {events && events.length > 0 && (
                <EventList
                    events={events}
                    bookmarkedIds={bookmarkedIds}
                    onBookmarkChange={handleBookmarkChange}
                />
            )}
        </main>
    );
}

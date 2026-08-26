"use client";

import EventList from "@/components/EventList";
import { GetBookmarks } from "@/services/bookmarks";
import { Event } from "@/types/events";
import { useEffect, useState } from "react";

export default function BookmarksPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        async function loadBookmarks() {
            try {
                const data = await GetBookmarks();
                setEvents(data);
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : "Failed to load bookmarks");
            } finally {
                setIsLoading(false);
            }
        }

        void loadBookmarks();
    }, []);

    function handleBookmarkChange(eventId: number, isBookmarked: boolean) {
        if (!isBookmarked) {
            setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
        }
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Bookmarked Events</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find events happening around Warwick.
                </p>
            </div>

            {loadError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700" role="alert">
                    {loadError}
                </p>
            )}
            {isLoading && (
                <p className="text-center text-slate-600">Loading bookmarks...</p>
            )}
            {!isLoading && !loadError && events.length === 0 && (
                <div className="mt-8 text-center">
                    <p className="text-base leading-7 text-slate-600 sm:text-lg">
                        No bookmarked events found.
                    </p>
                </div>
            )}
            {!isLoading && events.length > 0 && (
                <EventList
                    events={events}
                    bookmarkedIds={events.map((event) => event.id)}
                    onBookmarkChange={handleBookmarkChange}
                />
            )}
        </main>
    );
}

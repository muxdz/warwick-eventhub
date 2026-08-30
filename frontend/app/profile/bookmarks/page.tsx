"use client";

import EventList from "@/components/EventList";
import { GetBookmarks } from "@/services/bookmarks";
import { Event } from "@/types/events";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

export default function BookmarksPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const { token, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) {
            return;
        }

        async function loadBookmarks() {
            try {
                const data = token ? await GetBookmarks(token) : [];
                setEvents(data);
            } catch (error) {
                if (error instanceof ApiError) {
                    if (error.status === 401) {
                        setLoadError("Please log in to view your bookmarks");
                    }
                    else if (error.status == 403) {
                        setLoadError("You do not have permission to view your bookmarks");
                    }
                    else if (error.status === 404) {
                        setLoadError("No bookmarks found");
                    }
                    else if (error.status === 422) {
                        setLoadError("Invalid request");
                    }
                    else if (error.status === 500) {
                        setLoadError("Internal server error");
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }

        void loadBookmarks();
    }, [authLoading, token]);

    function handleBookmarkChange(eventId: number, isBookmarked: boolean) {
        if (!isBookmarked) {
            setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
        }
    }

    return (
        <main className="page-shell">
            <div className="mb-8 text-center">
                <p className="eyebrow">Saved for later</p><h1 className="page-title mt-2">Bookmarked events</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Keep track of the Warwick events you don&apos;t want to miss.
                </p>
            </div>

            {loadError && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700" role="alert">
                    {loadError}
                </p>
            )}
            {isLoading && (
                <p className="state-panel">Loading bookmarks...</p>
            )}
            {!isLoading && !loadError && events.length === 0 && (
                <div className="state-panel mt-8">
                    <p className="text-base leading-7 text-slate-600 sm:text-lg">
                        No bookmarked events yet.
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

"use client";

import { RemoveBookmark, AddBookmark } from "@/services/bookmarks";

import { useEffect, useState } from "react";
import type { Event } from "@/types/events";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

type EventCardProps = {
    event: Event;
    isBookmarked: boolean;
    onBookmarkChange?: (eventId: number, isBookmarked: boolean) => void;
};

export default function EventCard({
    event,
    isBookmarked,
    onBookmarkChange,
}: EventCardProps) {
    const startTime = new Date(event.start_time);
    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const [isUpdating, setIsUpdating] = useState(false);
    const [bookmarkError, setBookmarkError] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        setBookmarked(isBookmarked);
    }, [isBookmarked]);

    async function handleBookmark(event_id: number) {
        const nextBookmarked = !bookmarked;
        setIsUpdating(true);
        setBookmarkError("");

        try {
            if (!token) {
                throw new ApiError("Please log in to bookmark events", 401);
            }

            if (bookmarked) {
                await RemoveBookmark(event_id, token);
            } else {
                await AddBookmark(event_id, token);
            }

            setBookmarked(nextBookmarked);
            onBookmarkChange?.(event_id, nextBookmarked);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setBookmarkError("Please log in to bookmark events");
                }
                else if (error.status === 403) {
                    setBookmarkError("You do not have permission to bookmark this event");
                }
                else if (error.status === 404) {
                    setBookmarkError("Event not found");
                }
                else if (error.status === 422) {
                    setBookmarkError("Invalid request");
                }
                else if (error.status === 500) {
                    setBookmarkError("Internal server error");
                }
            }
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <article className="card interactive-card flex h-full flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#eee5fc] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#44188c]">Event</span>
                <time className="text-sm font-medium text-slate-500" dateTime={event.start_time}>{startTime.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</time>
            </div>
            <Link
                href={`/events/${event.id}`}
                className="rounded text-[#44188c] hover:text-[#7442c6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8550da]"
            >
                <h2 className="text-xl font-semibold leading-snug">
                    {event.event_title}
                </h2>
            </Link>

            <p className="mt-4 flex items-center gap-2 font-medium text-slate-700">
                <span aria-hidden="true">⌖</span>{event.event_location}
            </p>

            <p className="mt-1 text-sm text-slate-600">
                <time dateTime={event.start_time}>{startTime.toLocaleString("en-GB")}</time>
            </p>

            {event.description && (
                <p className="mt-4 line-clamp-3 flex-1 leading-7 text-slate-600">
                    {event.description}
                </p>
            )}

            <button
                type="button"
                onClick={() => handleBookmark(event.id)}
                disabled={isUpdating}
                className={`btn mt-5 self-start ${bookmarked ? "btn-soft" : "btn-secondary"}`}
            >
                {isUpdating ? "Updating..." : bookmarked ? "Remove bookmark" : "Bookmark"}
            </button>
            {bookmarkError && (
                <p className="mt-2 text-sm text-red-700" role="alert">
                    {bookmarkError}
                </p>
            )}
        </article>
    );
}

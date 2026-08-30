"use client";

import { useState } from "react";

import EventCard from "./EventCard";
import type { Event } from "@/types/events";

type EventListProps = {
    events: Event[];
    bookmarkedIds?: number[];
    onBookmarkChange?: (eventId: number, isBookmarked: boolean) => void;
};

export default function EventList({ events, bookmarkedIds, onBookmarkChange }: EventListProps) {
    const [search, setSearch] = useState("");

    const filteredEvents = events.filter((event) =>
        event.event_title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        event.event_location
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="card mb-8 flex flex-col gap-3 p-3 sm:flex-row">
                <label htmlFor="event-search" className="sr-only">
                    Search events by name or location
                </label>
                <input
                    id="event-search"
                    type="search"
                    placeholder="Search by event or location"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="field-input min-w-0 flex-1 border-0 bg-[#faf8ff]"
                />

                <button
                    type="button"
                    onClick={() => setSearch("")}
                    disabled={!search}
                    className="btn btn-secondary sm:w-auto"
                >
                    Clear
                </button>
            </div>

            {filteredEvents.length === 0 ? (
                <p className="state-panel">
                    No events match your search. Try another search.
                </p>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isBookmarked={bookmarkedIds?.includes(event.id) ?? false}
                            onBookmarkChange={onBookmarkChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

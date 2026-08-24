"use client";

import { useState } from "react";

import EventCard from "./EventCard";
import type { Event } from "@/types/events";

type EventListProps = {
    events: Event[];
};

export default function EventList({ events }: EventListProps) {
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
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="event-search" className="sr-only">
                    Search events by name or location
                </label>
                <input
                    id="event-search"
                    type="search"
                    placeholder="Search by event or location"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />

                <button
                    type="button"
                    onClick={() => setSearch("")}
                    disabled={!search}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    Clear
                </button>
            </div>

            {filteredEvents.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-700">
                    No events found. Try another search.
                </p>
            ) : (
                <div className="grid gap-5 md:grid-cols-2">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

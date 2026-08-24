import { events } from '@/data/events';

import EventList from "@/components/EventList";

export default function EventsPage() {
    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Events</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find events happening around Warwick.
                </p>
            </div>

            <EventList events={events} />
        </main>
    );
}

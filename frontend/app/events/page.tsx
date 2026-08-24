import EventList from "@/components/EventList";
import { GetEvents } from "@/services/events"; //GetEvents from "@/services/events";
import { notFound } from "next/navigation";

export default async function EventsPage() {
    const events = await GetEvents();

    if (!events) {
        return notFound();
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Events</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find events happening around Warwick.
                </p>
            </div>

            {events.length === 0 && (
                <div className="mt-8 text-center">
                    <p className="text-base leading-7 text-slate-600 sm:text-lg">
                        No upcoming events found.
                    </p>
                </div>
            )}
            <EventList events={events} />
        </main>
    );
}

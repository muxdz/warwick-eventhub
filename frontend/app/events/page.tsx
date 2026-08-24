import EventCard from "@/components/EventCard";
import { events } from '@/data/events';

export default function EventsPage() {
    return (
        <main className="mx-auto max-w-6xl p-6">
            <h1 className="mb-6 text-3xl font-bold">Events</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                 ))}
            </div>
        </main>
    );
}
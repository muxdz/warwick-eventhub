import type { Event } from "@/types/events";
import Link from "next/link";

type EventCardProps = {
    event: Event;
};

export default function EventCard({ event }: EventCardProps){
    const startTime = new Date(event.start_time);

    return (
        <article className="rounded-lg border p-4">
            <Link href={`/events/${event.id}`} className="text-xl font-semibold hover:underline">
            <h2 className="text-xl font-semibold">
                {event.event_title}
            </h2>
            </Link>

            <p className="mt-2">
                {event.event_location}
            </p>

            <p className="text-sm">
                {startTime.toLocaleString("en-GB")}
            </p>

            {event.description && (
                <p className="mt-3">
                    {event.description}
                </p>
            )}
        </article>
    );
}
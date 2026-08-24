import type { Event } from "@/types/events";
import Link from "next/link";

type EventCardProps = {
    event: Event;
};

export default function EventCard({ event }: EventCardProps){
    const startTime = new Date(event.start_time);

    return (
        <article className="h-full rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <Link
                href={`/events/${event.id}`}
                className="text-slate-950 hover:text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
                <h2 className="text-xl font-semibold leading-snug">
                    {event.event_title}
                </h2>
            </Link>

            <p className="mt-4 font-medium text-slate-700">
                {event.event_location}
            </p>

            <p className="mt-1 text-sm text-slate-600">
                <time dateTime={event.start_time}>{startTime.toLocaleString("en-GB")}</time>
            </p>

            {event.description && (
                <p className="mt-4 leading-7 text-slate-700">
                    {event.description}
                </p>
            )}
        </article>
    );
}

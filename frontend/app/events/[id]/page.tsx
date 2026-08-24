import { events } from "@/data/events";
import Link from "next/link";
import { notFound } from "next/navigation";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({
  params,
}: EventPageProps) {
  const { id } = await params;

  const eventID = Number(id);
  const event = events.find(
    (event) => event.id === eventID
  );

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/events"
        className="inline-flex rounded-md py-2 font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        ← Back to events
      </Link>

      <article className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
        <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          {event.event_title}
        </h1>

        <dl className="mt-8 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</dt>
            <dd className="mt-1 text-lg text-slate-900">{event.event_location}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">Date and time</dt>
            <dd className="mt-1 text-lg text-slate-900">
              <time dateTime={event.start_time}>
                {new Date(event.start_time).toLocaleString("en-GB")}
              </time>
            </dd>
          </div>
        </dl>

        {event.description && (
          <div className="mt-7">
            <h2 className="text-xl font-semibold text-slate-950">About this event</h2>
            <p className="mt-3 max-w-prose text-base leading-7 text-slate-700 sm:text-lg">
              {event.description}
            </p>
          </div>
        )}
      </article>
    </main>
  );
}

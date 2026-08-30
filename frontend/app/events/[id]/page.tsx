import Link from "next/link";
import { GetEvent } from "@/services/events";
import notFound from "@/app/events/[id]/not-found";
import EventActions from "@/components/EventActions";

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
  const event = await GetEvent(eventID);

  if (!event) {
    return notFound();
  }

  return (
    <main className="page-shell-narrow">
      <Link
        href="/events"
        className="text-link inline-flex py-2"
      >
        ← Back to events
      </Link>

      <article className="card mt-5 p-6 sm:p-9">
        <span className="rounded-full bg-[#eee5fc] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#44188c]">Warwick event</span><h1 className="mt-4 text-3xl font-bold leading-tight text-[#44188c] sm:text-4xl">
          {event.event_title}
        </h1>

        <dl className="mt-8 grid gap-5 rounded-xl bg-[#faf8ff] p-5 sm:grid-cols-2">
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
            <h2 className="text-xl font-semibold text-[#44188c]">About this event</h2>
            <p className="mt-3 max-w-prose text-base leading-7 text-slate-700 sm:text-lg">
              {event.description}
            </p>
          </div>
        )}

        <EventActions 
          eventId={eventID}
          createdByUserId={event.created_by_user_id}  
        />
      </article>
    </main>
  );
}

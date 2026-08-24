import { events } from "@/data/events";
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
  )

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
    <h1 className="text-3xl font-bold">
      {event.event_title}
    </h1>

    <p>{event.event_location}</p>

    {event.description && (
      <p>{event.description}</p>
    )}
  </main>
  );
}
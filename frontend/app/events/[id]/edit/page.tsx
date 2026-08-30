import { GetEvent } from "@/services/events";
import { notFound } from "next/navigation";
import EditEventForm from "@/components/EditEventForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  const eventId = Number(id);

  const event = await GetEvent(eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="page-shell-narrow">
      <div className="mb-8 text-center"><p className="eyebrow">Event management</p><h1 className="page-title mt-2">Edit event</h1><p className="page-intro">Update the event information below.</p></div>
      <EditEventForm event={event} />
    </main>
  );
}

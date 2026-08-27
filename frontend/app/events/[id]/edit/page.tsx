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
    <main>
      <h1>Edit event</h1>

      <EditEventForm event={event} />
    </main>
  );
}
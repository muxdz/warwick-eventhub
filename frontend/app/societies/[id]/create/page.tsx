import EventCreate from "@/components/EventCreate";

type CreateEventFormProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventCreatePage({ 
    params,
}: CreateEventFormProps
) {
    const { id } = await params;
    const societyId = Number(id);

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
            <EventCreate societyId={societyId} />
        </main>
    );
}

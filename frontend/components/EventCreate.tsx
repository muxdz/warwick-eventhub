"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateEvent } from "@/services/events";

type CreateEventFormProps = {
    societyId: number;
}

function toTimestampWithTimezone(localDateTime: string) {
    const date = new Date(localDateTime);
    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? "+" : "-";
    const absoluteOffset = Math.abs(offsetMinutes);
    const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
    const offsetRemainder = String(absoluteOffset % 60).padStart(2, "0");

    return `${localDateTime}:00${offsetSign}${offsetHours}:${offsetRemainder}`;
}

export default function EventCreate({ societyId }: CreateEventFormProps) {
    const [formData, setFormData] = useState({
        event_title: "",
        event_location: "",
        start_time: "",
        end_time: "",
        description: "",
        image_key: ""
    })
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError ] = useState<string | null>(null);

    async function handleCreateEvent(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const eventData = new URLSearchParams();

            eventData.append("event_title", formData.get("event_title") as string);
            eventData.append("event_location", formData.get("event_location") as string);
            eventData.append("start_time", formData.get("start_time") as string);
            eventData.append("end_time", formData.get("end_time") as string);
            eventData.append("description", formData.get("description") as string);
            eventData.append("society_id", societyId.toString());
            eventData.append("image_key", formData.get("image_key") as string);

            const data = await CreateEvent(eventData);

            router.push(`/events/${data.id}`);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    }

    return (
        <form onSubmit={handleCreateEvent}>
            <input 
                id="event_title" 
                name="event_title" 
                type="text" 
                value={formData.event_title} 
                onChange={(event) => setFormData({ ...formData, event_title: event.target.value })} 
                placeholder="Event Title"
                required
            />
            <input 
                id="event_location" 
                name="event_location" 
                type="text" 
                value={formData.event_location} 
                onChange={(event) => setFormData({ ...formData, event_location: event.target.value })} 
                placeholder="Event Location"
                required
            />
            <input 
                id="start_time" 
                name="start_time" 
                type="datetime-local" 
                value={formData.start_time} 
                onChange={(event) => setFormData({ ...formData, start_time: event.target.value })} 
                placeholder="Start Time"
                required
            />
            <input 
                id="end_time" 
                name="end_time" 
                type="datetime-local" 
                value={formData.end_time} 
                onChange={(event) => setFormData({ ...formData, end_time: event.target.value })} 
                placeholder="End Time"
            />
            <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                placeholder="Description"
            />
            <input
                id="image_key"
                name="image_key"
                type="text"
                value={formData.image_key}
                onChange={(event) => setFormData({ ...formData, image_key: event.target.value })}
                placeholder="Image Key"
            />
            <button type="submit">Create Event</button>
        </form>
    );
}

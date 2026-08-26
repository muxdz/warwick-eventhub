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
    const [eventTitle, setEventTitle] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");
    const [imageKey, setImageKey] = useState("");
    const router = useRouter();

    async function handleCreateEvent(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const eventData = new URLSearchParams(); 
    
        eventData.append("event_title", formData.get("event_title") as string);
        eventData.append("event_location", formData.get("event_location") as string);
        eventData.append("start_time", toTimestampWithTimezone(startTime));

        if (endTime) {
            eventData.append("end_time", toTimestampWithTimezone(endTime));
        }
        eventData.append("description", formData.get("description") as string);
        eventData.append("society_id", societyId.toString());
        eventData.append("image_key", formData.get("image_key") as string);

        const data = await CreateEvent(eventData);

        router.push(`/events/${data.id}`);
    }

    return (
        <form onSubmit={handleCreateEvent}>
            <input 
                id="event_title" 
                name="event_title" 
                type="text" 
                value={eventTitle} 
                onChange={(event) => setEventTitle(event.target.value)} 
                placeholder="Event Title"
                required
            />
            <input 
                id="event_location" 
                name="event_location" 
                type="text" 
                value={eventLocation} 
                onChange={(event) => setEventLocation(event.target.value)} 
                placeholder="Event Location"
                required
            />
            <input 
                id="start_time" 
                name="start_time" 
                type="datetime-local" 
                value={startTime} 
                onChange={(event) => setStartTime(event.target.value)} 
                placeholder="Start Time"
                required
            />
            <input 
                id="end_time" 
                name="end_time" 
                type="datetime-local" 
                value={endTime} 
                onChange={(event) => setEndTime(event.target.value)} 
                placeholder="End Time"
            />
            <input
                id="description"
                name="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
            />
            <input
                id="image_key"
                name="image_key"
                type="text"
                value={imageKey}
                onChange={(event) => setImageKey(event.target.value)}
                placeholder="Image Key"
            />
            <button type="submit">Create Event</button>
        </form>
    );
}

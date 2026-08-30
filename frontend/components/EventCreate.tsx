"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateEvent } from "@/services/events";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";
import { isOrganiser } from "@/services/auth";

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
    const { token, user } = useAuth();

    async function handleCreateEvent(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new ApiError("No token", 401);
            }

            const canCreate = await isOrganiser(token, societyId);

            if (!canCreate) {
                throw new ApiError("Not an organiser", 403);
            }

            const eventData = new URLSearchParams();

            eventData.append("event_title", formData.get("event_title") as string);
            eventData.append("event_location", formData.get("event_location") as string);

            if (!formData.get("start_time")) {
                throw new ApiError("Start time is required", 422);
            }

            eventData.append("start_time", toTimestampWithTimezone(formData.get("start_time") as string));
            
            if (formData.get("end_time")) {
                eventData.append("end_time", toTimestampWithTimezone(formData.get("end_time") as string));
            }

            eventData.append("description", formData.get("description") as string);
            eventData.append("society_id", societyId.toString());
            eventData.append("image_key", formData.get("image_key") as string);

            const data = await CreateEvent(eventData, token);

            router.push(`/events/${data.id}`);
        } catch (error) {
            console.error(error);

            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setError("Please log in to create events");
                }
                else if (error.status === 403) {
                    setError("You do not have permission to create events");
                }
                else if (error.status === 404) {
                    setError("Society not found");
                }
                else if (error.status === 422) {
                    setError("Invalid request");
                }
                else if (error.status === 500) {
                    setError("Internal server error");
                }
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <form onSubmit={handleCreateEvent}>
            {error && <p role="alert">{error}</p>}
            <label htmlFor="event_title">Event Title</label>
            <input 
                id="event_title" 
                name="event_title" 
                type="text" 
                value={formData.event_title} 
                onChange={(event) => setFormData({ ...formData, event_title: event.target.value })} 
                placeholder="Event Title"
                required
            />
            <label htmlFor="event_location">Event Location</label>
            <input 
                id="event_location" 
                name="event_location" 
                type="text" 
                value={formData.event_location} 
                onChange={(event) => setFormData({ ...formData, event_location: event.target.value })} 
                placeholder="Event Location"
                required
            />
            <label htmlFor="start_time">Start Time</label>
            <input 
                id="start_time" 
                name="start_time" 
                type="datetime-local" 
                value={formData.start_time} 
                onChange={(event) => setFormData({ ...formData, start_time: event.target.value })} 
                placeholder="Start Time"
                required
            />
            <label htmlFor="end_time">End Time</label>
            <input 
                id="end_time" 
                name="end_time" 
                type="datetime-local" 
                value={formData.end_time} 
                onChange={(event) => setFormData({ ...formData, end_time: event.target.value })} 
                placeholder="End Time"
            />
            <label htmlFor="description">Description</label>
            <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                placeholder="Description"
            />
            <label htmlFor="image_key">Image Key</label>
            <input
                id="image_key"
                name="image_key"
                type="text"
                value={formData.image_key}
                onChange={(event) => setFormData({ ...formData, image_key: event.target.value })}
                placeholder="Image Key"
            />
            <button 
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
}

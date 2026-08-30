"use client";

import { useState } from "react";
import type { Event as EventData } from "@/types/events";
import { UpdateEvent, type EventUpdate } from "@/services/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/errors";

type Props = {
  event: EventData;
};

function toTimestampWithTimezone(localDateTime: string) {
    const date = new Date(localDateTime);
    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? "+" : "-";
    const absoluteOffset = Math.abs(offsetMinutes);
    const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
    const offsetRemainder = String(absoluteOffset % 60).padStart(2, "0");

    return `${localDateTime}:00${offsetSign}${offsetHours}:${offsetRemainder}`;
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditEventForm({ event }: Props) {
  const originalStartTime = toTimestampWithTimezone(event.start_time);
  const originalEndTime = toTimestampWithTimezone(event.end_time ?? "");

  const [title, setTitle] = useState(event.event_title);
  const [location, setLocation] = useState(event.event_location);
  const [description, setDescription] = useState(event.description ?? "");
  const [startTime, setStartTime] = useState(toDateTimeLocal(event.start_time));
  const [endTime, setEndTime] = useState(toDateTimeLocal(event.end_time));

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new ApiError("No token", 401);
      }

      const updates: EventUpdate = {};

      if (title !== event.event_title) {
        updates.event_title = title;
      }

      if (location !== event.event_location) {
        updates.event_location = location;
      }

      if (description !== event.description) {
        updates.description = description;
      }

      if (startTime !== toDateTimeLocal(originalStartTime)) {
        updates.start_time = toTimestampWithTimezone(startTime);
      }

      if (endTime !== toDateTimeLocal(originalEndTime)) {
        updates.end_time = endTime ?toTimestampWithTimezone(endTime): null;
      }

      if (Object.keys(updates).length === 0) {
        throw new ApiError("No updates", 422);
      }

      await UpdateEvent(event.id, updates, token);
      console.log("Event updated");

      router.push(`/events/${event.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Please log in to save changes");
        }
        else if (error.status == 403) {
          setError("You do not have permission to save changes");
        }
        else if (error.status === 404) {
          setError("Event not found");
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
    <form onSubmit={handleSubmit} className="styled-form">
      {error && <p role="alert">{error}</p>}
      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="location">Location</label>
      <input
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="start_time">Start Time</label>
      <input
        id="start_time"
        value={startTime}
        type="datetime-local"
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label htmlFor="end_time">End Time</label>
      <input
        id="end_time"
        value={endTime}
        type="datetime-local"
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button 
        disabled={loading} 
        type="submit"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

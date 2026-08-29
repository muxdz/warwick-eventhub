"use client";

import { useState } from "react";
import type { Event as EventData } from "@/types/events";
import { UpdateEvent, type EventUpdate } from "@/services/events";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
        throw new Error("No token");
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
        throw new Error("No updates");
      }

      await UpdateEvent(event.id, updates, token);
      console.log("Event updated");

      router.push(`/events/${event.id}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        value={startTime}
        type="datetime-local"
        onChange={(e) => setStartTime(e.target.value)}
      />

      <input
        value={endTime}
        type="datetime-local"
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button 
        disabled={loading} 
        type="submit"
      >
        Save changes
      </button>
    </form>
  );
}

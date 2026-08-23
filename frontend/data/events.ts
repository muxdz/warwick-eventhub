import type { Event } from "@/types/events";

export const events: Event[] = [
  {
    id: 1,
    event_title: "Computing Society Welcome Social",
    event_location: "FAB",
    start_time: "2026-10-05T18:00:00+01:00",
    end_time: "2026-10-05T20:00:00+01:00",
    description: "Meet other students and learn about the society.",
    society_id: 1,
  },
  {
    id: 2,
    event_title: "Board Games Night",
    event_location: "Oculus",
    start_time: "2026-10-07T19:00:00+01:00",
    end_time: null,
    description: "An evening of board games and socialising.",
    society_id: 2,
  },
  {
    id: 3,
    event_title: "Hackathon Introduction",
    event_location: "DCS",
    start_time: "2026-10-10T14:00:00+01:00",
    end_time: "2026-10-10T16:00:00+01:00",
    description: null,
    society_id: 1,
  },
];
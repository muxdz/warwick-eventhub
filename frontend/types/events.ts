export type Event = {
    id: number;
    event_title: string;
    event_location: string;
    start_time: string;
    end_time: string | null;
    description: string | null;
    society_id: number;
}
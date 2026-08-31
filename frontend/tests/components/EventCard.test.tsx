import type { Event } from "@/types/events";
import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import EventCard from "@/components/EventCard";
import { AuthProvider } from "@/context/AuthContext";

const testEvent: Event = {
    id: 1,
    event_title: "Test Event",
    event_location: "Test Location",
    start_time: "2026-10-10T10:00:00+01",
    end_time: "2026-10-10T12:00:00+01",
    description: "Test Description",
    image_key: "test-image-key",
    society_id: 1,
    created_by_user_id: 1
}

const handleBookmarkChange = vi.fn();

test("renders event title", () => {
    render(
        <AuthProvider>
        <EventCard 
            event={testEvent}
            isBookmarked={false} 
            onBookmarkChange={handleBookmarkChange}
        />
        </AuthProvider>
    );
    
    expect(
        screen.getByText("Test Event")
    ).toBeInTheDocument();
});

test("renders event location", () => {
    render(
        <AuthProvider>
        <EventCard 
            event={testEvent}
            isBookmarked={false} 
            onBookmarkChange={handleBookmarkChange}
        />
        </AuthProvider>
    );
    
    expect(
        screen.getByText("Test Location")
    ).toBeInTheDocument();
})
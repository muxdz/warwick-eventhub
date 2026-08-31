import type { Event } from "@/types/events";
import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import EventList from "@/components/EventList";
import { AuthProvider } from "@/context/AuthContext";
import userEvent from "@testing-library/user-event";

const baseEvent: Event = {
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

const events: Event[] = [
    {
        ...baseEvent,
        id: 1,
        event_title: "Cloud",
    },
    {
        ...baseEvent,
        id: 2,
        event_title: "Python",
    },
    {
        ...baseEvent,
        id: 3,
        event_title: "Badminton",
    }
];

const user = userEvent.setup();

test("renders events", () => {
    render(
        <AuthProvider>
        <EventList 
            events={events}
            bookmarkedIds={[]} 
            onBookmarkChange={vi.fn()}
        />
        </AuthProvider>
    );
    
    expect(
        screen.getByText("Cloud")
    ).toBeInTheDocument();
    expect(
        screen.getByText("Python")
    ).toBeInTheDocument();
    expect(
        screen.getByText("Badminton")
    ).toBeInTheDocument();
})

test("renders search bar", () => {
    render(
        <AuthProvider>
        <EventList 
            events={events}
            bookmarkedIds={[]} 
            onBookmarkChange={vi.fn()}
        />
        </AuthProvider>
    );
    
    expect(
        screen.getByRole("searchbox", { name: /search events/i })
    ).toBeInTheDocument();
})

test("search bar works", async () => {
    render(
        <AuthProvider>
        <EventList 
            events={events}
            bookmarkedIds={[]} 
            onBookmarkChange={vi.fn()}
        />
        </AuthProvider>
    );

    const searchInput = screen.getByRole("searchbox", { name: /search events/i });

    await user.type(searchInput, "Cloud");

    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.queryByText("Python")).not.toBeInTheDocument();
    expect(screen.queryByText("Badminton")).not.toBeInTheDocument();
})

test("search returns no results", async () => {
    render(
        <AuthProvider>
        <EventList 
            events={events}
            bookmarkedIds={[]} 
            onBookmarkChange={vi.fn()}
        />
        </AuthProvider>
    );

    const searchInput = screen.getByLabelText(/search events/i);

    await user.type(searchInput, "zzzzz");

    expect(screen.queryByText("Cloud")).not.toBeInTheDocument();
    expect(screen.queryByText("Python")).not.toBeInTheDocument();
    expect(screen.queryByText("Badminton")).not.toBeInTheDocument();
})

test("clear button works", async () => {
    render(
        <AuthProvider>
        <EventList 
            events={events}
            bookmarkedIds={[]} 
            onBookmarkChange={vi.fn()}
        />
        </AuthProvider>
    );

    const searchInput = screen.getByLabelText(/search events/i);

    await user.type(searchInput, "Cloud");
    expect(screen.getByText("Cloud")).toBeInTheDocument();
    expect(screen.queryByText("Python")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(screen.getByText("Cloud")).toBeInTheDocument();
})
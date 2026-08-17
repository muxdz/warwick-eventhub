from app.schemas import Event

event1 = Event(
    id = 1,
    event_title = "Welcome Event",
    event_location = "Oculus",
    start_time = "2023-05-01 10:00:00",
    end_time = "2023-05-01 12:00:00",
    society_id = 1,
    created_by_user_id = 1
)

event2 = Event(
    id = 2,
    event_title = "Welcome Event 2 ",
    event_location = "FAB",
    start_time = "2024-05-01 10:00:00",
    society_id = 1,
    created_by_user_id = 1
)

event3 = Event(
    id = 3,
    event_title = "Welcome Event",
        event_location = "Oculus",
        start_time = "2025-05-01 10:00:00",
        society_id = 1,
        created_by_user_id = 1
)

events = [event1, event2, event3]
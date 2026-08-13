from app.schemas import Event

event1 = Event(
    id = 1,
    title = "Welcome Event",
    society = "Rowing Society",
    location = "Oculus"
)

event2 = Event(
    id = 2,
    title = "Meet the Exec Event",
    society = "Badminton Society",
    location = "Oculus"
)

event3 = Event(
    id = 3,
    title = "Painting Event",
    society = "Painting Society",
    location = "FAB"
)

events = [event1, event2, event3]
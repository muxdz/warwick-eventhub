import { events } from '@/data/events';

export default function Home() {
  return (
    <main>
      <h1>Warwick to EventHub</h1>
      <p>Discover events that are hapeening at Warwick.</p>
      
      {events.map((event) => (
        <div key={event.id}>
          <h2>{event.event_title}</h2>
          <p>{event.event_location}</p>
        </div>
      ))}
    </main>
  );
}

import EventCard from "@/components/EventCard";
import { events } from '@/data/events';

import SocietyCard from "@/components/SocietyCard";
import { societies } from '@/data/societies';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Warwick to EventHub</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
      {societies.map((society) => (
        <SocietyCard key={society.id} society={society} />
      ))}
      </div>
    </main>
  );
}

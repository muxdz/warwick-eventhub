import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Event not found</h1>
      <p>This event may have been deleted or does not exist.</p>

      <Link href="/events">
        Browse all events
      </Link>
    </main>
  );
}

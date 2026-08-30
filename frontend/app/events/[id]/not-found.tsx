import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell-narrow text-center">
      <div className="state-panel"><h1 className="page-title">Event not found</h1>
      <p className="page-intro">This event may have been deleted or does not exist.</p>

      <Link href="/events" className="btn btn-primary mt-7">
        Browse all events
      </Link></div>
    </main>
  );
}

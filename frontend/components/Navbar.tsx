import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white" aria-label="Main navigation">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" className="text-lg font-bold text-slate-950">
                    EventHub
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/events"
                        className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Events
                    </Link>
                </div>
            </div>
        </nav>
    );
}

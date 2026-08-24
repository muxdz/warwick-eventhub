import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="border-b">
            <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
                <Link href="/" className="font-bold">
                    EventHub
                </Link>

                <div className="flex gap-4">
                    <Link href="/events">
                        Events
                    </Link>
                </div>
            </div>
        </nav>
    );
}
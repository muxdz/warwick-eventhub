import Profile from "@/components/Profile";
import Link from "next/link";

export default function Page() {
    return (
        <main className="page-shell-narrow">
            <Profile />

            <Link 
                href="/profile/bookmarks"
                className="btn btn-primary mt-6 w-full"
            >
                View Bookmarks
            </Link>
        </main>
    );
}

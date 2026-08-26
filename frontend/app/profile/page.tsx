import Profile from "@/components/Profile";
import Link from "next/link";

export default function Page() {
    return (
        <main>
            <Profile />

            <Link 
                href="/profile/bookmarks"
                className="mt-8 block rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                View Bookmarks
            </Link>
        </main>
    );
}
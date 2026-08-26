import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
                Society not found
            </h1>
            <p className="mt-3 text-lg leading-7 text-slate-600">
                This society may have been deleted or does not exist.
            </p>
            <Link
                href="/societies"
                className="mt-7 inline-flex rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                Browse all societies
            </Link>
        </main>
    );
}

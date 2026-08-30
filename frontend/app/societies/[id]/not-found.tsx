import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <h1 className="page-title">
                Society not found
            </h1>
            <p className="mt-3 text-lg leading-7 text-slate-600">
                This society may have been deleted or does not exist.
            </p>
            <Link
                href="/societies"
                className="btn btn-primary mt-7"
            >
                Browse all societies
            </Link>
        </main>
    );
}

export default function Loading() {
    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="animate-pulse" aria-label="Loading societies">
                <div className="mx-auto h-10 w-48 rounded bg-slate-200" />
                <div className="mx-auto mt-4 h-6 w-72 max-w-full rounded bg-slate-200" />
                <div className="mt-8 h-12 rounded-lg bg-slate-200" />
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="h-40 rounded-2xl bg-slate-200" />
                    ))}
                </div>
            </div>
        </main>
    );
}

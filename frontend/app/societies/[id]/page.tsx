import Link from "next/link";
import { notFound } from "next/navigation";

import { GetSociety } from "@/services/societies";

type SocietyPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function SocietyPage({ params }: SocietyPageProps) {
    const { id } = await params;
    const societyId = Number(id);

    if (!Number.isInteger(societyId) || societyId < 1) {
        notFound();
    }

    const society = await GetSociety(societyId);

    if (!society) {
        notFound();
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
            <Link
                href="/societies"
                className="inline-flex rounded-md py-2 font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                &larr; Back to societies
            </Link>

            <article className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
                <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                    {society.society_name}
                </h1>

                <dl className="mt-8 border-y border-slate-200 py-6">
                    <div>
                        <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            On EventHub since
                        </dt>
                        <dd className="mt-1 text-lg text-slate-900">
                            <time dateTime={new Date(society.created_at).toISOString()}>
                                {new Date(society.created_at).toLocaleDateString("en-GB")}
                            </time>
                        </dd>
                    </div>
                </dl>

                <div className="mt-7">
                    <Link
                        href={`/societies/${society.id}/create`}
                        className="inline-flex rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Create an event
                    </Link>
                </div>
            </article>
        </main>
    );
}

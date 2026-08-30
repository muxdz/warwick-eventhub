import Link from "next/link";
import { notFound } from "next/navigation";
import { GetSociety } from "@/services/societies";
import SocietyAction from "@/components/SocietyActions";

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
        <main className="page-shell-narrow">
            <Link
                href="/societies"
                className="text-link inline-flex py-2"
            >
                &larr; Back to societies
            </Link>

            <article className="card mt-5 p-6 sm:p-9">
                <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-[#eee5fc] text-xl font-bold text-[#7442c6]" aria-hidden="true">{society.society_name.charAt(0).toUpperCase()}</span><h1 className="text-3xl font-bold leading-tight text-[#44188c] sm:text-4xl">
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

                   <SocietyAction societyId={society.id} />

            </article>
        </main>
    );
}

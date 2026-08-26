import type { Society } from "@/types/societies";
import Link from "next/link";

type SocietyCardProps = {
    society: Society;
};

export default function SocietyCard({ society }: SocietyCardProps) {
    return (
        <article className="h-full rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <Link
                href={`/societies/${society.id}`}
                className="text-slate-950 hover:text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
                <h2 className="text-xl font-semibold leading-snug">
                    {society.society_name}
                </h2>
            </Link>

            <p className="mt-4 text-sm text-slate-600">
                Added {new Date(society.created_at).toLocaleDateString("en-GB")}
            </p>
        </article>
    );
}

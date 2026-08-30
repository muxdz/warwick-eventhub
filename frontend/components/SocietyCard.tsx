import type { Society } from "@/types/societies";
import Link from "next/link";

type SocietyCardProps = {
    society: Society;
};

export default function SocietyCard({ society }: SocietyCardProps) {
    return (
        <article className="card interactive-card flex h-full flex-col p-5 sm:p-6">
            <Link
                href={`/societies/${society.id}`}
                className="rounded text-[#44188c] hover:text-[#7442c6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8550da]"
            >
                <h2 className="text-xl font-semibold leading-snug">
                    {society.society_name}
                </h2>
            </Link>

            <p className="mt-4 text-sm text-slate-500">
                Added {new Date(society.created_at).toLocaleDateString("en-GB")}
            </p><span className="mt-5 text-sm font-semibold text-[#8550da]">View society →</span>
        </article>
    );
}

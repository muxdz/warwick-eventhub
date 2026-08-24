import type { Society } from "@/types/societies";

type SocietyCardProps = {
    society: Society;
};

export default function SocietyCard({ society }: SocietyCardProps) {
    return (
        <article className="h-full rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold leading-snug text-slate-950">
                {society.society_name}
            </h2>
        </article>
    );
}

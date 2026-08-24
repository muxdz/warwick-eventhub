import type { Society } from "@/types/societies";

type SocietyCardProps = {
    society: Society;
};

export default function SocietyCard({ society }: SocietyCardProps) {
    return (
        <article className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">
                {society.society_name}
            </h2>
        </article>
    );
}
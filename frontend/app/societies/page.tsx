import SocietyList from "@/components/SocietyList";
import { GetSocieties } from "@/services/societies";
import Link from "next/link";

export default async function SocietiesPage() {
    const societies = await GetSocieties();

    return (
        <main className="page-shell">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><p className="eyebrow">Find your community</p><h1 className="page-title mt-2">Societies</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find student societies at Warwick.
                </p></div><Link href="/societies/create" className="btn btn-primary shrink-0">Create a society</Link>
            </div>

            {societies.length === 0 ? (
                <p className="state-panel mt-8">
                    No societies found.
                </p>
            ) : (
                <SocietyList societies={societies} />
            )}

        </main>
    );
}

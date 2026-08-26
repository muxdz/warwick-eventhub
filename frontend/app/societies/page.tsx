import SocietyList from "@/components/SocietyList";
import { GetSocieties } from "@/services/societies";

export default async function SocietiesPage() {
    const societies = await GetSocieties();

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Societies</h1>
                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                    Find student societies at Warwick.
                </p>
            </div>

            {societies.length === 0 ? (
                <p className="mt-8 text-center text-base leading-7 text-slate-600 sm:text-lg">
                    No societies found.
                </p>
            ) : (
                <SocietyList societies={societies} />
            )}
        </main>
    );
}

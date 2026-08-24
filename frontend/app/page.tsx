import SocietyCard from "@/components/SocietyCard";
import { GetSocieties } from "@/services/societies";

export default async function Home() {
  const societies = await GetSocieties();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Welcome to EventHub</h1>
      <p className="mt-3 text-lg leading-7 text-slate-600">Discover what&apos;s happening around campus.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {societies.map((society) => (
        <SocietyCard key={society.id} society={society} />
      ))}
      </div>
    </main>
  );
}

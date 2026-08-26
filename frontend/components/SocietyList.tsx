"use client";

import { useState } from "react";

import SocietyCard from "./SocietyCard";
import type { Society } from "@/types/societies";

type SocietyListProps = {
    societies: Society[];
};

export default function SocietyList({ societies }: SocietyListProps) {
    const [search, setSearch] = useState("");

    const filteredSocieties = societies.filter((society) =>
        society.society_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="society-search" className="sr-only">
                    Search societies by name
                </label>
                <input
                    id="society-search"
                    type="search"
                    placeholder="Search societies"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    disabled={!search}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    Clear
                </button>
            </div>

            {filteredSocieties.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-700">
                    No societies match your search. Try another search.
                </p>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSocieties.map((society) => (
                        <SocietyCard key={society.id} society={society} />
                    ))}
                </div>
            )}
        </div>
    );
}

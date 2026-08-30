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
            <div className="card mb-8 flex flex-col gap-3 p-3 sm:flex-row">
                <label htmlFor="society-search" className="sr-only">
                    Search societies by name
                </label>
                <input
                    id="society-search"
                    type="search"
                    placeholder="Search societies"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="field-input min-w-0 flex-1 border-0 bg-[#faf8ff]"
                />
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    disabled={!search}
                    className="btn btn-secondary sm:w-auto"
                >
                    Clear
                </button>
            </div>

            {filteredSocieties.length === 0 ? (
                <p className="state-panel">
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

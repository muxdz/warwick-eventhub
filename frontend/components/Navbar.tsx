"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AUTH_CHANGED_EVENT, checkAuth } from "@/services/auth";

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function checkLoggedIn() {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setLoggedIn(false);
                return;
            }

            try {
                const response = await checkAuth(token);
                setLoggedIn(response.ok);

                if (!response.ok) {
                    localStorage.removeItem("access_token");
                }
            } catch {
                setLoggedIn(false);
            }
        }

        void checkLoggedIn();
        window.addEventListener(AUTH_CHANGED_EVENT, checkLoggedIn);

        return () => window.removeEventListener(AUTH_CHANGED_EVENT, checkLoggedIn);
    }, []);

    function handleLogout() {
        localStorage.removeItem("access_token");
        setLoggedIn(false);
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }

    return (
        <nav className="border-b border-slate-200 bg-white" aria-label="Main navigation">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" className="text-lg font-bold text-slate-950">
                    EventHub
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/societies"
                        className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Societies
                    </Link>
                    <Link
                        href="/events"
                        className="rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Events
                    </Link>
                </div>

                {loggedIn ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

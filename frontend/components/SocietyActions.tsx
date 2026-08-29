"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { isOrganiser } from "@/services/auth";
import Link from "next/link";

export default function SocietyActions({ societyId }: { societyId: number }) {
    const { token } = useAuth();
    const [ canEdit, setCanEdit ] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function checkCanEdit() {
            if (!token) {
                setCanEdit(false);
                return;
            }

            try {
                const organiser = await isOrganiser(token, societyId);

                if (!cancelled) {
                    setCanEdit(organiser);
                }
            } catch {
                if (!cancelled) {
                    setCanEdit(false);
                }
            }
        }

        void checkCanEdit();

        return () => {
            cancelled = true;
        };
    }, [token, societyId]);

    if (!canEdit) {
        return null;
    }

    return (
        <div className="mt-7">
                <Link
                    href={`/societies/${societyId}/create`}
                    className="inline-flex rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Create an event
                </Link>
       </div> 
    );
}

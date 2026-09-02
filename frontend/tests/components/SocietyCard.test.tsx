import type { Society } from "@/types/societies";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import SocietyCard from "@/components/SocietyCard";
import { AuthProvider } from "@/context/AuthContext";

const societyTest: Society = {
    id: 1,
    society_name: "Test Society",
    created_at: new Date("2026-10-05T18:00:00+01:00"),
};

test("renders society name", () => {
    render(
        <AuthProvider>
        <SocietyCard society={societyTest} />
        </AuthProvider>
    );
    
    expect(
        screen.getByText("Test Society")
    ).toBeInTheDocument();
})

test("renders date", () => {
    render(
        <AuthProvider>
        <SocietyCard society={societyTest} />
        </AuthProvider>
    );
    
    expect(
        screen.getByText("Added 05/10/2026")
    ).toBeInTheDocument();
})

test("renders link", () => {
    render(
        <AuthProvider>
        <SocietyCard society={societyTest} />
        </AuthProvider>
    );
    
    const link = screen.getByRole("link", {
        name: "Test Society"
    });
    expect(link).toHaveAttribute("href", "/societies/1");
})
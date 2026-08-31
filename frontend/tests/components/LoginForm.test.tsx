import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import LoginForm from "@/components/LoginForm";
import { AuthProvider } from "@/context/AuthContext";
import { userEvent } from "@testing-library/user-event";

const user = userEvent.setup();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
        useRouter: () => ({
            push: mockPush,
        }),
    }));

test("email field exists", () => {
    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );

    expect(
        screen.getByRole("textbox", { name: /email/i })
    ).toBeInTheDocument();
})

test("password field exists", () => {
    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );
    
    expect(
        screen.getByLabelText(/password/i)
    ).toBeInTheDocument();
})

test("login button exists", () => {
    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );
    
    expect(
        screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
})

test("email input works", async () => {
    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });

    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
})

test("password input works", async () => {
    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );

    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(passwordInput, "password");

    expect(passwordInput).toHaveValue("password");
})
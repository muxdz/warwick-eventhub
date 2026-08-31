import { render, screen } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";
import LoginForm from "@/components/LoginForm";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { userEvent } from "@testing-library/user-event";

const user = userEvent.setup();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
        useRouter: () => ({
            push: mockPush,
        }),
    }));

vi.mock("@/context/AuthContext", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/context/AuthContext")>();

    return {
        ...actual,
        useAuth: vi.fn(),
    }
});

const mockeduseAuth = vi.mocked(useAuth);
const mockLogin = vi.fn();

beforeEach(() => {
    mockLogin.mockReset();

    mockeduseAuth.mockReturnValue({
        user: null,
        token: null,
        loading: false,
        login: mockLogin,
        logout: vi.fn(),
    });
});

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

test("submits email and password", async () => {
    mockLogin.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(
        <AuthProvider>
        <LoginForm />
        </AuthProvider>
    );

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");
    await user.click(loginButton);

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password");
})
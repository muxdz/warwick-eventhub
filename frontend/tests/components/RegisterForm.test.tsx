import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi, beforeEach } from "vitest";
import RegisterForm from "@/components/RegisterForm";
import { ApiError } from "@/services/errors";

const { register, login, push } = vi.hoisted(() => ({ register: vi.fn(), login: vi.fn(), push: vi.fn() }));
vi.mock("@/services/auth", () => ({ Register: register }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ login }) }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
beforeEach(() => vi.resetAllMocks());

function submit(password: string, confirmation = password) {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: confirmation } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
}

test.each([
    ["Short!", "at least 10 characters"],
    ["lowercase!", "uppercase letter"],
    ["UPPERCASE!", "lowercase letter"],
    ["NoSymbols1", "one symbol"],
    ["Whitespace A", "one symbol"],
    ["", "at least 10 characters"],
])("rejects invalid password %s with a reason", async (password, reason) => {
    submit(password);
    expect(await screen.findByRole("alert")).toHaveTextContent(reason);
    expect(register).not.toHaveBeenCalled();
    expect(login).not.toHaveBeenCalled();
});

test("shows all requirements before submitting", () => {
    render(<RegisterForm />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription(/At least 10 characters/);
});

test("accepts a ten-character password without digits", async () => {
    submit("Abcdefghi!");
    await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/profile"));
    expect(register).toHaveBeenCalledWith("Alice", "alice@example.com", "Abcdefghi!");
});

test("explains mismatched passwords", async () => {
    submit("Abcdefghi!", "Different!");
    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match");
    expect(register).not.toHaveBeenCalled();
});

test("displays server rejection without logging in", async () => {
    register.mockRejectedValue(new ApiError("Password must contain at least one symbol.", 422));
    submit("Abcdefghi!");
    expect(await screen.findByRole("alert")).toHaveTextContent("Password must contain at least one symbol.");
    expect(login).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
});

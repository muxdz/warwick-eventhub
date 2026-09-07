import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import ChangePasswordForm from "@/components/ChangePasswordForm";
const { auth, fetchMock } = vi.hoisted(() => ({ auth: { token: "token" as string | null, loading: false }, fetchMock: vi.fn() }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => auth }));
beforeEach(() => {
    auth.token = "token";
    auth.loading = false;
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
});
function submit(password = "NewPassword!", confirmation = password) {
    render(<ChangePasswordForm />);
    for (const [label, value] of [["Old password", "old"], ["New password", password], ["Confirm new password", confirmation]]) {
        fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));
}
test("sends authenticated request and clears fields on success", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    submit();
    expect(await screen.findByRole("status")).toHaveTextContent("changed successfully");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/users/me/password"), {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: JSON.stringify({ old_password: "old", new_password: "NewPassword!" }),
    });
    for (const label of ["Old password", "New password", "Confirm new password"]) expect(screen.getByLabelText(label)).toHaveValue("");
});
test.each([["weak", "weak", "at least 10 characters"], ["NewPassword!", "Different!", "Passwords do not match"]])("rejects %s", async (password, confirmation, message) => {
    submit(password, confirmation);
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(fetchMock).not.toHaveBeenCalled();
});
test.each([
    [401, "Incorrect old password", "Incorrect old password"],
    [422, [{ msg: "Value error, Password must contain at least one symbol." }], "Password must contain at least one symbol."],
])("shows API error %s", async (status, detail, message) => {
    fetchMock.mockResolvedValue({ ok: false, status, json: async () => ({ detail }) });
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
test("handles network failures", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to change password. Please try again.");
    expect(screen.getByRole("button", { name: "Change password" })).toBeEnabled();
});
test("disables submission while saving", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    submit();
    expect(screen.getByRole("button", { name: "Changing password..." })).toBeDisabled();
});
test("requires login", () => {
    auth.token = null;
    render(<ChangePasswordForm />);
    expect(screen.getByRole("link", { name: "log in" })).toHaveAttribute("href", "/login");
    expect(screen.queryByLabelText("Old password")).not.toBeInTheDocument();
});
test("waits for session restoration", () => {
    auth.loading = true;
    render(<ChangePasswordForm />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
});

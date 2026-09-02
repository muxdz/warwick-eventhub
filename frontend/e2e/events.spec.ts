import { test, expect } from "@playwright/test";

test("user can open the events page", async ({ page }) => {
    await page.goto("/events");

    await page.getByRole("link", {
        name: "Events",
    }).click();

    await expect(page).toHaveURL(/\/events/);

    await page.getByRole("link", {
        name: /Meet Cloud/i,
    }).click();

    await expect(
        page.getByText(/Meet Cloud/i)
    ).toBeVisible();

    await expect(
        page.getByText(/fab/i)
    ).toBeVisible();
});

test("shows not found for non-existing event", async ({ page }) => {
    await page.goto("/events/9999");

    await expect(
        page.getByText(/event not found/i)
    ).toBeVisible({ timeout: 10000 });
});
import { test, expect } from '@playwright/test';
import { e2eOrganiser } from './fixtures';

test('user can open the login page', async ({ page }) => {
    await page.goto('/login');

    await expect(
        page.getByLabel(/email/i)
    ).toBeVisible();

    await expect(
        page.getByLabel(/password/i)
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: /login/i })
    ).toBeVisible();
});

test('user can login', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(e2eOrganiser.email);
    await page.getByLabel(/password/i).fill(e2eOrganiser.password);
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(/\/profile/);

    await expect(
        page.getByRole('link', { name: /profile/i })
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: /logout/i })
    ).toBeVisible();
});

test('user profile page shows correct information', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(e2eOrganiser.email);
    await page.getByLabel(/password/i).fill(e2eOrganiser.password);
    await page.getByRole('button', { name: /login/i }).click();  

    await expect(page).toHaveURL(/\/profile/);

    await expect(
        page.getByRole('heading', { name: /e2e organiser/i })
    ).toBeVisible();

    await expect(
        page.getByText(e2eOrganiser.email)
    ).toBeVisible();
});

test('user can logout', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(e2eOrganiser.email);
    await page.getByLabel(/password/i).fill(e2eOrganiser.password);
    await page.getByRole('button', { name: /login/i }).click();

    await page.getByRole('button', { name: /logout/i }).click();

    await expect(page).toHaveURL(/\/profile/);

    await expect(
        page.getByText(/you are not logged in/i)
    ).toBeVisible();
});

test('user login fails with incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(e2eOrganiser.email);
    await page.getByLabel(/password/i).fill("IncorrectPassword123!");
    await page.getByRole('button', { name: /login/i }).click();

    await expect(
        page.getByText(/incorrect credentials/i)
    ).toBeVisible();
});

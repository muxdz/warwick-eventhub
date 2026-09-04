import { test, expect } from '@playwright/test';

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

    await page.getByLabel(/email/i).fill('e2e-organiser@example.com');
    await page.getByLabel(/password/i).fill('E2ETestPassword123!');
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

    await page.getByLabel(/email/i).fill('e2e-organiser@example.com');
    await page.getByLabel(/password/i).fill('E2ETestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();  

    await expect(page).toHaveURL(/\/profile/);

    await expect(
        page.getByRole('heading', { name: /e2e organiser/i })
    ).toBeVisible();

    await expect(
        page.getByText('e2e-organiser@example.com')
    ).toBeVisible();
});

test('user can logout', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('e2e-organiser@example.com');
    await page.getByLabel(/password/i).fill('E2ETestPassword123!');
    await page.getByRole('button', { name: /login/i }).click();

    await page.getByRole('button', { name: /logout/i }).click();

    await expect(page).toHaveURL(/\/profile/);

    await expect(
        page.getByText(/you are not logged in/i)
    ).toBeVisible();
});

test('user login fails with incorrect credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill('e2e-organiser@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(
        page.getByText(/incorrect credentials/i)
    ).toBeVisible();
});

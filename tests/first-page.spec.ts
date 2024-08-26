import { test, expect } from '@playwright/test';

test.describe("Home Page", () => {
  test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page).toHaveTitle('Secure-CI');
    await expect(
      page.getByRole("heading", {
        name: "Secure-CI Continuous Integration, Continuous Security",
    })).toBeVisible();
  });
});

test.describe("Navbar Dark/Light Mode Toggle", () => {
  test('should toggle dark mode on button click', async ({ page }) => {

    await page.goto('http://localhost:3000');

    await page.screenshot({ path: 'e2e-screenshot/screenshot-before-dark-mode-toggle.png' });

    let darkModeClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(darkModeClass).toBe(false);

    await page.click('button[aria-label="Toggle dark mode"]');

    await page.waitForTimeout(1000);
  
    await page.screenshot({ path: 'e2e-screenshot/screenshot-after-dark-mode-toggle.png' });

    darkModeClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(darkModeClass).toBe(true);

    await page.click('button[aria-label="Toggle dark mode"]');

    await page.waitForTimeout(1000);

    darkModeClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(darkModeClass).toBe(false);
  });
});

test.describe("Footer Links", () => {
  test('should navigate to API Documentation page when clicking on the link', async ({ page }) => {

    await page.goto('http://localhost:3000');

    await Promise.all([
      page.waitForURL('**/api-doc'),
      page.click('a:text("API Documentation")')
    ]);

    await page.screenshot({ path: 'e2e-screenshot/screenshot-api-doc.png' });

    await expect(page).toHaveURL('http://localhost:3000/api-doc');
  });
});
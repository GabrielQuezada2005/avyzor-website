import { expect, test } from "@playwright/test";

test.describe("Login", () => {
  test("zeigt die Portal-Anmeldeseite", async ({ page }) => {
    await page.goto("/portal/login");

    await expect(page.getByRole("heading", { name: "AVYZOR Kundenportal" })).toBeVisible();
    await expect(page.locator("#portal-email")).toBeVisible();
    await expect(page.locator("#portal-password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Anmelden" })).toBeVisible();
  });

  test("meldet fehlende Backend-Konfiguration", async ({ page }) => {
    await page.route("**/api/portal/auth/login", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "Kundenportal ist noch nicht konfiguriert.",
          code: "NOT_CONFIGURED",
        }),
      });
    });

    await page.goto("/portal/login");

    await page.locator("#portal-email").fill("user@example.com");
    await page.locator("#portal-password").fill("geheim12345");
    await page.getByRole("button", { name: "Anmelden" }).click();

    await expect(
      page.getByText("Kundenportal ist noch nicht konfiguriert.")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("zeigt Fehler bei ungültigen Anmeldedaten", async ({ page }) => {
    await page.goto("/portal/login");

    await page.locator("#portal-email").fill("ungueltig");
    await page.locator("#portal-password").fill("");
    await page.getByRole("button", { name: "Anmelden" }).click();

    await expect(page.locator("#portal-email:invalid")).toBeVisible();
    await expect(page.locator("#portal-password:invalid")).toBeVisible();
  });
});

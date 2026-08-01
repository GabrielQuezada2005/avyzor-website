import { expect, test } from "@playwright/test";

async function openBookingForm(page: import("@playwright/test").Page) {
  await page.goto("/de#kontakt");
  await page.getByRole("tab", { name: "Termin" }).click();
  await page.getByText("Alternativ: Anfrage per Formular").click();
}

test.describe("Terminbuchung", () => {
  test("zeigt das Buchungsformular und Client-Validierung", async ({ page }) => {
    await openBookingForm(page);

    await expect(page.locator("#booking-name")).toBeVisible();
    await expect(page.locator("#booking-email")).toBeVisible();
    await expect(page.locator("#booking-date")).toBeVisible();
    await expect(page.locator("#booking-time")).toBeVisible();

    await page.locator("#booking-name").fill("A");
    await page.locator("#booking-email").fill("ungueltig");
    await page.locator("#booking-consent").check();
    await page.getByRole("button", { name: "Terminanfrage senden" }).click();

    await expect(page.locator("#booking-email:invalid")).toBeVisible();
  });

  test("sendet gültige Terminanfragen", async ({ page }) => {
    await page.route("**/api/booking/availability**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          date: "2026-09-15",
          slots: ["10:00", "10:30", "11:00"],
        }),
      });
    });

    await page.route("**/api/booking", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          appointmentId: "test-appointment-1",
          emailSent: true,
          message: "Bestätigung gesendet",
        }),
      });
    });

    await openBookingForm(page);

    await page.locator("#booking-name").fill("Anna Beispiel");
    await page.locator("#booking-email").fill("anna@example.com");
    await page.locator("#booking-date").fill("2026-09-15");
    await page.locator("#booking-time").selectOption("10:00");
    await page.locator("#booking-consent").check();

    await page.getByRole("button", { name: "Terminanfrage senden" }).click();

    await expect(
      page.getByText("Terminanfrage erhalten! Bestätigung per E-Mail folgt.")
    ).toBeVisible({ timeout: 10_000 });
  });
});

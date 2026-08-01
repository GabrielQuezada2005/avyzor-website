import { expect, test } from "@playwright/test";

test.describe("Kontaktformular", () => {
  test("zeigt Validierung und erfolgreiche Übermittlung", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/de#kontakt");
    await page.getByRole("tab", { name: "Kontakt" }).click();

    await page.locator("#name").fill("Max Mustermann");
    await page.locator("#email").fill("max@example.com");
    await page.locator("#message").fill(
      "Ich interessiere mich für eine Premium-Website mit KI-Chatbot."
    );
    await page.locator("#contact-consent").check();

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(
      page.getByText("Vielen Dank! Wir melden uns innerhalb von 24 Stunden.")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("zeigt Fehler bei ungültigen Eingaben", async ({ page }) => {
    await page.goto("/de#kontakt");
    await page.getByRole("tab", { name: "Kontakt" }).click();

    await page.locator("#name").fill("A");
    await page.locator("#email").fill("a@b.co");
    await page.locator("#message").fill("kurz");
    await page.locator("#contact-consent").check();

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(
      page.getByText("Name muss mindestens 2 Zeichen haben.")
    ).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

function assistantDialog(page: import("@playwright/test").Page) {
  return page.getByRole("dialog", { name: "AVYZOR Assistant Chat" });
}

test.describe("Lead-Erkennung", () => {
  test("liefert erkannte Lead-Daten über die Assistant-API", async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await page.route("**/api/assistant", async (route) => {
      capturedBody = route.request().postDataJSON() as Record<string, unknown>;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Danke für Ihre Kontaktdaten, Max!",
          lead: {
            kontakt: { email: "max@example.com" },
          },
        }),
      });
    });

    await page.goto("/de");

    const openButton = page.getByRole("button", {
      name: "AVYZOR Assistant öffnen",
    });
    await expect(openButton).toBeVisible({ timeout: 15_000 });
    await openButton.click();

    const chat = assistantDialog(page);
    await chat.getByRole("textbox", { name: "Chat-Nachricht" }).fill(
      "Ich bin Max Mustermann von Beispiel GmbH, max@example.com. Wir brauchen eine Premium-Website."
    );
    await chat.getByLabel("Nachricht senden").click();

    await expect(chat.getByText("Danke für Ihre Kontaktdaten, Max!")).toBeVisible({
      timeout: 10_000,
    });

    expect(capturedBody).not.toBeNull();
    expect(capturedBody?.messages).toBeDefined();
    expect(capturedBody?.sessionId).toBeTruthy();
  });
});

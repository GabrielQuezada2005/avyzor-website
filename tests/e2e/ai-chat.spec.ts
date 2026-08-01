import { expect, test } from "@playwright/test";

function assistantDialog(page: import("@playwright/test").Page) {
  return page.getByRole("dialog", { name: "AVYZOR Assistant Chat" });
}

test.describe("KI-Chat", () => {
  test("öffnet den Assistant und sendet eine Nachricht", async ({ page }) => {
    await page.route("**/api/assistant", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Gerne helfe ich Ihnen bei Ihrem Website-Projekt.",
          lead: null,
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
    await expect(chat).toBeVisible();

    await chat.getByRole("textbox", { name: "Chat-Nachricht" }).fill(
      "Hallo, ich brauche eine neue Website."
    );
    await chat.getByLabel("Nachricht senden").click();

    await expect(
      chat.getByText("Gerne helfe ich Ihnen bei Ihrem Website-Projekt.")
    ).toBeVisible({ timeout: 10_000 });
  });
});

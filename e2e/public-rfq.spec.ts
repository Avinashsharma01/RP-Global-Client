import { expect, test } from "@playwright/test";

test.describe("public lead capture", () => {
  test("submits a calculator recommendation through the RFQ modal", async ({ page }) => {
    let submittedBody = "";

    await page.route("**/api/v1/landing", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: {} }),
      });
    });

    await page.route("**/api/v1/rfq", async (route) => {
      submittedBody = route.request().postDataBuffer()?.toString("utf8") || "";

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: { leadId: "e2e-lead-1" } }),
      });
    });

    await page.goto("/");
    await page.locator("#plant-calculator-rfq-btn").scrollIntoViewIfNeeded();
    await page.locator("#plant-calculator-rfq-btn").click();

    const modal = page.locator(".rfq-modal");
    await expect(modal).toBeVisible();
    await modal.getByPlaceholder("e.g. Rajesh Kumar").fill("E2E Contact");
    await modal.getByPlaceholder("e.g. Vardhman Industries").fill("E2E Water Systems");
    await modal.getByPlaceholder("name@company.com").fill("e2e@example.com");
    await modal.getByPlaceholder("+91 9876543210").fill("+91 90000 00000");
    await modal.getByPlaceholder("e.g. Noida, UP / Baddi, HP").fill("Noida");
    await modal.getByRole("button", { name: "Submit for Engineering Sizing" }).click();

    await expect(modal.getByText("Technical RFQ Successfully Registered!")).toBeVisible();
    expect(submittedBody).toContain("E2E Contact");
    expect(submittedBody).toContain("E2E Water Systems");
    expect(submittedBody).toContain("e2e@example.com");
  });
});

import { expect, test } from "@playwright/test";

test.describe("admin operations", () => {
  test("logs in and loads dashboard KPIs", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          token: "e2e-admin-token",
          user: {
            fullName: "E2E Admin",
            email: "admin@example.com",
            role: "SUPER_ADMIN",
          },
        }),
      });
    });

    await page.route("**/api/v1/admin/summary", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            metrics: {
              totalLeads: 12,
              newLeads: 4,
              evaluationLeads: 3,
              wonLeads: 2,
              totalProducts: 6,
              totalJobs: 3,
              activeJobs: 2,
              totalApplications: 7,
            },
            recentLeads: [],
          },
        }),
      });
    });

    await page.goto("/admin/login");
    await page.getByLabel("Admin email address").fill("admin@example.com");
    await page.getByLabel("Password").fill("valid-password");
    await page.getByRole("button", { name: "Sign in to admin" }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText("E2E Admin")).toBeVisible();
    await expect(page.getByText("12").first()).toBeVisible();
  });
});

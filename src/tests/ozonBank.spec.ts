import { expect, test } from "@playwright/test";
import { Header } from "../pageObjects/header";
import { Homepage } from "../pageObjects/homepage";


test.beforeEach(async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Счёт');
})

test('Smoke', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Открыть Ozon Счёт');
});
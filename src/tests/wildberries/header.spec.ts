import { expect, test } from "@playwright/test";
import { Urls } from "../../pageObjects/wildberries";


const SELL_ON_WB = '[data-wba-header-name="Seller"]';

test('Sell on Wildberries button click leads to sellers page', async ({ page, context }) => {
    await page.goto(Urls.MAIN_PAGE);
    await page.locator(SELL_ON_WB).click();
    const newPage = await context.waitForEvent('page');
    await expect(newPage.locator('body')).toContainText('Collaboration with Wildberries');
});
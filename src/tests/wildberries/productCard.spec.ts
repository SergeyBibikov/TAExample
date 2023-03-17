import { expect, test } from "@playwright/test";
import { scrollToBottom } from "../../helpers/actions";

import Urls from "../../urls";

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_PRODUCT_CARD);
    await page.waitForLoadState();
})

const SIMILAR_PRODUCTS_BUTTON = 'a span:has-text("Похожие")'

test('Similar products lead', async ({ page }) => {
    await page.locator(SIMILAR_PRODUCTS_BUTTON).click();
    expect.soft(page.url()).toContain('recommendation');
    await expect.soft(page.locator('main')).toContainText('Похожие по фото');
});
import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const CHAT_BUTTON = '[class*="btn-chat-open"]'
const SELL_HITS = '//h2[contains(., "Хиты продаж")]'
const POPULAR_BRANDS = '//h2[text()="Популярные бренды"]'
const WIDE_PRODUCT_LINE = '//h2[text()="Широкий ассортимент и высокое качество"]'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Two chat buttons are present', async ({ page }) => {
    await expect(page.locator(CHAT_BUTTON)).toHaveCount(2);
});

test('Main sections are present', async ({ page }) => {
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight / 3); });
    await page.waitForSelector(SELL_HITS);
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight / 1.5); });
    await page.waitForSelector(POPULAR_BRANDS);
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
    await page.waitForSelector(WIDE_PRODUCT_LINE);
});
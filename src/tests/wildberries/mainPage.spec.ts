import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const CHAT_BUTTON = '[class*="btn-chat-open"]'
const CHOOSE_FILE_BUTTON = 'label.upload-photo-btn'
const POPULAR_BRANDS = '//h2[text()="Популярные бренды"]'
const SELL_HITS = '//h2[contains(., "Хиты продаж")]'
const SEARCH_BY_PHOTO_BUTTON = '//button[contains(text(),"Поиск по фото")]'
const WIDE_PRODUCT_LINE = '//h2[text()="Широкий ассортимент и высокое качество"]'
const UPLOAD_PHOTO_TEXT = 'div.upload-photo-text'

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

test('Search by photo popup has choose file button', async ({ page }) => {
    await page.locator(SEARCH_BY_PHOTO_BUTTON).click();
    await page.waitForSelector(CHOOSE_FILE_BUTTON);
});

test('Search by photo popup text', async ({ page }) => {
    await page.locator(SEARCH_BY_PHOTO_BUTTON).click();
    await expect.soft(page.locator(UPLOAD_PHOTO_TEXT)).toContainText('Максимальный размер: 8 МБ.');
    await expect.soft(page.locator(UPLOAD_PHOTO_TEXT)).toContainText('Поддерживаемые форматы: JPG, JPEG, PNG, BMP, GIF.');
});
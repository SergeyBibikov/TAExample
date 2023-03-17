import { expect, test } from "@playwright/test"; import Urls from "../../urls";

const CHAT_ATTACH_FILE = '.chat__footer label span'
const CHAT_BUTTON = '[class*="btn-chat-open"]'
const CHAT_CLOSE_BUTTON = 'button:has-text("Закрыть")'
const CHAT_INFO_HEADER = 'h2:has-text("Чат поддержки")'
const CHAT_TEXT_FIELD = 'textarea[placeholder="Ваше сообщение..."]'
const CHAT_WINDOW = 'section.chat'
const CHOOSE_FILE_BUTTON = 'label.upload-photo-btn'
const CLEAR_SEARCH = '//button[text()="Очистить поиск"]'
const POPULAR_BRANDS = '//h2[text()="Популярные бренды"]'
const SELL_HITS = '//h2[contains(., "Хиты продаж")]'
const SEARCH_BY_PHOTO_HINT = '//div[@class="tooltip__content" and text()="Поиск по фото"]'
const SEARCH_BY_PHOTO_BUTTON = '//button[contains(text(),"Поиск по фото")]'
const SEARCH_INPUT = 'input#searchInput'
const RESULTS_FOUND = '//h1[contains(text(), "По запросу") and contains(text(), "найдено")]'
const SEARCH_SUGGESTIONS = 'div.search-catalog__autocomplete'
const WIDE_PRODUCT_LINE = '//h2[text()="Широкий ассортимент и высокое качество"]'
const UPLOAD_PHOTO_TEXT = 'div.upload-photo-text'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Chat button is present', async ({ page }) => {
    await expect(page.locator(CHAT_BUTTON)).toHaveCount(1);
});

test('Search by photo popup text', async ({ page }) => {
    await page.locator(SEARCH_BY_PHOTO_BUTTON).click();
    await expect.soft(page.locator(UPLOAD_PHOTO_TEXT)).toContainText('Максимальный размер: 8 МБ.');
    await expect.soft(page.locator(UPLOAD_PHOTO_TEXT)).toContainText('Поддерживаемые форматы: JPG, JPEG, PNG, BMP, GIF.');
});

test('Search by photo hint presence', async ({ page }) => {
    await page.locator(SEARCH_BY_PHOTO_BUTTON).hover();
    await page.waitForSelector(SEARCH_BY_PHOTO_HINT);
});

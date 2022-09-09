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

test('Two chat buttons are present', async ({ page }) => {
    await expect(page.locator(CHAT_BUTTON)).toHaveCount(2);
});

test.describe('Chat window', () => {

    test.beforeEach(async ({ page }) => {
        await page.locator(CHAT_BUTTON).first().click();
    })

    test('Has welcoming message', async ({ page }) => {
        const chat = page.locator(CHAT_WINDOW);
        await expect.soft(chat).toContainText('Я Лина - виртуальный помощник службы поддержки. Если \
        у Вас возник вопрос  - задайте его в этом чате, и я с удовольствием отвечу на него.');
    });

    test('Has the text input field', async ({ page }) => {
        await page.waitForSelector(CHAT_WINDOW + ' >> ' + CHAT_TEXT_FIELD);
    });

    test('Has "support chat" info header', async ({ page }) => {
        await page.waitForSelector(CHAT_INFO_HEADER);
    });

    test('Closes on "close" button click', async ({ page }) => {
        await page.locator(CHAT_WINDOW + ' >> ' + CHAT_CLOSE_BUTTON).click();
        await page.waitForSelector(CHAT_WINDOW, { state: "hidden" });
    });

    test('Attach file hint', async ({ page }) => {
        await page.locator(CHAT_WINDOW + ' >> ' + CHAT_ATTACH_FILE).hover();
    });
})

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

test('Search by photo hint presence', async ({ page }) => {
    await page.locator(SEARCH_BY_PHOTO_BUTTON).hover();
    await page.waitForSelector(SEARCH_BY_PHOTO_HINT);
});

test('Search hints on input click', async ({ page }) => {
    const suggestions = page.locator(SEARCH_SUGGESTIONS);
    expect.soft(await suggestions.allTextContents()).toEqual([""]);
    await page.locator(SEARCH_INPUT).click();
    await expect.soft(suggestions).toContainText('футболка');
    await expect.soft(suggestions).toContainText('телефон');
});

test('Suitable search suggestions depending on the input text', async ({ page }) => {
    await page.locator(SEARCH_INPUT).fill('теле');
    const suggestions = page.locator(SEARCH_SUGGESTIONS);
    await expect.soft(suggestions).toContainText('телефон');
    await expect.soft(suggestions).toContainText('телевизор');
});

test('Search text delete button is present', async ({ page }) => {
    const search = page.locator(SEARCH_INPUT);
    await search.fill('теле');
    await page.locator(CLEAR_SEARCH).click();
    expect(await search.textContent()).toEqual('');
});

test('Search works', async ({ page }) => {
    const search = page.locator(SEARCH_INPUT);
    await search.fill('iphone');
    await search.press('Enter');
    await page.waitForSelector(RESULTS_FOUND);
});

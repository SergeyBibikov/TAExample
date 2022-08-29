import { expect, test } from "@playwright/test";
import { scrollToBottom } from "../../helpers/actions";

import Urls from "../../urls";

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_PRODUCT_CARD);
    await page.waitForLoadState();
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

const CLOSE_REPORT_WINDOW_BUTTON = 'a[class*="popup__close"]'
const RECENTLY_VIEWED = 'h2:has-text("Вы недавно смотрели")'
const RECOMMENDED_GOODS = 'section[class*="recommended-goods"]'
const REPORT_A_REVIEW_BUTTON = 'button:has-text("Пожаловаться на отзыв")'
const REPORT_A_REVIEW_WINDOW = 'div[class*="popup-complain"]'
const REPORT_BUTTON = 'button:has-text("Сообщить")'
const SIMILAR_PRODUCTS_BUTTON = 'a span:has-text("Похожие")'
const VIEW_ALL_REVIEWS = 'a:has-text("Смотреть все отзывы")'

test('Similar products lead', async ({ page }) => {
    await page.locator(SIMILAR_PRODUCTS_BUTTON).click();
    expect.soft(page.url()).toContain('recommendation');
    await expect.soft(page.locator('main')).toContainText('Похожие по фото');
});

test('Ad section presence', async ({ page }) => {
    const recommends = page.locator(RECOMMENDED_GOODS).first();

    await scrollToBottom(page);

    await expect.soft(recommends).toContainText('Рекламный блок');
    await expect.soft(recommends).toContainText('Смотреть все');
});

test('Recently viewed products section presence', async ({ page }) => {
    await scrollToBottom(page);
    await page.waitForSelector(RECENTLY_VIEWED);
});

test('See all reviews button lead', async ({ page }) => {
    await scrollToBottom(page);
    await page.locator(VIEW_ALL_REVIEWS).click();

    expect.soft(page.url()).toContain('feedbacks');
    await expect.soft(page.locator('main')).toContainText('Сортировать по');
});

test.describe('Review report window', () => {
    test.beforeEach(async ({ page }) => {
        await scrollToBottom(page);
        await page.locator(REPORT_A_REVIEW_BUTTON).first().click();
    });
    test('Has report button', async ({ page }) => {
        await page.waitForSelector(REPORT_A_REVIEW_WINDOW + ' >> ' + REPORT_BUTTON);
    });

    test('Has 4 reason options', async ({ page }) => {
        const repW = page.locator(REPORT_A_REVIEW_WINDOW);

        await expect.soft(repW).toContainText('Отзыв содержит нецензурную, бранную лексику');
        await expect.soft(repW).toContainText('Заказной, фиктивный');
        await expect.soft(repW).toContainText('Спам');
        await expect.soft(repW).toContainText('Некорректное фото, видео');
    });

    test('Closes on "close" button click', async ({ page }) => {
        await page.waitForSelector(REPORT_A_REVIEW_WINDOW);
        await page.locator(CLOSE_REPORT_WINDOW_BUTTON).click();
        await page.waitForSelector(REPORT_A_REVIEW_WINDOW, { state: "hidden" });
    });
})
import { test, expect } from '@playwright/test';
import { scrollToBottom } from '../../helpers/actions';
import Urls from '../../urls';

const BREAD_CRUMPS = '[data-widget="breadCrumbs"]'
const BUYERS_PHOTOS = '(//div[contains(text(), "Фото и видео покупателей")])[1]/..//img'
const FAQ = '#pdp-faq'
const NOTIFY_ON_PRICE_CHANGE_BUTTON = '//button[span[span[text()="Узнать о снижении цены"]]]'
const OZON_CARD_PRICE = '//div[contains(text(), "при оплате Ozon Картой")]'
const POSSIBLE_ACTIONS = '(//div[div[@data-widget="webAddToFavorite"]])[1]'
const PRODUCT_CODE = '//span[contains(., "Код") and contains(., "товара")]'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.OZON_IPHONE_CARD);
});

test('Product code is present', async ({ page }) => {
    await page.waitForSelector(PRODUCT_CODE);
});

test('IPhone category path', async ({ page }) => {
    const bc = page.locator(BREAD_CRUMPS);

    await expect.soft(bc).toContainText('Электроника');
    await expect.soft(bc).toContainText('Телефоны и смарт-часы');
    await expect.soft(bc).toContainText('Смартфоны');
    await expect.soft(bc).toContainText('Apple');
});

test('Product possible actions, reviews and questions buttons are present', async ({ page }) => {
    const actions = page.locator(POSSIBLE_ACTIONS);

    await expect.soft(actions).toContainText('отзыв');
    await expect.soft(actions).toContainText('видео');
    await expect.soft(actions).toContainText('вопрос');
    await expect.soft(actions).toContainText('В избранное');
    await expect.soft(actions).toContainText('Добавить к сравнению');
    await expect.soft(actions).toContainText('Поделиться');
});

test('FAQ presence and content', async ({ page }) => {
    const faq = page.locator(FAQ);

    await expect.soft(faq).toContainText('Условия доставки');
    await expect.soft(faq).toContainText('Способы оплаты');
    await expect.soft(faq).toContainText('Возврат товаров');
    await expect.soft(faq).toContainText('Возврат денег');
});

test('Buyers photo section has images', async ({ page }) => {
    await page.waitForSelector(BUYERS_PHOTOS, { timeout: 30000 });
    expect.soft(await page.locator(BUYERS_PHOTOS).count()).toBeGreaterThan(0);
});

test('Test that used phone price is lower', async ({ page }) => {
    const getPrice = (str: string) => {
        const m = str.match(/\d{2}\s\d{3}/) || []
        return Number(m[0].replace(/\s/g, ''))
    }

    const _new = await page.locator('button', { hasText: 'Новые' }).textContent() || "";
    const used = await page.locator('button', { hasText: 'Уцененные' }).textContent() || "";

    expect(getPrice(used)).toBeLessThan(getPrice(_new))
});

test('Ozon card price promo is present', async ({ page }) => {
    await page.waitForSelector(OZON_CARD_PRICE);
});

test('"Notify on price change" button is present', async ({ page }) => {
    await page.waitForSelector(NOTIFY_ON_PRICE_CHANGE_BUTTON);
});
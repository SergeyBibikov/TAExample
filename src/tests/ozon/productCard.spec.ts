import { test, expect } from '@playwright/test';
import { Header } from '../../pageObjects/header';
import { ProductCard } from '../../pageObjects/productCard';
import Urls from '../../urls';

const ASK_SELLER = '//div[text()="Спросить продавца о товаре"]'
const BREAD_CRUMPS = '[data-widget="breadCrumbs"]'
const BUYERS_PHOTOS = '(//div[contains(text(), "Фото и видео покупателей")])[1]/..//img'
const FAQ = '#pdp-faq'
const NOTIFY_ON_PRICE_CHANGE_BUTTON = '//button[span[span[text()="Узнать о снижении цены"]]]'
const POSSIBLE_ACTIONS = '(//div[div[@data-widget="webAddToFavorite"]])[1]'
const PRODUCT_CODE = '//span[contains(., "Код") and contains(., "товара")]'
const SELLER_CARD = '[data-widget="webCurrentSeller"]'
const WANT_DISCOUNT = '//span[contains(text(), "Хочу скидку")]'

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

test('"I want a discount" button is present', async ({ page }) => {
    await page.waitForSelector(WANT_DISCOUNT);
});

test('Seller card has "ask seller" button', async ({ page }) => {
    await page.waitForSelector(`${SELLER_CARD} >> ${ASK_SELLER}`)
});

test('"Notify on price change" button is present', async ({ page }) => {
    await page.waitForSelector(NOTIFY_ON_PRICE_CHANGE_BUTTON);
});

test('Buyers photo section has images', async ({ page }) => {
    expect.soft(await page.locator(BUYERS_PHOTOS).count()).toBeGreaterThan(0);
});

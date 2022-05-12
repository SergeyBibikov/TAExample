import { test, expect } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { ProductCard } from '../pageObjects/productCard';
import { getElementColor } from "../helpers/dom";


test.beforeEach(async ({ page }) => {
    const productLink = 'https://www.ozon.ru/product/chehol-nakladka-gurdini-ultra-twin-0-3-mm-silikon-dlya-apple-iphone-se-2020-7-8-4-7-162212667'

    await page.goto(productLink);
    await page.waitForResponse('https://xapi.ozon.ru/api/frontend-perf.bx/v2/events');
    await page.waitForLoadState();
});

test('All main sections must be displayed', async ({ page }) => {

    await expect(page.locator('#layoutPage')).toContainText('Фото и видео покупателей');
    await expect(page.locator('#layoutPage')).toContainText('Рекомендуем также');
    await expect(page.locator('#layoutPage')).toContainText('Покупают вместе');
    await expect(page.locator('#layoutPage')).toContainText('Спонсорские товары');
    await expect(page.locator('#layoutPage')).toContainText('Характеристики');
    await expect(page.locator('#layoutPage')).toContainText('Подборки товаров');
    await expect(page.locator('#layoutPage')).toContainText('Отзывы и вопросы о товаре');
});

test('Scroll to description', async ({ page }) => {
    const getOffset = async () => {
        return await page.evaluate(() => {
            return window.scrollY
        });
    }

    await page.waitForLoadState();
    await page.locator('text=Перейти к описанию').click();

    let offsetAfterScroll = await getOffset();
    while (true) {
        const currentOffset = await getOffset();
        if (currentOffset === offsetAfterScroll) {
            break;
        }
        offsetAfterScroll = currentOffset;
    }

    expect(offsetAfterScroll).toBeGreaterThan(2000);
});

test('Add to comparison button should change text when product is added', async ({ page }) => {

    const productHeaderSection = page.locator(ProductCard.nameSection);

    await expect(productHeaderSection).toContainText('Добавить к сравнению');
    await productHeaderSection.locator('text=Добавить к сравнению').click();
    await expect(productHeaderSection).not.toContainText('Добавить к сравнению');
    await expect(productHeaderSection).toContainText('Перейти в сравнение');
});

test('Icon color should change when product is added to favourites', async ({ page }) => {
    const expectedFavIconColor = 'rgb(249, 17, 85)'

    await page.locator('text=В избранное').click();
    const count = await Header.getFavouriteItemsCount(page);
    expect(count).toEqual(1);
    await expect(page.locator(ProductCard.nameSection)).toContainText('В избранном');
    const color = await page.evaluate(getElementColor, 'button[aria-label="Убрать из избранного"] > span > svg')
    expect(color).toEqual(expectedFavIconColor);
});

test('Share options should show on hover', async ({ page }) => {

    await page.locator(ProductCard.nameSection).locator('[aria-label="Поделиться"] > span span').hover();

    const exp = expect(page.locator('.vue-portal-target').nth(1));

    await exp.toContainText('Скопировать ссылку');
    await exp.toContainText('ВКонтакте');
    await exp.toContainText('Одноклассники');
    await exp.toContainText('Telegram');
    await exp.toContainText('Twitter');
});
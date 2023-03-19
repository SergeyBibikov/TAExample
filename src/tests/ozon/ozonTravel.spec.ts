import { test, expect } from '@playwright/test';
import Urls from '../../urls';

const CONVINIENCE_POINTS = 'div[data-widget="seoOzonAdvantages"]'
const TRAVEL_TITLE = '[data-widget="travelTitle"]'

test.describe(() => {
    test.beforeEach(async ({ page }) => {
        await page.goto(Urls.OZON_TRAVEL);
    })

    test('Avia tickets search form title text', async ({ page }) => {
        await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('Поиск дешёвых авиабилетов');
    })

    test('There are 4 points of Ozon Travel convenience', async ({ page }) => {
        const convPoints = page.locator(CONVINIENCE_POINTS);

        await expect.soft(convPoints).toContainText('Оплата баллами Ozon');
        await expect.soft(convPoints).toContainText('Постоянная поддержка 24/7');
        await expect.soft(convPoints).toContainText('Удобный и быстрый поиск');
        await expect.soft(convPoints).toContainText('Билеты от 800+ авиакомпаний');
    });

});


test('Railway tickets search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_RAILWAY);

    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('Ж/Д билеты на поезд');
})

test('Hotels search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_HOTELS);
    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('Отели, апартаменты и хостелы');
});
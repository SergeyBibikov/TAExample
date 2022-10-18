import { test, expect } from '@playwright/test';
import Urls from '../../urls';

const CONVINIENCE_POINTS = 'div[data-widget="seoOzonAdvantages"]'
const TRAVEL_TITLE = '[data-widget="travelTitle"]'

test.describe(() => {
    test.beforeEach(async ({ page }) => {
        await page.goto(Urls.OZON_TRAVEL);
    })
    //FIXME
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

    test('All stories', async ({ page }) => {

        const storiesView = '//div[@class="vue-portal-target"]//div[img[contains(@src, "main")]]/..';

        await page.locator('text=Смотреть все').click();
        await expect(page.locator(storiesView)).toHaveCount(1);
    });
});


//FIXME
test('Railway tickets search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_RAILWAY);
    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('ЖД билеты на поезд');
})

test('Hotels search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_HOTELS);
    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('Отели, апартаменты и хостелы');
});
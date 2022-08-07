import { test, expect } from '@playwright/test';
import Urls from '../../urls';

const CONVINIENCE_POINTS = '//div[contains(text(), "билеты на Ozon удобно!")]/following-sibling::div'
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

        await expect.soft(convPoints).toContainText('Оплата баллами');
        await expect.soft(convPoints).toContainText('Поддержка 24/7');
        await expect.soft(convPoints).toContainText('Удобный поиск');
        await expect.soft(convPoints).toContainText('Большой выбор');
    });

    test('All stories', async ({ page }) => {

        const storiesView = '//div[@class="vue-portal-target"]//div[img[contains(@src, "main")]]/..';

        await page.locator('text=Смотреть все').click();
        await expect(page.locator(storiesView)).toHaveCount(1);
    });
});



test('Railway tickets search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_RAILWAY);
    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('ЖД билеты на поезд');
})

test('Hotels search form title text', async ({ page }) => {
    await page.goto(Urls.OZON_TRAVEL_HOTELS);
    await expect.soft(page.locator(TRAVEL_TITLE)).toContainText('Отели, апартаменты и хостелы');
});
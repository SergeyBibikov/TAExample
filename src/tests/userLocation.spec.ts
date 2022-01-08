import { test, expect } from '@playwright/test';
import { Homepage } from '../pageObjects/homepage';

test('Auto detected user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const userLocation = page.locator(Homepage.userLocationButton);
    await expect(userLocation).toHaveText('Москва');
});

test('Select user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const userLocation = page.locator(Homepage.userLocationButton);
    await userLocation.click();
    await page.locator('text=Санкт-Петербург').click();
    await expect(userLocation).toHaveText('Санкт-Петербург');
});
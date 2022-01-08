import { test, expect } from '@playwright/test';
import { Homepage } from '../pageObjects/homepage';

test('User location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const title = page.locator(Homepage.userLocation);
    await expect(title).toHaveText('Москва');
});
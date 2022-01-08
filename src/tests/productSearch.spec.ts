import { test, expect } from '@playwright/test';
import { Homepage } from '../pageObjects/homepage';

test('Search for Iphone 13', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    await page.locator(Homepage.productSearchInput).fill('iphone 13');
    await page.locator(Homepage.productSearchButton).click();
    const activeFilter = page.locator('[data-widget="searchResultsFiltersActive"]');
    await expect(activeFilter).toContainText("Бренды");
    await expect(activeFilter).toContainText("Apple");
});
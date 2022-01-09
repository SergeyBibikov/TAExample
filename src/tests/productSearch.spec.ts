import { test, expect } from '@playwright/test';
import { Homepage } from '../pageObjects/homepage';

test('Search for Iphone 13', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.searchProduct(page, 'iphone 13');
    const activeFilter = page.locator('[data-widget="searchResultsFiltersActive"]');
    await expect(activeFilter).toContainText("Бренды");
    await expect(activeFilter).toContainText("Apple");
});

test('Unsuccessful search', async ({ page }) => {
    const searchString = 'grgew';

    await Homepage.open(page);
    await Homepage.searchProduct(page, searchString);
    const resultsCount = page.locator('[data-widget="fulltextResultsHeader"]');
    await expect(resultsCount).toContainText('По запросу grew найдено');
    await expect(resultsCount).toContainText(`Вы искали ${searchString}?`);

});
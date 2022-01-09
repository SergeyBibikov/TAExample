import { test, expect } from '@playwright/test';
import * as assert from 'assert';

import { Homepage } from '../pageObjects/homepage';
import { SearchResults } from '../pageObjects/searchResults';
//TODO: Add filters

test('Search for Iphone 13', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.searchProduct(page, 'iphone 13');
    await SearchResults.haveActiveFilters(page, ['Бренды: Apple']);
    const category = await SearchResults.getDetectedCategory(page);
    assert.strictEqual(category, "Смартфоны Apple");
});

//TODO: Choose exact search
test('Unsuccessful search', async ({ page }) => {
    const searchString = 'grgew';

    await Homepage.open(page);
    await Homepage.searchProduct(page, searchString);
    const resultsCount = page.locator('[data-widget="fulltextResultsHeader"]');
    await expect(resultsCount).toContainText('По запросу grew найдено');
    await expect(resultsCount).toContainText(`Вы искали ${searchString}?`);

});
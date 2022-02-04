import { test, expect } from '@playwright/test';
import * as assert from 'assert';

import { Homepage } from '../pageObjects/homepage';
import { SearchResults } from '../pageObjects/searchResults';


test('Search for Iphone 13', async ({ page }) => {
    const filterCategories = ['Оперативная память', 'Линейка'];
    const filterOptions = ['4-8 ГБ', 'Apple iPhone 13' ];

    await Homepage.open(page);
    await Homepage.searchProduct(page, 'iphone 13');
    const foundItemsCount = await SearchResults.getFoundItemsCount(page);
    assert.equal(foundItemsCount > 400, true, `Found items count = ${foundItemsCount}`);
    const category = await SearchResults.getDetectedCategory(page);
    assert.strictEqual(category, "Смартфоны Apple");
    await page.pause();
    await SearchResults.addFilter(page, filterCategories[0], filterOptions[0]);
    await SearchResults.addFilter(page, filterCategories[1], filterOptions[1]);
    await page.waitForSelector('text=Очистить всё');
    await SearchResults.haveActiveFilters(page, [
        'Бренды: Apple',
        `${filterCategories[0]}: ${filterOptions[0]}`,
        `${filterCategories[1]}: ${filterOptions[1]}`]);
});

test('Pagination', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.searchProduct(page, 'iphone 13');
    const initialTopResult = await SearchResults.getFirstItemName(page);
    await SearchResults.goToPaginationPage(page, 2);
    const currentTopResult = await SearchResults.getFirstItemName(page);
    assert.notDeepEqual(currentTopResult, initialTopResult);
});

test('Unsuccessful search', async ({ page }) => {
    const searchString = 'gjdsf';
    await Homepage.open(page);
    await Homepage.searchProduct(page, searchString);
    const resultsCount = page.locator(SearchResults.fullTextResults);
    await expect(resultsCount).toContainText('По запросу пова найден');
    await expect(resultsCount).toContainText(`Вы искали ${searchString}?`);
    await resultsCount.locator('div >> nth=1').click();
    await page.waitForSelector('//div[contains(text(),"Простите, по вашему запросу товаров сейчас нет.")]', { timeout: 5000 });
});
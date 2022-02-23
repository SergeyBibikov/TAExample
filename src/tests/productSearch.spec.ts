import { test, expect } from '@playwright/test';
import * as assert from 'assert';

import { Homepage } from '../pageObjects/homepage';
import { SearchResults } from '../pageObjects/searchResults';
import { Header } from '../pageObjects/header';

test('Category select and delete', async ({ page }) => {
    await Homepage.open(page);
    const catLoc = page.locator(Header.SEARCH_CATEGORY);
    await expect(catLoc).toContainText('Везде');
    await catLoc.click();
    const popUp = page.locator('[data-widget="searchContextPopup"]');
    await expect(popUp).toHaveCount(1);
    await popUp.locator('text=Одежда').click();
    await expect(catLoc).toContainText('Одежда');
    await catLoc.locator('span').nth(1).click();
    await expect(catLoc).toContainText('Везде');
});

test('Search for Iphone 13', async ({ page }) => {
    const filterCategories = ['Оперативная память', 'Линейка'];
    const filterOptions = ['4-8 ГБ', 'Apple iPhone 13'];

    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    const foundItemsCount = await SearchResults.getFoundItemsCount(page);
    assert.equal(foundItemsCount > 400, true, `Found items count = ${foundItemsCount}`);
    const category = await SearchResults.getDetectedCategory(page);
    assert.strictEqual(category, "Смартфоны Apple");
    await SearchResults.addFilter(page, filterCategories[0], filterOptions[0]);
    await SearchResults.addFilter(page, filterCategories[1], filterOptions[1]);
    await page.waitForSelector('text=Очистить всё');
    await SearchResults.haveActiveFilters(page, [
        'Бренды: Apple',
        `${filterCategories[0]}: ${filterOptions[0]}`,
        `${filterCategories[1]}: ${filterOptions[1]}`]);
});
test('Search history', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    await Header.clearSearch(page);
    await expect(page.locator(Header.SEARCH_HISTORY)).toHaveCount(1);
    await Header.clearHistory(page);
    await expect(page.locator(Header.SEARCH_HISTORY)).toHaveCount(0);
});
test('"Didn\'t find what you need?" button', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    const didntFindButton = "xpath=//div[contains(text(),'Не нашли, что искали?')]";
    await page.waitForSelector(didntFindButton);
    await page.locator(didntFindButton).click();
    const didntFindForm = '//form[contains(.,"Не нашли, что искали?")]';
    await expect(page.locator(didntFindForm)).toHaveCount(1);
    await expect(page.locator(didntFindForm).locator('//fieldset//div[contains(text(),"Товар")]')).toHaveCount(1);
    await expect(page.locator(didntFindForm).locator('//fieldset//div[contains(text(),"Бренд")]')).toHaveCount(1);
    const inpLoc = '//p[contains(text(),"Ссылка на товар")]/preceding-sibling::input';
    await expect(page.locator(didntFindForm).locator(inpLoc)).toHaveCount(1);
    await expect(page.locator(didntFindForm).locator('//button//span[contains(text(),"Отправить")]')).toHaveCount(1);
});
test('Pagination', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    const initialTopResult = await SearchResults.getFirstItemName(page);
    await SearchResults.goToPaginationPage(page, 2);
    const currentTopResult = await SearchResults.getFirstItemName(page);
    assert.notDeepEqual(currentTopResult, initialTopResult);
});
test('Add item to favourites', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToFavourites(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    assert.equal((await Header.getFavouriteItemsCount(page)), 1);
    await Header.goToFavourites(page);
    await expect(page.locator(SearchResults.FOUND_ITEMS_LIST)).toContainText("Смартфон Apple iPhone 13 128GB, темная ночь");
});
test('Add item to comparison', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.clickMoreOnItemCard(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    const similarProducts = page.locator('//div[contains(text(),"Похожие товары")]');
    await expect(similarProducts).toHaveCount(1);
    const addToComparison = page.locator('//div[contains(text(),"Добавить в сравнение")]');
    await expect(addToComparison).toHaveCount(1);
    await addToComparison.click();
    await expect(page.locator('//div[contains(text(), "Товар добавлен")]')).toHaveCount(1);
    await SearchResults.clickMoreOnItemCard(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    const deleteFromComparison = page.locator('//div[contains(text(),"Удалить из сравнения")]');
    await expect(deleteFromComparison).toHaveCount(1);
    await deleteFromComparison.click();
    await expect(page.locator('//div[contains(text(), "Товар удален")]')).toHaveCount(1);
});
test('Unsuccessful search', async ({ page }) => {
    const searchString = 'gjdsf';
    await Homepage.open(page);
    await Header.searchProduct(page, searchString);
    const resultsCount = page.locator(SearchResults.fullTextResults);
    await expect(resultsCount).toContainText('По запросу пова найден');
    await expect(resultsCount).toContainText(`Вы искали ${searchString}?`);
    await resultsCount.locator('div >> nth=1').click();
    await page.waitForSelector('//div[contains(text(),"Простите, по вашему запросу товаров сейчас нет.")]', { timeout: 5000 });
});
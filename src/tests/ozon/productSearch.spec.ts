import { test, expect } from '@playwright/test';
import * as assert from 'assert';

import { Homepage } from '../../pageObjects/homepage';
import { SearchResults } from '../../pageObjects/searchResults';
import { Header } from '../../pageObjects/header';

test('Search history', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    await Header.clearSearch(page);
    await expect(page.locator(Header.SEARCH_HISTORY)).toHaveCount(1);
    await Header.clearHistory(page);
    await expect(page.locator(Header.SEARCH_HISTORY)).toHaveCount(0);
});
test('Pagination', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'iphone 13');
    const initialTopResult = await SearchResults.getFirstItemName(page);
    await SearchResults.goToPaginationPage(page, 2);
    const currentTopResult = await SearchResults.getFirstItemName(page);
    assert.notDeepEqual(currentTopResult, initialTopResult);
});
test.skip('Toggle item comparison', async ({ page }) => {
    const modelFull = 'Смартфон Xiaomi 11 Lite 5G NE 8/256GB, черный';
    const modelShort = 'xiaomi mi 11';

    await Homepage.open(page);
    await Header.searchProduct(page, modelShort);
    await SearchResults.clickMoreOnItemCard(page, modelFull);
    const similarProducts = page.locator('//div[contains(text(),"Похожие товары")]');
    await expect(similarProducts).toHaveCount(1);
    const addToComparison = page.locator('//div[contains(text(),"Добавить в сравнение")]');
    await expect(addToComparison).toHaveCount(1);
    await addToComparison.click();
    await expect(page.locator('//div[contains(text(), "Товар добавлен")]')).toHaveCount(1);
    await SearchResults.clickMoreOnItemCard(page, modelFull);
    const deleteFromComparison = page.locator('//div[contains(text(),"Удалить из сравнения")]');
    await expect(deleteFromComparison).toHaveCount(1);
    await deleteFromComparison.click();
    await expect(page.locator('//div[contains(text(), "Товар удален")]')).toHaveCount(1);
});
test.skip('Add two items to comparison and go to compare page', async ({ page }) => {
    const firstItem = 'Iphone 13 128GB';
    const firstItemFull = 'Смартфон Apple iPhone 13 128GB, темная ночь';

    const secondItem = 'xiaomi mi 11';
    const secondItemFull = 'Смартфон Xiaomi 11 Lite 5G NE 8/256GB, черный';

    const comparisonContainer = page.locator('[data-widget="webCompare"]');

    await Homepage.open(page);
    await Header.searchProduct(page, firstItem);
    await SearchResults.addItemToComparison(page, firstItemFull);
    await Header.searchProduct(page, secondItem);
    await SearchResults.addItemToComparison(page, secondItemFull);
    await Header.goToFavourites(page);
    await page.locator('text=Сравнение товаров').click();
    await expect(comparisonContainer).toContainText(firstItemFull);
    await expect(comparisonContainer).toContainText(secondItemFull);
    const categoryTabs = page.locator('//div[@data-widget="webCompare"]/div[2]');
    await expect(categoryTabs).toContainText('Смартфоны');
    await expect(categoryTabs).toContainText('Все товары');
});
test.skip('Clear comparison', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToComparison(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    await Header.goToFavourites(page);
    await page.locator('text=Сравнение товаров').click();
    await page.locator('text=Очистить все сравнение').click();
    const confirmationPopup = page.locator('//div[h3[text()="Удаление списка"]]');
    await expect(confirmationPopup).toHaveCount(1);
    await expect(confirmationPopup).toContainText('Вы хотите удалить все товары из сравнения? Отменить действие будет невозможно.');
    await confirmationPopup.locator('text=Очистить список').click();
    await expect(page.locator('body')).toContainText('В сравнении пока ничего нет');
});
test('Unsuccessful search', async ({ page }) => {
    const searchString = 'sdfsdf23sdfsdf';
    await Homepage.open(page);
    await Header.searchProduct(page, searchString);
    await page.waitForSelector('//div[contains(text(),"Простите, по вашему запросу товаров сейчас нет.")]', { timeout: 5000 });
});
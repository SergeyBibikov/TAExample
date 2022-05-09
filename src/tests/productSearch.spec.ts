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

test('Search for Samsung Galaxy S20 FE', async ({ page }) => {
    const filterCategories = ['Оперативная память', 'Встроенная память'];
    const filterOptions = ['4-8 ГБ', '64-128 ГБ'];

    await Homepage.open(page);
    await Header.searchProduct(page, 'samsung galaxy s20');
    const foundItemsCount = await SearchResults.getFoundItemsCount(page);
    assert.equal(foundItemsCount > 100, true, `Found items count = ${foundItemsCount}`);
    const category = await SearchResults.getDetectedCategory(page);
    assert.strictEqual(category, "Смартфоны");
    await SearchResults.addFilter(page, filterCategories[0], filterOptions[0]);
    await SearchResults.addFilter(page, filterCategories[1], filterOptions[1]);
    await page.waitForSelector('text=Очистить всё');
    await SearchResults.haveActiveFilters(page, [
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
test('Toggle item comparison', async ({ page }) => {
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
test('Add two items to comparison and go to compare page', async ({ page }) => {
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
test('Clear comparison', async ({ page }) => {
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
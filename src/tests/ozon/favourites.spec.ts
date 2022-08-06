import { expect, test } from '@playwright/test';
import { Favourites } from '../../pageObjects/favourites';
import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';
import { SearchResults } from '../../pageObjects/searchResults';
import * as assert from 'assert';

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await Homepage.open(page);
    await Header.searchProduct(page, 'xiaomi mi 11');
    await SearchResults.addItemToFavourites(page, 'Смартфон Xiaomi 11 Lite 5G NE 8/256GB, черный');
    await context.storageState({ path: Favourites.fileName });
});
test('Add item to favourites', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Homepage.open(page);
    assert.equal((await Header.getFavouriteItemsCount(page)), 1);
    await Header.goToFavourites(page);
    await expect(page.locator(SearchResults.FOUND_ITEMS_LIST)).toContainText('Смартфон Xiaomi 11 Lite 5G NE 8/256GB, черный');
});
test('Empty comparison', async ({ page }) => {
    await Favourites.open(page);
    await page.locator('text=Сравнение товаров').click();
    await expect(page.locator('div[data-widget="container"]')).toContainText('В сравнении пока ничего нет');
    await expect(page.locator('//a[contains(text(),"Перейдите к каталогу товаров")]')).toHaveCount(1);
});
test('Favourite shops', async ({ page }) => {
    await Favourites.open(page);
    await page.locator('text=Избранные магазины').click();
    await expect(page.locator('div[data-widget="myGuest"]')).toContainText('Вы не авторизованы');
});
test('In stock radiobox', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);
    await page.locator('//label[div[contains(.,"В наличии")]]').check();
    await expect(page.locator('//button[span[contains(.,"В наличии")]]')).toHaveCount(1);
    await expect(page.locator('//button[span[contains(.,"Очистить")]]')).toHaveCount(1);
});
test('Not in stock radiobox', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);
    await page.locator('//label[div[contains(.,"Не в наличии")]]').check();
    await expect(page.locator('//button[span[contains(.,"Не в наличии")]]')).toHaveCount(1);
    await expect(page.locator('//button[span[contains(.,"Очистить")]]')).toHaveCount(1);
    await expect(page.locator('body')).toContainText('Ничего не нашлось');
});
test('Clear filters', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);

    await page.locator('//label[div[contains(.,"В наличии")]]').check();
    await page.locator('//button[span[contains(.,"Очистить")]]').click();

    await expect(page.locator('//button[span[contains(.,"Не в наличии")]]')).toHaveCount(0);
    await expect(page.locator('//label[div[contains(.,"Неважно")]]')).toBeChecked();
});
test('My collection', async ({ page }) => {
    await Favourites.open(page);
    await page.locator('text=Моя коллекция').click();
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('Коллекция пуста');
});
test('Delete from favourites', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);
    await page.click('(//div[@data-widget="searchResultsV2"]//button)[3]');
    assert.equal((await Header.getFavouriteItemsCount(page)), 0);
});
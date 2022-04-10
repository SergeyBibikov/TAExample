import { expect, test } from '@playwright/test';
import { Favourites } from '../pageObjects/favourites';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { SearchResults } from '../pageObjects/searchResults';
import * as assert from 'assert';

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToFavourites(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    await context.storageState({ path: Favourites.fileName });
});

test('Add item to favourites', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Homepage.open(page);
    assert.equal((await Header.getFavouriteItemsCount(page)), 1);
    await Header.goToFavourites(page);
    await expect(page.locator(SearchResults.FOUND_ITEMS_LIST)).toContainText('Смартфон Apple iPhone 13 128GB, темная ночь');
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
test('My collection', async ({ page }) => {
    await Favourites.open(page);
    await page.locator('text=Моя коллекция').click();
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('Коллекция пуста');
});
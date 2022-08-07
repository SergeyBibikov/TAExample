import { expect, test } from '@playwright/test';
import { Favourites } from '../../pageObjects/favourites';
import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';
import { SearchResults } from '../../pageObjects/searchResults';
import * as assert from 'assert';
import Urls from '../../urls';

/*
    Passing
*/
test('Empty collection', async ({ page }) => {
    await page.goto(Urls.OZON_FAVOURITES_COLLECTION);
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('Коллекция пуста');
});

test('Empty favourites', async ({ page }) => {
    await Favourites.open(page);
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('В избранном пусто');
});



/*
    FIX OR DELETE
*/


test.skip('Clear filters', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);

    await page.locator('//label[div[contains(.,"В наличии")]]').check();
    await page.locator('//button[span[contains(.,"Очистить")]]').click();

    await expect(page.locator('//button[span[contains(.,"Не в наличии")]]')).toHaveCount(0);
    await expect(page.locator('//label[div[contains(.,"Неважно")]]')).toBeChecked();
});

test.skip('Delete from favourites', async ({ browser }) => {
    const page = await Favourites.getPageWithContext(browser);
    await Favourites.open(page);
    await page.click('(//div[@data-widget="searchResultsV2"]//button)[3]');
    assert.equal((await Header.getFavouriteItemsCount(page)), 0);
});
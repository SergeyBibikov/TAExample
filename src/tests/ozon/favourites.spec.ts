import { expect, test } from '@playwright/test';
import { Favourites } from '../../pageObjects/favourites';
import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';
import Urls from '../../urls';

test('Empty collection', async ({ page }) => {
    await page.goto(Urls.OZON_FAVOURITES_COLLECTION);
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('Коллекция пуста');
});

test('Empty favourites', async ({ page }) => {
    await Favourites.open(page);
    await expect(page.locator('section[data-widget="emptyState"]')).toContainText('В избранном пусто');
});
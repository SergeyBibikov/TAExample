import { test, expect } from '@playwright/test';
import * as assert from 'assert';
import { Homepage } from '../pageObjects/homepage';

test('Auto detected user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const currentLocation = await Homepage.getCurrentUserLocation(page);
    assert.equal(currentLocation, 'Москва');
});

test('Change user location', async ({ page }) => {
    const newLocation = 'Санкт-Петербург';

    await Homepage.open(page);
    await Homepage.setUserLocation(page, newLocation);
    const currentLocation = await Homepage.getCurrentUserLocation(page);
    assert.equal(currentLocation, newLocation);
});
//TODO: check if it works tomorrow
test('Delivery address pick', async ({ page }) => {
    await Homepage.open(page);
    await page.locator(Homepage.DELIVERY_ADDRESS).click();
    const addrWidget = page.locator('[data-widget="commonAddressBook"]');
    await expect(addrWidget).toHaveCount(1);
    await expect(addrWidget).toContainText('Добавьте точный адрес, удобный пункт выдачи или постамат, чтобы заранее увидеть условия доставки товаров');
});
import { test, expect } from '@playwright/test';
import * as assert from 'assert';
import { Homepage } from '../pageObjects/homepage';

test('Auto detected user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const currentLocation = await Homepage.getCurrentLocation(page);
    assert.equal(currentLocation, 'Москва');
});

test('Change user location', async ({ page }) => {
    const newLocation = 'Санкт-Петербург';

    await Homepage.open(page);
    await Homepage.setLocation(page, newLocation);
    const currentLocation = await Homepage.getCurrentLocation(page);
    assert.equal(currentLocation, newLocation);
});
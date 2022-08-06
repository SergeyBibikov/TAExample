import { test } from '@playwright/test';
import * as assert from 'assert';
import { Homepage } from '../../pageObjects/homepage';

test('Auto detected user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const currentLocation = await Homepage.getCurrentUserLocation(page);
    assert.equal(currentLocation, 'Москва');
});
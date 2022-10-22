import { test, expect } from '@playwright/test';
import { Homepage } from '../../pageObjects/homepage';

test('Auto detected user location', async ({ page }) => {
    await page.goto('https://www.ozon.ru/');
    const currentLocation = await Homepage.getCurrentUserLocation(page);

    expect(['Москва', 'Смоленск']).toContain(currentLocation);
});
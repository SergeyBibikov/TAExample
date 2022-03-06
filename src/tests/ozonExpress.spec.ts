import { test, expect } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';

test('Smoke', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Express');
    await expect(page
    .locator('[data-widget="addressSelector"]')
    .locator('text=Укажите адрес доставки')).toHaveCount(1);
});
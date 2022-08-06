import { test, expect } from '@playwright/test';
import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';

test('Smoke', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon fresh');
    await expect(page
    .locator('[data-widget="addressSelectorLite"]')
    .locator('text=Укажите адрес доставки')).toHaveCount(1);
});
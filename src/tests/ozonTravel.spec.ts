import { test, expect } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';

test('Ozon Travel Link', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Travel');
    await expect(page.locator('body')).toContainText('Покупать билеты на Ozon выгодно');
});
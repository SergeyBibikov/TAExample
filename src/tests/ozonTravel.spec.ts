import { test, expect } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';

test('Header Link', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Travel');
    await expect(page.locator('body')).toContainText('Покупать билеты на Ozon выгодно');
});
test('Avia-Railway tickets toggle ', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Travel');
    await expect(page.locator('body')).toContainText('Поиск дешёвых авиабилетов');
    await page.locator('//span[text()="ЖД билеты"]/ancestor::button').click();
    await expect(page.locator('body')).toContainText('Жд билеты на поезд');
});

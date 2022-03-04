import { test, expect, Page } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';

const goToTravel = async (page: Page) =>{
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Travel');
}

test('Header Link', async ({ page }) => {
    await goToTravel(page);
    await expect(page.locator('body')).toContainText('Покупать билеты на Ozon выгодно');
});
test('Avia-Railway tickets toggle ', async ({ page }) => {
    await goToTravel(page);
    await expect(page.locator('body')).toContainText('Поиск дешёвых авиабилетов');
    await page.locator('//span[text()="ЖД билеты"]/ancestor::button').click();
    await expect(page.locator('body')).toContainText('Жд билеты на поезд');
});
test('Reserve as a juridical face', async ({ page }) => {
    await goToTravel(page);
    await page.locator('text=Бронируйте как юрлицо').click();
    await expect(page.locator('body')).toContainText('OZON Командировки');
    await expect(page.locator('body')).toContainText('Уникальный сервис для оформления деловых поездок');
});
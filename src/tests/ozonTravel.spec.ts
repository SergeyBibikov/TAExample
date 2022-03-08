import { test, expect, Page } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { OzonTravel } from '../pageObjects/ozonTravel';
import * as assert from 'assert';

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
test('Destination switch network calls', async ({ page }) => {

    const fromLoc = page.locator(OzonTravel.FROM);
    const toLoc = page.locator(OzonTravel.TO);

    await goToTravel(page);
    await page.waitForTimeout(1000);
    await toLoc.click();
    await fromLoc.click();
    await page.locator('text=MOW').first().click();
    await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/travelMainSaveField');
    await toLoc.click();
    await page.locator('text=LED').first().click();
    await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/travelMainSaveField');
    await page.locator(OzonTravel.DESTINATION_SWITCH).click();
    await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/travelAutocompleteLocation');
});
test('Validation of empty fields', async ({ page }) => {
    const findTickets = page.locator('//button[contains(.,"Найти билеты")]');

    await goToTravel(page);
    await findTickets.click();
    await page.waitForResponse('https://xapi.ozon.ru/api/frontend-perf.bx/v2/events');
    await findTickets.click();
    await findTickets.click();
    await page.waitForSelector('input[name="travelSearchFrom"][errors="Введите город вылета"]')
    await page.waitForSelector('input[name="travelSearchTo"][errors="Введите город прилета"]')
    await page.waitForSelector('//p[text()="Туда"]/ancestor::label/..//p[text()="Введите дату"]');
});
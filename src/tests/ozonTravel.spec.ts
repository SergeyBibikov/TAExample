import { test, expect } from '@playwright/test';
import { todayPlus, todayPlusAsStr } from '../helpers/dates';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { OzonTravel } from '../pageObjects/ozonTravel';


test.beforeEach(async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Travel');
    await page.waitForResponse('https://ozon-api.exponea.com/managed-tags/show');
});
test('Successful page load', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Покупать авиа- и ж/д билеты на Ozon удобно!');
});
test('Avia-Railway tickets toggle ', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Поиск дешёвых авиабилетов');
    await page.locator('//span[text()="ЖД билеты"]/ancestor::button').click();
    await expect(page.locator('body')).toContainText('Жд билеты на поезд');
});
test('Reserve as a juridical face', async ({ page }) => {
    await page.locator('text=Бронируйте как юрлицо').click();
    await expect(page.locator('body')).toContainText('OZON Командировки');
    await expect(page.locator('body')).toContainText('Уникальный сервис для оформления деловых поездок');
});
test('Destination switch network calls', async ({ page }) => {

    const fromLoc = page.locator(OzonTravel.FROM);
    const toLoc = page.locator(OzonTravel.TO);

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

    await findTickets.click();
    await page.waitForResponse('https://xapi.ozon.ru/api/frontend-perf.bx/v2/events');
    await findTickets.click();
    await findTickets.click();
    await page.waitForSelector('input[name="travelSearchFrom"][errors="Введите город вылета"]')
    await page.waitForSelector('input[name="travelSearchTo"][errors="Введите город прилета"]')
    await page.waitForSelector('//p[text()="Туда"]/ancestor::label/..//p[text()="Введите дату"]');
});
test.describe('Railway tikets',() => {
    test('Search', async ({ page }) => {
        await page.locator('//span[text()="ЖД билеты"]/ancestor::button').click();
        await OzonTravel.findTicket(page, 'Москва', 'Санкт-Петербург', todayPlus(10));
        await page.waitForSelector('div[text="По времени отправления"]');
    });
})
test.describe('Hotels', () => {
    test('Smoke', async ({ page }) => {
        await OzonTravel.selectHotelTab(page);
        await expect(page.locator('body')).toContainText('Бронирование отелей и гостиниц');
    });
    test('Find by city', async ({ page }) => {
        await OzonTravel.selectHotelTab(page);
        await OzonTravel.findHotel(page, 'city', "Москва", todayPlusAsStr(3), todayPlusAsStr(20));
        await expect(page.locator('body')).toContainText('Опрашиваем подходящие отели');
    });
    test('Find by hotel', async ({ page }) => {
        await OzonTravel.selectHotelTab(page);
        await OzonTravel.findHotel(page, 'hotel', "SK ROYAL Москва 4", todayPlusAsStr(10), todayPlusAsStr(16));
        await expect(page.locator('body')).toContainText('Опрашиваем подходящие отели');
    });
    test('Find by airport', async ({ page }) => {
        
        await OzonTravel.selectHotelTab(page);
        await OzonTravel.findHotel(page, 'airport', "Аэропорт Москвы Домодедово", todayPlusAsStr(3), todayPlusAsStr(10));
        await expect(page.locator('body')).toContainText('Опрашиваем подходящие отели');
    });
}
)
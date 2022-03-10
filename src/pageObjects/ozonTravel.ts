import { Page } from '@playwright/test';

const searchForm = '//form[@data-widget="searchForm"]';

const hotelRoot = '//*[@data-widget="TravelHotelSearch"]';
const hotel = {
    city: hotelRoot + '/div[1]//input',
    arrival: hotelRoot + '//p[text()="Заезд"]/preceding-sibling::input',
    departure: hotelRoot + '//p[text()="Выезд"]/preceding-sibling::input',
    findHotel: hotelRoot + '//button[span[contains(., "Найти отель")]]'
}

export class OzonTravel {
    static FROM = '//p[text()="Откуда"]/preceding-sibling::input';
    static TO = '//p[text()="Куда"]/preceding-sibling::input';
    static DATE_TO = '//p[text()="Туда"]/..';
    static DESTINATION_SWITCH = searchForm + '/div/div[2]/button';
    static hotelLocators = hotel;

    
    static async selectHotelTab(page: Page){
        await page.locator('text=Отели').click();
        await page.waitForResponse('https://ozon-api.exponea.com/managed-tags/show');
    }
    
    static async findHotel(page: Page, city: string, arrival: string, departure: string){
        await page.locator(this.hotelLocators.city).fill(city);
        await page.locator(this.hotelLocators.city).click();
        await page.locator('//div[text()="Город"]/../following-sibling::div').click();
        await page.locator(this.hotelLocators.arrival).fill(arrival);
        await page.locator(this.hotelLocators.departure).fill(departure);
        await page.locator(this.hotelLocators.findHotel).click();
    }
}
import { Page } from '@playwright/test';

const searchForm = '//form[@data-widget="searchForm"]';

const hotelRoot = '//*[@data-widget="TravelHotelSearch"]';
const hotel = {
    place: hotelRoot + '/div[1]//input',
    arrival: hotelRoot + '//p[text()="Заезд"]/preceding-sibling::input',
    departure: hotelRoot + '//p[text()="Выезд"]/preceding-sibling::input',
    findHotel: hotelRoot + '//button[span[contains(., "Найти отель")]]'
}

type Place = 'city' | 'hotel' | 'airport';

async function fillPlaceField(page: Page, placeType: Place, placeName: string) {
    const loc = page.locator(OzonTravel.hotelLocators.place);
    await loc.fill(placeName);
    await loc.click();

    switch (placeType) {
        case 'city':
            await page.locator('//div[text()="Город"]/../following-sibling::div[1]').click();
            break;
        case 'hotel':
            await page.locator('//div[text()="Отель"]/../following-sibling::div[1]').click();
            break;
        case 'airport':
            await page.locator('//div[text()="Аэропорт"]/../following-sibling::div[1]').click();
            break;
    }
}

export class OzonTravel {
    static ADVANTAGES = '[data-widget="seoOzonAdvantages"]';
    static FROM = '//p[text()="Откуда"]/preceding-sibling::input';
    static TO = '//p[text()="Куда"]/preceding-sibling::input';
    static DATE = '//p[text()="Когда"]/..';
    static DATE_TO = '//p[text()="Туда"]/..';
    static DESTINATION_SWITCH = searchForm + '/div/div[2]/button';
    static hotelLocators = hotel;

    
    static async selectHotelTab(page: Page){
        await page.locator('text=Отели').click();
        await page.waitForResponse('https://ozon-api.exponea.com/managed-tags/show');
    }
    /**
     * Fills the fields and searches for a hotel
     * @param page 
     * @param placeType 
     * @param place should be as precise as possible as the first match will be selected
     * @param arrivalDate 
     * @param departureDate 
     */
    static async findHotel(page: Page, placeType: Place, place: string, arrivalDate: string, departureDate: string){
        await fillPlaceField(page, placeType, place);
        await page.locator(this.hotelLocators.arrival).fill(arrivalDate);
        await page.locator(this.hotelLocators.departure).fill(departureDate);
        await page.locator(this.hotelLocators.findHotel).click();
    }
    
    static async findTicket(page: Page, from: string, to: string, date: Date){
        const pickCity = async (city: string) => {
            await page.locator(`//div[@class="vue-portal-target"]//span[text()="${city}"]`).click();
        }
        const waitForField = async () => {
            await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/travelMainSaveField');
        }
        const fromLoc = page.locator(this.FROM);
        const toLoc = page.locator(this.TO);
        const dateLoc = page.locator(this.DATE);
        const dayLoc =  page.locator(`//td//div[contains(text(),"${date.getDate()}")]`).first();

        await toLoc.click();
        await fromLoc.click();
        await pickCity(from);
        await waitForField();       

        await toLoc.click();
        await pickCity(to);
        await waitForField();

        await dateLoc.click();
        await dayLoc.click();

        await page.locator('text=Найти билеты').click();
    }
}
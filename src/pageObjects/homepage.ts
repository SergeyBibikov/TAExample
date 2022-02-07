import { Page } from '@playwright/test';
import { Header } from './header';


export class Homepage {
    private static homepage = 'https://www.ozon.ru/';
    private static userLocationButton = '(//div[@role="navigation"]//button/span/span)[1]';
    private static searchBarDesktop = '//div[@data-widget="searchBarDesktop"]';
    private static productSearchInput = this.searchBarDesktop + '//input[@placeholder="Искать на Ozon"]';
    private static productSearchButton = this.searchBarDesktop + '//button';
    private static locationModal = '//h2[contains(text(), "Выберите город")]/parent::div';

    static topBar = '//div[@data-widget="topBar"]';

    static async open(page: Page) {
        await page.goto(this.homepage);
    }

    static async clickTopBarLink(page: Page, link: string){
        await page
            .locator(this.topBar)
            .locator(`//span[text()="${link}"]`)
            .click();
    }

    static async goToCart(page: Page) {
        await page.locator(Header.CART).click();
    }
    static async getCurrentUserLocation(page: Page): Promise<string | null> {
        return await page.locator(this.userLocationButton).textContent();
    }
    static async getTopBarLinks(page: Page): Promise<string[]> {
        const links = page.locator(this.topBar).locator('//ul/li');
        await links.first().waitFor({ state: "visible" });
        return (await links.allTextContents()).map(x => x.trim());
    }
    static async searchProduct(page: Page, searchItem: string) {
        await page.locator(Homepage.productSearchInput).fill(searchItem);
        await page.locator(Homepage.productSearchButton).click();
    }
    static async setUserLocation(page: Page, location: string) {
        await page.locator(this.userLocationButton).click();
        await page.locator(this.locationModal).locator(`text=${location}`).click();
        await page.waitForSelector(this.locationModal, { state: 'hidden' });
    }
}

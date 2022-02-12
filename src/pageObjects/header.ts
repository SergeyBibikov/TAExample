import { Page } from '@playwright/test';

export class Header {
    static ROOT = '//header[@data-widget="header"]';
    static readonly SEARCH_BAR = '//div[@data-widget="searchBarDesktop"]';
    static readonly SEARCH_INPUT = this.SEARCH_BAR + '//input[@placeholder="Искать на Ozon"]';
    static readonly SEARCH_BUTTON = this.SEARCH_BAR + '//button';
    static readonly SEARCH_CATEGORY = this.SEARCH_BAR + '/form/div[1]';
    static SIGN_IN = this.ROOT + '//div[@data-widget="profileMenuAnonymous"]';
    static CART = this.ROOT + '//a[@data-widget="headerIcon"]';
    static ORDERS = this.ROOT + '//div[@data-widget="orderInfo"]';
    static FAVOURITES = this.ROOT + '//a[@data-widget="favoriteCounter"]';
    static horizontalMenu = this.ROOT + '//ul[@data-widget="horizontalMenu"]';
    static CATALOGUE_ROOT = '//div[@data-widget="catalogMenu"]';
    static CATALOGUE_CATEGORIES = this.CATALOGUE_ROOT +'/div[2]/div/div[1]';
    static CATALOGUE_FILTERS = this.CATALOGUE_ROOT +'/div[2]/div/div[2]';

    static async getCartItemsCount(page: Page): Promise<number> {
        const counter = page
            .locator(this.CART)
            .locator('span')
            .first();
        await counter.waitFor({ state: "visible" });

        return Number(await counter.textContent());
    }

    static async getNavBarLinks(page: Page): Promise<string[]> {
        const links = page.locator(this.horizontalMenu+'/li');
        await links.first().waitFor({ state: "visible" });
        return (await links.allTextContents()).map(x => x.trim());
    }
    static async goToCart(page: Page) {
        await page.locator(this.CART).click();
    }

    static async goToOrders(page: Page) {
        await page.locator(this.ORDERS).click();
    }

    static async goToFavourites(page: Page) {
        await page.locator(this.FAVOURITES).click();
    }

    static async openCatalogue(page: Page){
        await page.locator('//button//span[text()="Каталог"]').click();
    }

    static async searchProduct(page: Page, searchItem: string) {
        await page.locator(this.SEARCH_INPUT).fill(searchItem);
        await page.locator(this.SEARCH_BUTTON).click();
    }
}

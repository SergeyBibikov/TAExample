import { Page } from '@playwright/test';

export class Header {

    static ROOT = '//header[@data-widget="header"]';
    static CART_LINK = this.ROOT + '//a[@data-widget="headerIcon"]';
    static horizontalMenu = this.ROOT + '//ul[@data-widget="horizontalMenu"]'

    static async getCartItemsCount(page: Page): Promise<number> {
        const counter = page
            .locator(this.CART_LINK)
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
}

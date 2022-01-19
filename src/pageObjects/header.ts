import { Page } from '@playwright/test';

export class Header{
    static ROOT = '//header[@data-widget="header"]';
    static CART_LINK = this.ROOT + '//a[@data-widget="headerIcon"]';

    static async getCartItemsCount(page: Page):Promise<number>{
        const counter = page
            .locator(this.CART_LINK)
            .locator('span')
            .first();
        await counter.waitFor({state:"visible"});
            
        return Number(await counter.textContent());
    }
}
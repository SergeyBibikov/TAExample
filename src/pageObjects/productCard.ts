import { Page } from '@playwright/test';

export class ProductCard {
    static readonly checkoutSection = '[data-widget="webAddToCart"]';
    static readonly nameSection = '//*[@data-widget="webDetailSKU"]/../..';
    static readonly inCartButtonContainer = '//span[contains(., "В корзине")]/ancestor::button/..';


    static async addToCart(page: Page) {
        await page.locator(this.checkoutSection).locator('text=Добавить в корзину').click();
        await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/addToCart');
    }

    static async decreaseQty(page: Page) {
        const minusLoc = `${this.inCartButtonContainer}/following-sibling::div`;
        await page.locator(minusLoc).locator('span').first().click();
    }

}
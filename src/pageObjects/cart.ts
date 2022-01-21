import { Page } from '@playwright/test';

export class Cart{

    static readonly B2B_POPUP = '//div[@data-widget="alertPopup"]';

    static async closeB2BPopup(page: Page) {
       await page
            .locator(this.B2B_POPUP)
            .locator('button')
            .nth(1)
            .click();
    }
}
import { Page } from '@playwright/test';

export class Cart{

    static readonly B2B_POPUP = '//div[@data-widget="alertPopup"]';
    static readonly CONFIRM_DELETION_POPUP='div.vue-portal-target section';

    static async closeB2BPopup(page: Page) {
        await page
        .locator(this.B2B_POPUP)
        .locator('button')
        .nth(1)
        .click();
    }
    
    static async confirmItemsDeletion(page: Page) {
        await page
                .locator(this.CONFIRM_DELETION_POPUP)
                .locator('//button[contains(., "Удалить")]')
                .click();
    }

    static async deleteSelectedItems(page: Page) {
        await page
                .locator('text=Удалить выбранные')
                .click();
    }

    
    static async goToCheckout(page: Page){
        await page
                .locator('text=Перейти к оформлению')
                .first()
                .click();
    }
}
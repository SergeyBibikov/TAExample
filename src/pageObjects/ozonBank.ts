import { Page, expect } from "@playwright/test";

export class Bank {
    static selectors = {
        helpSection : '//h2[text()="Помощь"]/..',
        about : 'div[class^="header"] >> text=О банке',
    }
    
    static getAboutLocator(page: Page){
        return page.locator(this.selectors.about)
    }
    static getHelpSectionCardLocator(sectionName: string): string {
        return this.selectors.helpSection + `//span[contains(., "${sectionName}")]/ancestor::div[contains(@class, "sliding-box")]`;
    }
    static async checkHelpCardContent(page: Page, card: string, expectedText: string) {
        const cardLocator = page.locator(this.getHelpSectionCardLocator(card));

        const tryToCheck = async () => {
            await cardLocator.locator('div', { hasText: card }).click();
            await expect(cardLocator.locator('div.content')).toContainText(expectedText);

        };
        try {
            await tryToCheck();
        } catch (error) {
            await page.waitForTimeout(500);
            await page.evaluate(() => { window.stop() });
            await tryToCheck();
        }
    }
}
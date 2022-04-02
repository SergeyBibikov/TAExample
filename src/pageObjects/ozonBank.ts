import { Page, expect } from "@playwright/test";

export class Bank {
    static helpSection = '//h2[text()="Помощь"]/..';

    static getHelpSectionCardLocator(sectionName: string): string {
        return this.helpSection + `//span[contains(., "${sectionName}")]/ancestor::div[contains(@class, "sliding-box")]`;
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
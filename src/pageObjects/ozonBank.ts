import { Page, Locator } from "@playwright/test";

export class Bank {
    static selectors = {
        helpSection: '//h2[text()="Вопросы и ответы"]/..',
        about: 'div[class^="header"] >> text=О банке',
    }

    static getAboutLocator(page: Page) {
        return page.locator(this.selectors.about)
    }
    static getHelpSectionCardLocator(sectionName: string): string {
        return this.selectors.helpSection + `//span[contains(., "${sectionName}")]/ancestor::div[contains(@class, "sliding-box")]`;
    }
    static async getAnswerCardContent(page: Page, card: string): Promise<Locator> {
        await page.waitForLoadState('networkidle');
        const question = page.locator(this.getHelpSectionCardLocator(card));
        await question.click();
        return question.locator('div.content');
    }
}
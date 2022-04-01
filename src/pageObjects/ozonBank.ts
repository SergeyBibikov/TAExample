export class Bank{
    static helpSection = '//h2[text()="Помощь"]/..';

    static getHelpSectionCardLocator(sectionName: string): string{
        return this.helpSection + `//span[contains(., "${sectionName}")]/ancestor::div[contains(@class, "sliding-box")]`;
    }
}
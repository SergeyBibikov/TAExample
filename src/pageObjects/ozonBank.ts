export class Bank{
    static helpSection = '//h2[text()="Помощь"]/..';
    static howToOpenAccountCard = this.helpSection + '//span[contains(., "Как открыть")]/ancestor::div[contains(@class, "sliding-box")]';
}
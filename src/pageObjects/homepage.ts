export class Homepage {
    static userLocationButton = '(//div[@role="navigation"]//button/span/span)[1]';
    static searchBarDesktop = '//div[@data-widget="searchBarDesktop"]';
    static productSearchInput = this.searchBarDesktop + '//input[@placeholder="Искать на Ozon"]';
    static productSearchButton = this.searchBarDesktop + '//button';
}
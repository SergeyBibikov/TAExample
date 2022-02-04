import { Page } from '@playwright/test';
import * as assert from 'assert';

const toCart = '//*[contains(text(),"В корзину")]/ancestor::button';
const regularCart = '//*[contains(text(),"Завтра")]/ancestor::span/preceding-sibling::div';
const expressCart = '//*[contains(text(),"За час")]/ancestor::span/preceding-sibling::div';

export class SearchResults {
    static fullTextResults = '//div[@data-widget="fulltextResultsHeader"]';
    static activeFilters = '//div[@data-widget="searchResultsFiltersActive"]';
    static searchResultsError = '//div[@data-widget="searchResultsError"]';
    static foundItemsList = '//div[@data-widget="searchResultsV2"]/div';
    static readonly pagination = '//div[@data-widget="megaPaginator"]';
    static buttons = {
        TO_CART_REGULAR: regularCart + toCart,
        TO_CART_EXPRESS: expressCart + toCart,
    }

    static async getDetectedCategory(page: Page): Promise<string> {
        const content = await page.locator(this.fullTextResults + '//div')
            .first()
            .locator('//a').textContent();
        return content || "";
    }

    static async getActiveFilters(page: Page): Promise<string[]> {
        await page.waitForSelector(this.activeFilters);
        const handles = await page.locator(this.activeFilters + '/div/div').elementHandles();

        const filters: string[] = [];
        for (const handle of handles) {
            const el = await handle.$('//button/span/div/span');
            filters.push((await el?.textContent()) || "");
        }
        return filters;
    }

    /**
     * Returns the name of first item in the list of found items.
     * When there are not items found, returns an empty string
     */
    static async getFirstItemName(page: Page):Promise<string>{
        return (await page
        .locator(this.foundItemsList)
        .locator('xpath=/div')
        .first()//first item card
        .locator('xpath=/div')
        .nth(1)//card's section with name
        .locator('//a//span')
        .first()//item's name
        .locator('xpath=/span')
        .textContent()) || "";
    }

    /**
     * Go to different page of search results
     */
    static async goToPaginationPage(page: Page, pageNum: number) {
        await page
                .locator(this.pagination)
                .locator(`//a[text()=${pageNum}]`)
                .click();
        await page.waitForResponse("https://www.ozon.ru/api/composer-api.bx/widget/json/v2");
    }

    /**
     * Checks if all search filters are present
     */
    static async haveActiveFilters(page: Page, expectedFilters: string[]) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const activeFilters = await this.getActiveFilters(page);
        const missingFilters: string[] = [];
        for (const filter of expectedFilters) {
            if (!activeFilters.includes(filter)) missingFilters.push(filter);
        }
        if (missingFilters.length > 0) assert.fail(`Missing filters: ${missingFilters}`);
    }

    /**
     * Adds a filter to the search results
     */
    static async addFilter(page: Page, filterName: string, filterOption: string){
        await page.locator(`//div[contains(text(), "${filterName}")]/parent::div`)
        .locator(`//span[contains(text(),"${filterOption}")]/parent::div/preceding-sibling::div`)
        .click();
    }
    /**
     * Adds an item to a regular cart, not the express one
     */
    static async addItemToReqularCart(page: Page, itemName: string) {
        const itemDataDiv = page
            .locator(this.foundItemsList)
            .locator(`//span[contains(text(),"${itemName}")]/ancestor::a/parent::div/parent::div`);
        await itemDataDiv
            .locator('xpath=/following-sibling::div[1]')
            .locator(this.buttons.TO_CART_REGULAR)
            .click();
        await itemDataDiv
            .locator('xpath=/following-sibling::div[1]')
            .locator(this.buttons.TO_CART_REGULAR)
            .waitFor({state: "hidden"});
    }

    /**
     * Returns the number of items found by
     * a search.
     */
    static async getFoundItemsCount(page: Page) :Promise<number | 0>{
        const resultSummary = page
            .locator(this.fullTextResults)
            .locator('div')
            .first();
        await resultSummary.waitFor({state: "visible"});
        const content = await resultSummary.textContent();
        if (content) {
            return Number(content.match(/найдено (\d*) товар/)?.[1]);
        }
        return 0
    }
}
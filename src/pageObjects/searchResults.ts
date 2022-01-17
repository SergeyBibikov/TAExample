import { Page } from '@playwright/test';
import * as assert from 'assert';

export class SearchResults {
    static fullTextResults = '//div[@data-widget="fulltextResultsHeader"]';
    static activeFilters = '//div[@data-widget="searchResultsFiltersActive"]';
    static searchResultsError = '//div[@data-widget="searchResultsError"]';

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

    static async haveActiveFilters(page: Page, expectedFilters: string[]) {
        const activeFilters = await this.getActiveFilters(page);
        const missingFilters: string[] = [];
        for (const filter of expectedFilters) {
            if (!activeFilters.includes(filter)) missingFilters.push(filter);
        }
        if (missingFilters.length > 0) assert.fail(`Missing filters: ${missingFilters}`);
    }

    static async addFilter(page: Page, filterName: string, filterOption: string){
        await page.locator(`//div[contains(text(), "${filterName}")]/parent::div`)
        .locator(`//span[contains(text(),"${filterOption}")]/parent::div/preceding-sibling::div`)
        .click();
    }
}
import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const FILTERS = 'div#filters';
const DELIVERY_TIME_FILTER = '[data-filter-name="fdlvr"]';
const DISCOUNT_FILTER = '[data-filter-name="discount"]';
const I_SEARCH_INPUT = 'input[placeholder="Я ищу..."]'
const RAM_FILTER = '[data-filter-name="f4710"]';
const ROM_FILTER = '[data-filter-name="f4424"]';
const ADDITIONAL_OPTIONS = '[data-filter-name="f61827"]'
const SORT_OPTIONS_BLOCK = 'div#catalog_sorter'
const NO_RESULTS_FOUND = '//p[text()="По Вашему запросу ничего не найдено."]'
const PEOPLE_ALSO_SEARCH = '(//h2[text()="Вместе с этим запросом ищут"])[2]'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_IPHONE_RESULTS);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('"You may also like" link presence', async ({ page }) => {
    await page.waitForSelector('a:has-text("Возможно, Вам понравится")');
});

test('"People also search for" text is present', async ({ page }) => {
    await page.goto(Urls.WB_GIBBERISH_RESULTS);
    await page.waitForSelector(PEOPLE_ALSO_SEARCH);
});

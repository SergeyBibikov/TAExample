import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const FILTERS = 'div#filters'
const DELIVERY_TIME_FILTER = '[data-filter-name="fdlvr"]'
const DISCOUNT_FILTER = '[data-filter-name="discount"]'


test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_IPHONE_RESULTS);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Delivery time filter options', async ({ page }) => {
    const delTimeFilter = page.locator(FILTERS).locator(DELIVERY_TIME_FILTER);

    await expect(delTimeFilter).toContainText('1 день');
    await expect(delTimeFilter).toContainText('2 дня');
    await expect(delTimeFilter).toContainText('до 3 дней');
    await expect(delTimeFilter).toContainText('до 5 дней');
});

test('Discount filter options', async ({ page }) => {
    const delTimeFilter = page.locator(FILTERS).locator(DISCOUNT_FILTER);

    await expect(delTimeFilter).toContainText('от 10% и выше');
    await expect(delTimeFilter).toContainText('от 30% и выше');
    await expect(delTimeFilter).toContainText('от 50% и выше');
});
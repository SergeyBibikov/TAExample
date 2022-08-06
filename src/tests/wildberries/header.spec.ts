import { expect, test } from "@playwright/test";
import Urls from "../../urls";

const SELL_ON_WB = '[data-wba-header-name="Seller"]';
const PHONE_SIGN_IN_CARD = '[data-component="LoginByPhoneView"]'
const COUNTRY_SELECT = PHONE_SIGN_IN_CARD + ' [class*="--select-locale"]'
const PHONE_INPUT = PHONE_SIGN_IN_CARD + ' [class*="input--phone"]'
const GET_SMS_BUTTON = PHONE_SIGN_IN_CARD + '>> button:has-text("To get SMS code")'

test('Sell on Wildberries button click leads to sellers page', async ({ page, context }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(SELL_ON_WB).click();
    const newPage = await context.waitForEvent('page');
    await expect(newPage.locator('body')).toContainText('Collaboration with Wildberries');
});

test.describe('Seller page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(Urls.WB_SELLER_PAGE);
    });
    test('Header info links presence', async ({ page }) => {
        await expect.soft(page.locator('header')).toContainText('About the company');
        await expect.soft(page.locator('header')).toContainText('About the service');
        await expect.soft(page.locator('header')).toContainText('Collaboration');
    });

    test('Phone sign in component elements', async ({ page }) => {
        await page.waitForSelector(PHONE_SIGN_IN_CARD);
        await expect.soft(page.locator(COUNTRY_SELECT)).toHaveCount(1);
        await expect.soft(page.locator(PHONE_INPUT)).toHaveCount(1);
        await expect.soft(page.locator(GET_SMS_BUTTON)).toHaveCount(1);
    });

})
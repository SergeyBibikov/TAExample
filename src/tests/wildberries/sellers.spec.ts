import { expect, test } from "@playwright/test";
import Urls from "../../urls";

const APP_STORE_BUTTON = 'a[href*="https://apps.apple.com/ru/app/wb"]'
const PHONE_SIGN_IN_CARD = '[data-component="LoginByPhoneView"]'
const COUNTRY_SELECT = PHONE_SIGN_IN_CARD + ' [class*="--select-locale"]'
const PHONE_CODES_DROPDOWN = PHONE_SIGN_IN_CARD + ' ul'
const PHONE_INPUT = PHONE_SIGN_IN_CARD + ' [data-find="phone-input"]'
const GET_SMS_BUTTON = PHONE_SIGN_IN_CARD + '>> button:has-text("To get SMS code")'
const GOOGLE_PLAY_BUTTON = 'a[href*="https://play.google.com/store/apps/details?id=com.wildberries.portal"]'
const SELL_ON_WB = '[data-wba-header-name="Seller"]';

//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

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
        await expect.soft(page.locator(PHONE_SIGN_IN_CARD)).toContainText('Country');
        await expect.soft(page.locator(PHONE_SIGN_IN_CARD)).toContainText('Сontact number');
        await expect.soft(page.locator(COUNTRY_SELECT)).toHaveCount(1);
        await expect.soft(page.locator(PHONE_INPUT)).toHaveCount(1);
        await expect.soft(page.locator(GET_SMS_BUTTON)).toHaveCount(1);
    });

    test('App Store and Google Play buttons visibility', async ({ page }) => {
        await expect.soft(page.locator(APP_STORE_BUTTON)).toHaveCount(1);
        await expect.soft(page.locator(GOOGLE_PLAY_BUTTON)).toHaveCount(1);
    });

    test('Send sms btn is blocked when phone is invalid', async ({ page }) => {
        test.slow();
        await page.waitForSelector(PHONE_SIGN_IN_CARD);
        await page.locator(PHONE_INPUT).fill("1");
        await expect.soft(page.locator(GET_SMS_BUTTON)).toHaveAttribute('disabled', '');
        await expect.soft(page.locator(PHONE_SIGN_IN_CARD)).toContainText('The field is filled incorrectly');
    });

    test('Country phone codes dropdown', async ({ page }) => {
        await page.waitForSelector(PHONE_SIGN_IN_CARD);
        await page.locator(COUNTRY_SELECT).click();
        await expect.soft(page.locator(PHONE_CODES_DROPDOWN)).toContainText('+375');
        await expect.soft(page.locator(PHONE_CODES_DROPDOWN)).toContainText('+7');
        await expect.soft(page.locator(PHONE_CODES_DROPDOWN)).toContainText('+996');
        await expect.soft(page.locator(PHONE_CODES_DROPDOWN)).toContainText('+374');
    });
})
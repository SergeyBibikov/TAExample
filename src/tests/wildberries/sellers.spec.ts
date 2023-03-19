import { expect, test } from "@playwright/test";
import Urls from "../../urls";

const PHONE_SIGN_IN_CARD = '[data-component="LoginByPhoneView"]'
const COUNTRY_SELECT = PHONE_SIGN_IN_CARD + ' [class*="--select-locale"]'
const PHONE_INPUT = PHONE_SIGN_IN_CARD + ' [data-find="phone-input"]'
const GET_SMS_BUTTON = PHONE_SIGN_IN_CARD + '>> button:has-text("To get SMS code")'

test('Seller page Phone sign in component elements', async ({ page }) => {
    await page.goto(Urls.WB_SELLER_PAGE);
    await page.waitForSelector(PHONE_SIGN_IN_CARD);
    await expect.soft(page.locator(PHONE_SIGN_IN_CARD)).toContainText('Country');
    await expect.soft(page.locator(PHONE_SIGN_IN_CARD)).toContainText('Сontact number');
    await expect.soft(page.locator(COUNTRY_SELECT)).toHaveCount(1);
    await expect.soft(page.locator(PHONE_INPUT)).toHaveCount(1);
    await expect.soft(page.locator(GET_SMS_BUTTON)).toHaveCount(1);
})
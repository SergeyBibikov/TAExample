import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const CART_ICON = '[data-wba-header-name="Cart"]'
const COUNTRY_SELECTION = '[data-wba-header-name="Country"]'
const COUNTRIES_LIST = '//div[p[text()="Выберите страну"]]'
const CITY_BUTTON = 'span[data-wba-header-name="DLV_Adress"]'
const DELIVERY_MAP = '//div[h2[text()="Выберите адрес доставки"]]'
const SEARCH_BUTTON = 'button[data-wba-header-name="Search_text"]'
const SEARCH_INPUT = 'input[data-wba-header-name="Search_text"]'

//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Location dropdown should include 7 countries', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(COUNTRY_SELECTION).hover();

    const countriesList = page.locator(COUNTRIES_LIST)

    await expect.soft(countriesList).toBeVisible();
    await expect.soft(countriesList).toContainText('Армения');
    await expect.soft(countriesList).toContainText('Беларусь');
    await expect.soft(countriesList).toContainText('Израиль');
    await expect.soft(countriesList).toContainText('Казахстан');
    await expect.soft(countriesList).toContainText('Киргизия');
    await expect.soft(countriesList).toContainText('Узбекистан');
});

test('Map of delivery addresses on city button click', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(CITY_BUTTON).click();
    await page.waitForSelector(DELIVERY_MAP);
});

test('Small viewport header shrinkage', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    
    await expect.soft(page.locator(CART_ICON)).toBeVisible();
    await expect.soft(page.locator(WbLocators.WORK_AT_WB_BUTTON)).toBeVisible();
    await expect.soft(page.locator(SEARCH_BUTTON)).not.toBeVisible();
    await expect.soft(page.locator(SEARCH_INPUT)).toBeVisible();

    await page.setViewportSize({width: 800, height: 600});

    await expect.soft(page.locator(CART_ICON)).not.toBeVisible();
    await expect.soft(page.locator(WbLocators.WORK_AT_WB_BUTTON)).not.toBeVisible();
    await expect.soft(page.locator(SEARCH_BUTTON)).toBeVisible();
    await expect.soft(page.locator(SEARCH_INPUT)).not.toBeVisible();
});
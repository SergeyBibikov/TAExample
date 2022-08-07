import { expect, Page, Locator, test } from "@playwright/test";
import Urls from "../../urls";

const COUNTRY_SELECTION = '[data-wba-header-name="Country"]'
const COUNTRIES_LIST = '//div[p[text()="Выберите страну"]]'
const CITY_BUTTON = 'span[data-wba-header-name="DLV_Adress"]'
const DELIVERY_MAP = '//div[h2[text()="Выберите адрес доставки"]]'

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


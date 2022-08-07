import { expect, Page, Locator, test } from "@playwright/test";
import Urls from "../../urls";

const COUNTRY_SELECTION = '[data-wba-header-name="Country"]'
const COUNTRIES_LIST = '//div[p[text()="Выберите страну"]]'

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
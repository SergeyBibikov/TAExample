import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const DELIVERY_INFO_CONTENT = '.delivery-banner-content'

test('Delivery terms', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(WbLocators.DELIVERY_INFO_BUTTON).click();
    const info = page.locator(DELIVERY_INFO_CONTENT);

    await expect.soft(info).toContainText('Бесплатная доставка');
    await expect.soft(info).toContainText('Доставка круглый год по всей России');
    await expect.soft(info).toContainText('Возврат товара при примерке');
});
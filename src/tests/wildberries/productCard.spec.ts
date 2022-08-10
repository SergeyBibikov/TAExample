import { expect, test } from "@playwright/test";
import Urls from "../../urls";

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_PRODUCT_CARD);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})
//TODO: implement
test('Size validation on adding to cart', async ({ page }) => {

});
//TODO: implement
test('Product added to cart => Counter incresed, "add to cart" button text changed', async ({ page }) => {

});
//TODO: implement
test('Similar products lead', async ({ page }) => {

});
//TODO: implement
test('Ad section presence', async ({ page }) => {

});
//TODO: implement
test('Recently viewed products section presence', async ({ page }) => {

});
//TODO: implement
test('See all reviews button presence', async ({ page }) => {

});
//TODO: implement
test('Report a review button', async ({ page }) => {

});
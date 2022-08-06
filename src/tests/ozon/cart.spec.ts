import { expect, test } from '@playwright/test';

import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';
import { Cart } from '../../pageObjects/cart';
import { SearchResults } from '../../pageObjects/searchResults';


test.beforeAll((async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await Homepage.open(page);
    await Header.searchProduct(page, Cart.productName);
    await SearchResults.addItemToReqularCart(page, Cart.productFullName);
    await context.storageState({ path: Cart.fileName });
}));

test('Unauthorized user. Proceed to checkout', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await Homepage.open(page);
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.goToCheckout(page);
    await expect(page.frameLocator('iframe#authFrame').locator('[data-widget="loginOrRegistration"]'))
        .toContainText('Введите свой номер телефона, чтобы войти');
});
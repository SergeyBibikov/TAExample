import { expect, Page, test } from '@playwright/test';
import * as assert from 'assert';

import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { Cart } from '../pageObjects/cart';
import { SearchResults } from '../pageObjects/searchResults';


const openCachedCart = async (page: Page) => {
    await Homepage.open(page);
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
}

test.beforeAll((async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await Homepage.open(page);
    await Header.searchProduct(page, Cart.productName);
    await SearchResults.addItemToReqularCart(page, Cart.productFullName);
    await context.storageState({ path: Cart.fileName });
}));

test('Empty cart. B2B ad popup', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToCart(page);
    await expect(page.locator(Cart.B2B_POPUP)).toContainText('Подробнее о покупках для юридических лиц');
    await Cart.closeB2BPopup(page);
    await expect(page.locator('//html')).toContainText('Корзина пуста');
});

test('Cart item count', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await Homepage.open(page);
    const cartItemsCount = await Header.getCartItemsCount(page);
    assert.equal(cartItemsCount, 1);
});

test('Delete item from cart', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await Homepage.open(page);
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.deleteSelectedItems(page);
    expect(page.locator(Cart.CONFIRM_DELETION_POPUP)).toContainText('Вы точно хотите удалит');
    await Cart.confirmItemsDeletion(page);
    await expect(page.locator('body')).toContainText("Корзина пуста")
});

test('Add item to express cart', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, Cart.productName);
    await SearchResults.addItemToExpressCart(page, Cart.productFullName);
    const addressPopup = page.locator('[data-widget="addressPopup"]');
    await expect(addressPopup).toHaveCount(1);
    await expect(addressPopup).toContainText("Уточнение адреса");
});

test('Cart total on quantity change', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCachedCart(page);
    const initialTotal = Number(await Cart.getTotal(page));
    await Cart.setQuantity(page, '2');
    const totalAfterIncrease = Number(await Cart.getTotal(page));
    assert.equal(totalAfterIncrease, initialTotal * 2);
    await Cart.setQuantity(page, '1');
    const totalAfterDecrease = Number(await Cart.getTotal(page));
    assert.equal(totalAfterDecrease, initialTotal);
});
test('Bonus points info block', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCachedCart(page);
    const bonusPointsBlock = page.locator('[data-widget="totalScoresWeb"]');
    await expect(bonusPointsBlock).toHaveCount(1);
    await expect(bonusPointsBlock).toContainText(/Получите до .* балл/);
});

test('10+ items select to input change', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCachedCart(page);
    await expect(page.locator('input[type="number"]')).toHaveCount(0);
    await Cart.setQuantity(page, '10+');
    await expect(page.locator('input[type="number"]')).toHaveCount(1);
});



test('Unauthorized user. Proceed to checkout', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await Homepage.open(page);
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.goToCheckout(page);
    await expect(page.frameLocator('iframe#authFrame').locator('[data-widget="loginOrRegistration"]'))
        .toContainText('Введите свой номер телефона, чтобы войти');
});
import { expect, test } from '@playwright/test';
import * as assert from 'assert';

import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { Cart } from '../pageObjects/cart';
import { SearchResults } from '../pageObjects/searchResults';

test('Empty cart. B2B ad popup', async ({ page }) => {
    await Homepage.open(page);
    await Header.goToCart(page);
    await expect(page.locator(Cart.B2B_POPUP)).toContainText('Подробнее о покупках для юридических лиц');
    await Cart.closeB2BPopup(page);
    await expect(page.locator('//html')).toContainText('Корзина пуста');
});

test('Add item to cart and delete it', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToReqularCart(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    const cartItemsCount = await Header.getCartItemsCount(page);
    assert.equal(cartItemsCount, 1);
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.deleteSelectedItems(page);
    expect(page.locator(Cart.CONFIRM_DELETION_POPUP)).toContainText('Вы точно хотите удалить выбранные товары?');
    await Cart.confirmItemsDeletion(page);
    await expect(page.locator('body')).toContainText("Корзина пуста")
});

test('Unauthorized user. Proceed to checkout', async ({ page }) => {
    await Homepage.open(page);
    await Header.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToReqularCart(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    await Header.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.goToCheckout(page);
    await expect(page.frameLocator('iframe#authFrame').locator('[data-widget="loginOrRegistration"]'))
        .toContainText('Войдите или зарегистрируйтесь, чтобы продолжить');
});
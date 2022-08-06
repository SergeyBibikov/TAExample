import { expect, Page, test } from '@playwright/test';
import * as assert from 'assert';

import { Header } from '../../pageObjects/header';
import { Homepage } from '../../pageObjects/homepage';
import { Cart } from '../../pageObjects/cart';
import { SearchResults } from '../../pageObjects/searchResults';


const openCartFromHomepage = async (page: Page) => {
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

test('Add cart item to favourites', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    await page.locator('//span[text()="B избранное"]').click();
    await page.waitForResponse('https://www.ozon.ru/api/composer-api.bx/_action/favoriteBatchAddItems');
    assert.equal(await Header.getFavouriteItemsCount(page), 1);
    await expect(page.locator('//span[text()="B избранном"]')).toHaveCount(1);
});

test('Bonus points info block', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    const bonusPointsBlock = page.locator('[data-widget="totalScoresWeb"]');
    await expect(bonusPointsBlock).toHaveCount(1);
    await expect(bonusPointsBlock).toContainText(/Получите до .* балл/);
});

test('10+ items select to input change', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    await expect(page.locator('input[type="number"]')).toHaveCount(0);
    await Cart.setQuantity(page, '10+');
    await expect(page.locator('input[type="number"]')).toHaveCount(1);
});

test('Checkout button disabled with no items selected', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    await expect(page.locator(Cart.GO_TO_CHECKOUT)).not.toHaveAttribute('disabled', 'disabled');
    await page.locator('//*[@data-widget="split"]//input[@type="checkbox"]/following-sibling::div').click();
    await expect(page.locator(Cart.GO_TO_CHECKOUT)).toHaveAttribute('disabled', 'disabled');
});

test('"Delete selected" button hides when no items are selected', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    await expect(page.locator('text=Удалить выбранные')).toHaveCount(1);
    await page.locator('//*[@data-widget="split"]//input[@type="checkbox"]/following-sibling::div').click();
    await expect(page.locator('text=Удалить выбранные')).toHaveCount(0);
});

test('Protecting glass is recommended when a phone is in the cart', async ({ browser }) => {
    const page = await Cart.getPageWithContext(browser);
    await openCartFromHomepage(page);
    await expect(page.locator(Cart.RECOMMEND_SECTION)).toContainText('стекло');
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
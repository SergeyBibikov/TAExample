import { expect, test} from '@playwright/test';
import * as assert from 'assert';

import * as compare from "../helpers/comparison";
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { Cart } from '../pageObjects/cart';
import { SearchResults } from '../pageObjects/searchResults';

test("Top bar links list", async ({ page }) => {
    const expectedLinks = [
        'Ozon для бизнеса',
        'Мобильное приложение',
        'Подарочные сертификаты',
        'Реферальная программа',
        'Зарабатывай с Ozon',
        'Помощь',
        'Пункты выдачи'
    ];
    
    await Homepage.open(page);
    const presentLinks = await Homepage.getTopBarLinks(page);
    const diff = compare.getMissingArrayElements(presentLinks, expectedLinks);
    if (diff) {
        assert.fail(`The following links are missing: ${diff}`);
    }
});

test('Header navigation links list', async ({ page }) => {
    const expectedLinks = [
        'TOP Fashion',    'Premium',
        'Ozon Travel',    'Ozon Express',
        'Ozon Счёт',      'LIVE',
        'Бренды',
        'Магазины',       'Электроника',
        'Одежда и обувь', 'Детские товары',
        'Дом и сад',      'Зона лучших цен'
      ]

    await Homepage.open(page);
    const presentLinks = await Header.getNavBarLinks(page);
    const diff = compare.getMissingArrayElements(presentLinks, expectedLinks);
    if (diff) {
        assert.fail(`The following links are missing: ${diff}`);
    }
});

test('Empty cart. B2B ad popup', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.goToCart(page);
    await expect(page.locator(Cart.B2B_POPUP)).toContainText('Подробнее о покупках для юридических лиц');
    await Cart.closeB2BPopup(page);
    await expect(page.locator('//html')).toContainText('Корзина пуста');
});

test('Add item to cart and delete it', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.searchProduct(page, 'Iphone 13 128GB');
    await SearchResults.addItemToReqularCart(page, 'Смартфон Apple iPhone 13 128GB, темная ночь');
    const cartItemsCount = await Header.getCartItemsCount(page);
    assert.equal(cartItemsCount, 1);
    await Homepage.goToCart(page);
    await Cart.closeB2BPopup(page);
    await Cart.deleteSelectedItems(page);
    expect(page.locator(Cart.CONFIRM_DELETION_POPUP)).toContainText('Вы точно хотите удалить выбранные товары?');
    await Cart.confirmItemsDeletion(page);
    await expect(page.locator('body')).toContainText("Корзина пуста")
});


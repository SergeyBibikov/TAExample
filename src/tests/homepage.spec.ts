import { expect, test} from '@playwright/test';
import * as assert from 'assert';

import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { Cart } from '../pageObjects/cart';

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
    assert.deepStrictEqual(presentLinks.sort(), expectedLinks.sort());
});

test('Header navigation links list', async ({ page }) => {
    const expectedLinks = [
        'TOP Fashion',    'Premium',
        'Ozon Travel',    'Ozon Express',
        'Ozon Счёт',      'LIVE',
        'Акции',          'Бренды',
        'Магазины',       'Электроника',
        'Одежда и обувь', 'Детские товары',
        'Дом и сад',      'Зона лучших цен'
      ]

    await Homepage.open(page);
    const presentLinks = await Header.getNavBarLinks(page);
    assert.deepStrictEqual(presentLinks.sort(), expectedLinks.sort());
});

test('Empty cart. B2B ad popup', async ({ page }) => {
    await Homepage.open(page);
    await Homepage.goToCart(page);
    await expect(page.locator(Cart.B2B_POPUP)).toContainText('Подробнее о покупках для юридических лиц');
    await Cart.closeB2BPopup(page);
    await expect(page.locator('//html')).toContainText('Корзина пуста');
});
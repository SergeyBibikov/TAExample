import { expect, test } from '@playwright/test';
import * as assert from 'assert';

import * as compare from "../helpers/comparison";
import { Header } from '../pageObjects/header';
import { Footer } from '../pageObjects/footer';
import { Homepage } from '../pageObjects/homepage';
import { Cart } from '../pageObjects/cart';
import { SearchResults } from '../pageObjects/searchResults';


test.describe('Top bar links', () =>{

    test("Links list", async ({ page }) => {
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
    
    test('Ozon for business', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Ozon для бизнеса');
        await expect(page.locator('body')).toContainText('Покупайте как юридическое лицо');
    });
    
    test('Mobile app', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Мобильное приложение');
        await expect(page.locator('#apps')).toContainText('OZON ещё лучше в приложении');
    });
    
    test('Referral program', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Реферальная программа');
        await expect(page.locator('body')).toContainText('получить 300 баллов на первый заказ или доступ к закрытым предложениям');
    });
    
    test('Earn with Ozon', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Зарабатывай с Ozon');
        await expect(page.locator('//a[text()="Хочу зарабатывать"]')).toHaveCount(1);
    });

    test('Gift certificate', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Подарочные сертификаты');
        await expect(page.locator('//div[@data-widget="webProductHeading"]')).toContainText('Электронный подарочный сертификат');
    });
    test('Help', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Помощь');
        await expect(page.locator('//h3')).toHaveCount(8);
        const mainContent = page.locator('div.book-columns');
        await expect(mainContent).toContainText("Мой заказ");
        await expect(mainContent).toContainText("Отмена и возврат");
        await expect(mainContent).toContainText("Доставка");
        await expect(mainContent).toContainText("Оплата");
        await expect(mainContent).toContainText("Товары");
        await expect(mainContent).toContainText("Акции и бонусы");
        await expect(mainContent).toContainText("Безопасность");
        await expect(mainContent).toContainText("Вопросы по билетам");
    });

    test('Pick points', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Пункты выдачи');
        await expect(page.locator('body')).toContainText("Выбор пункта выдачи");
    });

});

test('Header navigation links list', async ({ page }) => {
    const expectedLinks = [
        'TOP Fashion', 'Premium',
        'Ozon Travel', 'Ozon Express',
        'Ozon Счёт', 'LIVE',
        'Бренды',
        'Магазины', 'Электроника',
        'Одежда и обувь', 'Детские товары',
        'Дом и сад', 'Зона лучших цен'
    ]

    await Homepage.open(page);
    const presentLinks = await Header.getNavBarLinks(page);
    const diff = compare.getMissingArrayElements(presentLinks, expectedLinks);
    if (diff) {
        assert.fail(`The following links are missing: ${diff}`);
    }
});

test('Footer accessibility button', async ({ page }) => {
    await Homepage.open(page);
    await expect(page.locator(Footer.locators.VER_FOR_VIS_IMPARED)).toHaveCount(1);
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



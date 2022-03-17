import { expect, test } from '@playwright/test';
import * as assert from 'assert';

import * as compare from "../helpers/comparison";
import { Header } from '../pageObjects/header';
import { Footer } from '../pageObjects/footer';
import { Homepage } from '../pageObjects/homepage';

test.describe('Top bar links', () => {

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
    test('Help on hover', async ({ page }) => {
        await Homepage.open(page);
        await page.hover('text=Помощь');
        const helpPopup = page.locator('//*[text()="Статус заказа"]/../..');
        await expect(helpPopup.locator('a')).toHaveCount(8);
    });
    test('Help link', async ({ page }) => {
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

test('Promo code', async ({ page }) => {
    const expectedColor = 'rgb(249, 17, 85)';
    const getBorderColor = async () => {
        return await page.evaluate(() => {
            const di = document.querySelector("[data-widget='promoNavigation']>div>div");
            if (di) {
                return document.defaultView?.getComputedStyle(di).borderColor || "";
            } else {
                return "Not found"
            }
        });
    }

    await Homepage.open(page);
    const promo = page.locator('[data-widget="promoNavigation"]');
    await expect(promo).toContainText('Есть промокод?');
    const promoInput = promo.locator('input[type="text"]');
    await expect(promoInput).toHaveCount(1);
    const promoButton = promo.locator('button');
    await expect(promoButton).toHaveCount(1);
    await promoButton.click();
    await page.waitForTimeout(1000);
    const color = await getBorderColor();
    assert.equal(color, expectedColor);
    await promoInput.fill('44');
    await promoButton.click();
    await expect(page.locator('body')).toContainText('Вы не авторизованы');
});

test('Sign in or register button', async ({ page }) => {
    await Homepage.open(page);
    const auth = page.locator('[data-widget="authorization"]');
    await expect(auth).toContainText('Вход');
    const signInButton = auth.locator('//button[contains(.,"Вход или регистрация")]');
    await expect(signInButton).toHaveCount(1);
    await signInButton.click();
    const ozonIdIframe = page.locator('[data-widget="ozonIdIframe"]').frameLocator('iframe');
    await ozonIdIframe.locator('text=Войти по почте').click();
    await expect(ozonIdIframe.locator('body')).toContainText("Войдите по почте");
    await expect(ozonIdIframe.locator('body')).toContainText("Только для зарегистрированных пользователей");
});

test.describe('Header', () => {
    test('Navigation links list', async ({ page }) => {
        const expectedLinks = [
            'TOP Fashion', 'Premium',
            'Ozon Travel', 'Ozon fresh',
            'Ozon Счёт', 'LIVE',
            'Бренды',
            'Магазины', 'Электроника',
            'Одежда и обувь', 'Детские товары',
            'Дом и сад'
        ]

        await Homepage.open(page);
        const presentLinks = await Header.getNavBarLinks(page);
        const diff = compare.getMissingArrayElements(presentLinks, expectedLinks);
        if (diff) {
            assert.fail(`The following links are missing: ${diff}`);
        }
    });

    test('Sign in on hover. Pop-up', async ({ page }) => {
        await Homepage.open(page);
        await page.hover(Header.SIGN_IN);
        await expect(page.locator('//button[contains(. , "Войти или зарегистрироваться")]')).toHaveCount(1);
        await expect(page.locator('//button[contains(. , "Личный кабинет")]')).toHaveCount(1);
    });

    test('Sign in on click. Ozonid card', async ({ page }) => {
        const ozonId = page.locator('[data-widget="ozonIdIframe"]');
        const ozonIdIframe = ozonId.frameLocator('iframe');
        const frameBody = ozonIdIframe.locator('body');
        const getCodeButton = ozonIdIframe.locator('//button[contains(., "Получить код")]');
        const phoneInput = ozonIdIframe.locator('input[name="phone"]');


        await Homepage.open(page);
        await page.locator(Header.SIGN_IN).click();
        await expect(ozonId).toHaveCount(1);
        await expect(frameBody).toContainText('Войдите или зарегистрируйтесь, чтобы продолжить');
        await expect(phoneInput).toHaveCount(1);
        await expect(getCodeButton).toHaveCount(1);
        await expect(ozonIdIframe.locator('//a[text()="Войти по почте"]')).toHaveCount(1);
        await phoneInput.fill("33");
        await getCodeButton.click();
        await expect(frameBody).toContainText("Некорректный формат телефона");
    });

    test('Go to orders while not being signed in', async ({ page }) => {
        await Homepage.open(page);
        await Header.goToOrders(page);
        await expect(page.locator('//div[contains(text(), "Вы не авторизованы")]')).toHaveCount(1);
        await expect(page.locator('//*[@data-widget="loginButton"]')).toHaveCount(1);
    });
    test('Go to Favourites when there are no items ', async ({ page }) => {
        await Homepage.open(page);
        await Header.goToFavourites(page);
        await expect(page.locator('//div[contains(text(),"Избранное")]')).toHaveCount(1);
        await expect(page.locator('//span[text()="В Избранном пока ничего нет"]')).toHaveCount(1);
        await expect(page.locator('//span[contains(text(),"Сравнение товаров")]')).toHaveCount(1);
        await expect(page.locator('//span[contains(text(),"Избранные магазины")]')).toHaveCount(1);
        await expect(page.locator('//span[contains(text(),"Моя коллекция")]')).toHaveCount(1);
    });
});

test.describe('Favourites',() => {
    test('Empty comparison', async ({ page }) => {
        await Homepage.open(page);
        await Header.goToFavourites(page);
        await page.locator('text=Сравнение товаров').click();
        await expect(page.locator('div[data-widget="container"]')).toContainText('В сравнении пока ничего нет');
        await expect(page.locator('//a[contains(text(),"Перейдите к каталогу товаров")]')).toHaveCount(1);
    });
    test('Favourite shops', async ({ page }) => {
        await Homepage.open(page);
        await Header.goToFavourites(page);
        await page.locator('text=Избранные магазины').click();
        await expect(page.locator('div[data-widget="myGuest"]')).toContainText('Вы не авторизованы');
    });
    test('My collection', async ({ page }) => {
        await Homepage.open(page);
        await Header.goToFavourites(page);
        await page.locator('text=Моя коллекция').click();
        await expect(page.locator('section[data-widget="emptyState"]')).toContainText('Коллекция пуста');
    });
});

test('Catalogue. Filters change on hover', async ({ page }) => {
    await Homepage.open(page);
    await Header.openCatalogue(page);
    await page.hover(Header.CATALOGUE_CATEGORIES + '//a[span[text()="Обувь"]]');
    await expect(page.locator(Header.CATALOGUE_FILTERS)).toContainText('Босоножки');
    await page.hover(Header.CATALOGUE_CATEGORIES + '//a[span[text()="Электроника"]]');
    await expect(page.locator(Header.CATALOGUE_FILTERS)).toContainText('Моноблоки');
});

test.describe('Footer', () => {
    test('Accessibility version button', async ({ page }) => {
        await Homepage.open(page);
        await expect(page.locator(Footer.locators.VER_FOR_VIS_IMPARED)).toHaveCount(1);
    });

    test('Misc info links', async ({ page }) => {
        await Homepage.open(page);
        const infoLinksSection = page.locator(Footer.locators.INFO_LINKS_SECTION);
        await expect(infoLinksSection.locator('xpath=/div')).toHaveCount(5);
        await expect(infoLinksSection.locator('xpath=/div[1]/span')).toHaveText('Зарабатывайте с Ozon');
        await expect(infoLinksSection.locator('xpath=/div[2]/span')).toHaveText('О компании');
        await expect(infoLinksSection.locator('xpath=/div[3]/span')).toHaveText('Помощь');
        await expect(infoLinksSection.locator('xpath=/div[4]/span')).toHaveText('Ozon для бизнеса');
    });

    test('Ozon ecosystem links', async ({ page }) => {
        await Homepage.open(page);
        const ecoSection = page.locator(Footer.locators.ECOSYSTEM_SECTION);
        await expect(ecoSection.locator('a')).toHaveCount(5);
        await expect(ecoSection).toContainText('Интернет-магазин');
        await expect(ecoSection).toContainText('Работа в Ozon');
        await expect(ecoSection).toContainText('Авиабилеты');
        await expect(ecoSection).toContainText('Бесплатные IT курсы');
        await expect(ecoSection).toContainText('Электронные книги');
    });
});

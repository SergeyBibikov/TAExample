import { expect, Page, test } from '@playwright/test';
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
            'Продавайте на Ozon',
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
    test.describe('Mobile app', () => {
        test('Navigate from homepage', async ({ page }) => {
            await Homepage.open(page);
            await Homepage.clickTopBarLink(page, 'Мобильное приложение');
            await expect(page.locator('#apps')).toContainText('OZON ещё лучше в приложении');
        });
        test('App store link', async ({ page, context }) => {
            await page.goto('https://www.ozon.ru/info/appspromo/');
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.locator('//a[contains(@href, "itunes")]')
                    .first()
                    .click()
            ])
            await newPage.waitForLoadState();
            await expect(newPage.locator('nav#localnav')).toContainText('App Store');
            await expect(newPage.locator('section[class*="product-her"]'))
                .toContainText('OZON: товары, билеты, продукты ');
        });
        test('AppGallery link', async ({ page, context }) => {
            await page.goto('https://www.ozon.ru/info/appspromo/');
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                page.locator('//a[contains(@href, "appgallery")]')
                    .first()
                    .click()
            ])
            await newPage.waitForLoadState();
            await expect(newPage.locator('.headerContainer')).toContainText('AppGallery');
            await expect(newPage.locator('.detailheadcard'))
                .toContainText('OZON: товары, авиа');
        });
    })
    test('Sell on Ozon', async ({ page }) => {
        await Homepage.open(page);
        await Homepage.clickTopBarLink(page, 'Продавайте на Ozon');
        await expect(page.locator('body')).toContainText('Любому бизнесу найдётся место на Ozon');
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
        await expect(ozonIdIframe.locator('//a[span[contains(., "Вход с Apple")]]')).toHaveCount(1);
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
test.describe('Header links correct leads', () => {
    const checkPageLoad = async (p: Page, link: string, textToExpect: string) => {
        await Homepage.open(p);
        await Header.goToNavbarLink(p, link);
        await expect(p.locator('body')).toContainText(textToExpect);
    }
    //TODO:add all links tests
    //TODO: return travel link check when the text is stable
    test('Links list', async ({ page }) => {
        const expectedLinks = [
            'TOP Fashion', 'Premium',
            'Ozon fresh',
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
    test('TOP Fashion', async ({ page }) => {
        await checkPageLoad(page, 'TOP Fashion', 'TOP Fashion');
    });
    test('Premium', async ({ page }) => {
        await checkPageLoad(
            page,
            'Premium',
            'Подписка на кешбэк, бесплатную доставку, кино, курсы и ранний доступ к распродажам'
        );
    });
    test('Ozon Счёт', async ({ page }) => {
        await checkPageLoad(
            page,
            'Ozon Счёт',
            'Открыть Ozon Счёт'
        );
    });
    test('Акции', async ({ page }) => {
        await checkPageLoad(
            page,
            'Акции',
            'Выгодные предложения'
        );
    });
    test('Бренды', async ({ page }) => {
        await checkPageLoad(
            page,
            'Бренды',
            'Популярные бренды'
        );
    });
})
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

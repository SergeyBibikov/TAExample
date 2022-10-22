import { expect, Page, test } from '@playwright/test';
import * as assert from 'assert';

import * as compare from "../../helpers/comparison";
import { Header } from '../../pageObjects/header';
import { Footer } from '../../pageObjects/footer';
import { Homepage } from '../../pageObjects/homepage';

test.describe('Top bar links', () => {

    test("Links list", async ({ page }) => {
        const expectedLinks = [
            'Ozon для бизнеса',
            'Мобильное приложение',
            'Подарочные сертификаты',
            'Продавайте на Ozon',
            'Помощь',
            'Реферальная программа',
        ];

        await Homepage.open(page);
        const presentLinks = await Homepage.getTopBarLinks(page);
        const diff = compare.getMissingArrayElements(presentLinks, expectedLinks);
        if (diff) {
            assert.fail(`The following links are missing: ${diff}`);
        }
    });

    test('Help on hover', async ({ page }) => {
        await Homepage.open(page);
        await page.hover('text=Помощь');
        const helpPopup = page.locator('//*[text()="Статус заказа"]/../../..');
        await expect(helpPopup.locator('a')).toHaveCount(8);
    });

});

test.describe('Sign in from header', () => {
    test('Sign in button on hover. Pop-up', async ({ page }) => {
        await Homepage.open(page);
        await page.hover(Header.SIGN_IN);
        await page.waitForSelector('//button[contains(. , "Войти или зарегистрироваться")]');
        await page.waitForSelector('//button[contains(. , "Личный кабинет")]');
    });
});

test.describe('Header links', () => {
    const checkPageLoad = async (p: Page, link: string, textToExpect: string) => {
        await Homepage.open(p);
        await Header.goToNavbarLink(p, link);
        await expect(p.locator('body')).toContainText(textToExpect);
    }

    test('Links list', async ({ page }) => {
        const expectedLinks = [
            'Premium',
            'Ozon Карта', 'Рассрочка',
            'Акции',
            'Бренды',
            'Express',
            'Электроника',
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
})


test.describe('Footer', () => {
    test('Accessibility version button', async ({ page }) => {
        await Homepage.open(page);
        await expect(page.locator(Footer.locators.VER_FOR_VIS_IMPARED)).toHaveCount(1);
    });

    test('Misc info links', async ({ page }) => {
        await Homepage.open(page);
        const infoLinksSection = page.locator(Footer.locators.INFO_LINKS_SECTION);
        await expect.soft(infoLinksSection.locator('xpath=/div')).toHaveCount(4);
        await expect.soft(infoLinksSection.locator('xpath=/div[1]/span')).toHaveText('Ozon интернет-магазин');
        await expect.soft(infoLinksSection.locator('xpath=/div[2]/span')).toHaveText('Зарабатывайте с Ozon');
        await expect.soft(infoLinksSection.locator('xpath=/div[3]/span')).toHaveText('Покупайте как компания');
        await expect.soft(infoLinksSection.locator('xpath=/div[4]/span')).toHaveText('Помощь');
    });

    test('Ozon job list', async ({ page }) => {
        await Homepage.open(page);
        const jobSection = page.locator(Footer.locators.JOBS_SECTION);
        await expect.soft(jobSection.locator('a')).toHaveCount(9);
        await expect.soft(jobSection).toContainText('IT');
        await expect.soft(jobSection).toContainText('Офис');
        await expect.soft(jobSection).toContainText('Финтех');
        await expect.soft(jobSection).toContainText('Фулфилмент');
        await expect.soft(jobSection).toContainText('Fresh');
        await expect.soft(jobSection).toContainText('Логистика');
        await expect.soft(jobSection).toContainText('Стажировки');
        await expect.soft(jobSection).toContainText('События');
    });
});

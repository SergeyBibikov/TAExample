import { expect, Page, test } from '@playwright/test';
import * as assert from 'assert';

import * as compare from "../../helpers/comparison";
import { Header } from '../../pageObjects/header';
import { Footer } from '../../pageObjects/footer';
import { Homepage } from '../../pageObjects/homepage';

test.describe('Top bar links', () => {

    test("Links list", async ({ page }) => {
        const expectedLinks = [
            'Мобильное приложение',
            'Подарочные сертификаты',
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
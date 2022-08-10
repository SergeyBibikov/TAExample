import { test } from '@playwright/test';

import { Homepage } from '../../pageObjects/homepage';
import { Header } from '../../pageObjects/header';

test.skip('Unsuccessful search', async ({ page }) => {
    const searchString = 'sdfsdf23sdfsdf';
    await Homepage.open(page);
    await Header.searchProduct(page, searchString);
    await page.waitForSelector('//div[contains(text(),"Простите, по вашему запросу товаров сейчас нет.")]', { timeout: 5000 });
});
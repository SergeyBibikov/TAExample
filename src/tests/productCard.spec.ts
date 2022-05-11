import { test, expect } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { SearchResults } from '../pageObjects/searchResults';


test('All main sections must be displayed', async ({ page }) => {
    const searchItem = 'чехол iphone se 2020';

    await Homepage.open(page);
    await Header.searchProduct(page, searchItem);
    await SearchResults.openFirstFoundItem(page);
    await expect(page.locator('#layoutPage')).toContainText('Фото и видео покупателей');
    await expect(page.locator('#layoutPage')).toContainText('Рекомендуем также');
    await expect(page.locator('#layoutPage')).toContainText('Покупают вместе');
    await expect(page.locator('#layoutPage')).toContainText('Спонсорские товары');
    await expect(page.locator('#layoutPage')).toContainText('Характеристики');
    await expect(page.locator('#layoutPage')).toContainText('Подборки товаров');
    await expect(page.locator('#layoutPage')).toContainText('Отзывы и вопросы о товаре');
});

test('Scroll to description', async ({ page }) => {
    const getOffset = async () => {
        return await page.evaluate(() => {
            return window.scrollY
        });
    }

    const searchItem = 'чехол iphone se 2020';

    await Homepage.open(page);
    await Header.searchProduct(page, searchItem);
    await SearchResults.openFirstFoundItem(page);

    await page.waitForLoadState();
    await page.locator('text=Перейти к описанию').click();

    let offsetAfterScroll = await getOffset();
    while (true) {
        const currentOffset = await getOffset();
        if (currentOffset === offsetAfterScroll) {
            break;
        }
        offsetAfterScroll = currentOffset;
    }

    expect(offsetAfterScroll).toBeGreaterThan(2000);
}); 
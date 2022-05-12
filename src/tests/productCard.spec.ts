import { test, expect, Page } from '@playwright/test';
import { Header } from '../pageObjects/header';
import { Homepage } from '../pageObjects/homepage';
import { ProductCard } from '../pageObjects/productCard';
import { SearchResults } from '../pageObjects/searchResults';

const openCardPage = async (page: Page) => {
    const searchItem = 'чехол iphone se 2020';

    await Homepage.open(page);
    await Header.searchProduct(page, searchItem);
    await SearchResults.openFirstFoundItem(page);
}

test('All main sections must be displayed', async ({ page }) => {

    await openCardPage(page);

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

    await openCardPage(page);

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

test('Add to comparison', async ({ page }) => {

    const productHeaderSection = page.locator(ProductCard.nameSection);

    await openCardPage(page);
    await expect(productHeaderSection).toContainText('Добавить к сравнению');
    await productHeaderSection.locator('text=Добавить к сравнению').click();
    await expect(productHeaderSection).not.toContainText('Добавить к сравнению');
    await expect(productHeaderSection).toContainText('Перейти в сравнение');
});
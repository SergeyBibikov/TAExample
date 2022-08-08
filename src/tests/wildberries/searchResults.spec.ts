import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const FILTERS = 'div#filters';
const DELIVERY_TIME_FILTER = '[data-filter-name="fdlvr"]';
const DISCOUNT_FILTER = '[data-filter-name="discount"]';
const RAM_FILTER = '[data-filter-name="f4710"]';
const ROM_FILTER = '[data-filter-name="f4424"]';
const SORT_OPTIONS_BLOCK = 'div#catalog_sorter'


test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_IPHONE_RESULTS);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Iphone results filters list', async ({ page }) => {
    const filters = page.locator(FILTERS);

    await expect.soft(filters).toContainText('Срок доставки');
    await expect.soft(filters).toContainText('Продавец');
    await expect.soft(filters).toContainText('Цена');
    await expect.soft(filters).toContainText('Скидка');
    await expect.soft(filters).toContainText('Цвет');
    await expect.soft(filters).toContainText('Операционная система');
    await expect.soft(filters).toContainText('Версия операционной системы');
    await expect.soft(filters).toContainText('Диагональ экрана');
    await expect.soft(filters).toContainText('Модель');
    await expect.soft(filters).toContainText('Количество SIM карт');
    await expect.soft(filters).toContainText('Беспроводные интерфейсы');
    await expect.soft(filters).toContainText('Объем встроенной памяти');
    await expect.soft(filters).toContainText('Объем оперативной памяти');
    await expect.soft(filters).toContainText('Процессор');
    await expect.soft(filters).toContainText('Разрешение экрана');
    await expect.soft(filters).toContainText('Спутниковая навигация');
    await expect.soft(filters).toContainText('Стандарт связи');
});

test('Delivery time filter options', async ({ page }) => {
    const delTimeFilter = page.locator(FILTERS).locator(DELIVERY_TIME_FILTER);

    await expect.soft(delTimeFilter).toContainText('1 день');
    await expect.soft(delTimeFilter).toContainText('2 дня');
    await expect.soft(delTimeFilter).toContainText('до 3 дней');
    await expect.soft(delTimeFilter).toContainText('до 5 дней');
});

test('Discount filter options', async ({ page }) => {
    const discountFilter = page.locator(FILTERS).locator(DISCOUNT_FILTER);

    await expect.soft(discountFilter).toContainText('от 10% и выше');
    await expect.soft(discountFilter).toContainText('от 30% и выше');
    await expect.soft(discountFilter).toContainText('от 50% и выше');
});

test('RAM filter options', async ({ page }) => {
    const ramFilter = page.locator(FILTERS).locator(RAM_FILTER);

    await expect.soft(ramFilter).toContainText('4 ГБ');
    await expect.soft(ramFilter).toContainText('6 ГБ');
});

test('ROM filter options', async ({ page }) => {
    const romFilter = page.locator(FILTERS).locator(ROM_FILTER);

    await expect.soft(romFilter).toContainText('128 ГБ');
    await expect.soft(romFilter).toContainText('256 ГБ');
});

test('"You may also like" link presence', async ({ page }) => {
    await page.waitForSelector('a:has-text("Возможно, Вам понравится")');
});

test('Sort order options', async ({ page }) => {
    const sortOptions = page.locator(SORT_OPTIONS_BLOCK);

    await expect.soft(sortOptions).toContainText('популярности');
    await expect.soft(sortOptions).toContainText('рейтингу');
    await expect.soft(sortOptions).toContainText('цене');
    await expect.soft(sortOptions).toContainText('скидке');
    await expect.soft(sortOptions).toContainText('обновлению');
});
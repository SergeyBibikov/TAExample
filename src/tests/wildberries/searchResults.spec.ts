import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const FILTERS = 'div#filters';
const DELIVERY_TIME_FILTER = '[data-filter-name="fdlvr"]';
const DISCOUNT_FILTER = '[data-filter-name="discount"]';
const I_SEARCH_INPUT = 'input[placeholder="Я ищу..."]'
const RAM_FILTER = '[data-filter-name="f4710"]';
const ROM_FILTER = '[data-filter-name="f4424"]';
const ADDITIONAL_OPTIONS = '[data-filter-name="f61827"]'
const SORT_OPTIONS_BLOCK = 'div#catalog_sorter'
const NO_RESULTS_FOUND = '//p[text()="По Вашему запросу ничего не найдено."]'
const PEOPLE_ALSO_SEARCH = '(//h2[text()="Вместе с этим запросом ищут"])[2]'

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

test('Additional options filter has input for text model search', async ({ page }) => {
    const input = page.locator(FILTERS).locator(ADDITIONAL_OPTIONS).locator(I_SEARCH_INPUT);

    await expect(input).toHaveCount(1);
});

test('"You may also like" link presence', async ({ page }) => {
    await page.waitForSelector('a:has-text("Возможно, Вам понравится")');
});

test('Sort order options', async ({ page }) => {
    const sortOptions = page.locator(SORT_OPTIONS_BLOCK);

    await expect.soft(sortOptions).toContainText('популярности');
    await expect.soft(sortOptions).toContainText('рейтингу');
    await expect.soft(sortOptions).toContainText('цене');
    await expect.soft(sortOptions).toContainText('Сначала выгодные');
    await expect.soft(sortOptions).toContainText('обновлению');
});

test('No results on gibberish search', async ({ page }) => {
    await page.goto(Urls.WB_GIBBERISH_RESULTS);
    await page.waitForSelector(NO_RESULTS_FOUND);
});

test('"People also search for" text is present', async ({ page }) => {
    await page.goto(Urls.WB_GIBBERISH_RESULTS);
    await page.waitForSelector(PEOPLE_ALSO_SEARCH);
});

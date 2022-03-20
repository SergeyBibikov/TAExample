import { expect, test } from "@playwright/test";
import { Header } from "../pageObjects/header";
import { Homepage } from "../pageObjects/homepage";


test.beforeEach(async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Счёт');
})

test('Smoke', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Открыть Ozon Счёт');
});

test('Bank info. Show more', async ({ page }) => {
    const moreInfo = page.locator('.ob-container >> text=Узнать подробнее');

    await page.locator('header >> text=О банке').click(); 
    await expect(page.locator('body')).toContainText('Ваш новый ОЗОН Банк');
    await expect(moreInfo).toHaveCount(1);
    await moreInfo.click();
    await expect(page.locator('body')).toContainText('Оставайтесь с нами и ждите анонсов о новых финансовых продуктах');
});
// TODO: Добавить отдельные кейсы для списков
test('Client info', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click(); 
    await expect(page.locator('body')).toContainText('Встречайте ОЗОН Банк');
    await expect(page.locator('body')).toContainText('Информация для клиентов');
    await expect(page.locator('body')).toContainText('Архив документов');
});
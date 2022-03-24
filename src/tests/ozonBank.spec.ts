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
// TODO: Добавить кейс с архивом документов
test('For clients', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click(); 
    await expect(page.locator('body')).toContainText('теперь ООО "Еком Банк" будет обслуживать операции по вашему Озон Счёту.');
    await expect(page.locator('body')).toContainText('Информация для клиентов');
    await expect(page.locator('body')).toContainText('Архив документов');
});

test('Client info docs', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click(); 
    await page.locator('//div[text()="Информация для клиентов"]/../following-sibling::div').click();
    const infoDocs = page.locator('//div[text()="Информация для клиентов"]/ancestor::div[contains(@class, "headerWrapper")]/..');
    await expect(infoDocs.locator('.doc')).toHaveCount(5);
    await expect(infoDocs)
        .toContainText('Информация о праве потребителей финансовых услуг на направление обращения финансовому уполномоченному');
    await expect(infoDocs)
        .toContainText('Памятка об электронных денежных средствах');
    await expect(infoDocs)
        .toContainText('Правила обслуживания клиентов');
    await expect(infoDocs)
        .toContainText('Порядок обработки персональных данных');
    await expect(infoDocs)
        .toContainText('Согласие на получение рекламы');
});

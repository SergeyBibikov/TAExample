import { expect, test } from "@playwright/test";
import { Header } from "../pageObjects/header";
import { Homepage } from "../pageObjects/homepage";
import { Bank } from "../pageObjects/ozonBank";


test.beforeEach(async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Счёт');
})

test('Smoke', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Открыть Ozon Счёт');
});
test('Bank info', async ({ page }) => {
    const infoBlock = page.locator('//div[contains(@class, "infoBlock")]');
    await page.locator('header >> text=О банке').click();
    await expect(infoBlock).toContainText('Ваш новый банк от группы Ozon');
    await expect(infoBlock).toContainText('Узнать подробнее');
});
test('Info details', async ({ page }) => {
    await page.locator('header >> text=О банке').click();

    await expect(page.locator('//span[text()="Основные сведения"]/parent::div[contains(@class, tabsTitleActive)]')).toHaveCount(1);
    await expect(page.locator('body')).toContainText('Общество с ограниченной ответственностью «ОЗОН Банк»');
    await expect(page.locator('body')).toContainText('Limited Liability Company OZON Bank');
    await page.locator('text=Установочные сведения').click();
    await expect(page.locator('//span[text()="Установочные сведения"]/parent::div[contains(@class, tabsTitleActive)]')).toHaveCount(1);
    await expect(page.locator('body')).toContainText('345 000 000 (триста сорок пять миллионов) рублей');
    await expect(page.locator('body')).toContainText('Ни Российская Федерация, ни субъекты Российской Федерации не участвуют в капитале кредитной организации');
});
test('Information disclosure', async ({ page }) => {
    await page.locator('text=Раскрытие информации').click();
    await expect(page.locator('body')).toContainText('Информация в регулятивных целях');
    await expect(page.locator('body')).toContainText('Скоро здесь появятся наши');
    await expect(page.locator('body')).toContainText('обновлённые документы');
});
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
test('Archive docs', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click();
    await page.locator('//div[text()="Информация для клиентов"]/../following-sibling::div').click();

    const archiveDocs = page.locator('//div[text()="Архив документов"]/ancestor::div[contains(@class, "headerWrapper")]/..');
    await expect(archiveDocs.locator('.doc')).toHaveCount(10);
    await expect(archiveDocs).toContainText('Общие условия');
    await expect(archiveDocs).toContainText('Тарифы РКО');
    await expect(archiveDocs).toContainText('Правила (общие условия) выпуска и обслуживания расчетных карт с овердрафтом ООО "ОЗОН Банк"');
    await expect(archiveDocs).toContainText('Правила обслуживания клиентов (до 24.03.2022)');
    await expect(archiveDocs).toContainText('Правила обслуживания клиентов (до 21.03.2022)');
    await expect(archiveDocs).toContainText('Порядок обработки персональных данных (до 24.03.2022)');
    await expect(archiveDocs).toContainText('Порядок обработки персональных данных (до 21.03.2022)');
    await expect(archiveDocs).toContainText('Политика обработки и защиты персональных данных (до 24.03.2022)');
    await expect(archiveDocs).toContainText('Политика обработки и защиты персональных данных (до 21.03.2022)');
});

test.describe('Help section',()=>{
    test('Smoke', async ({ page }) => {
        const helpSection = page.locator(Bank.helpSection);
        await expect(helpSection).toContainText('Как открыть Ozon Счёт?');
        await expect(helpSection).toContainText('Пополнить Ozon Счёт');
        await expect(helpSection).toContainText('Вывести деньги');
        await expect(helpSection).toContainText('Повысить лимиты');
    });
    test('How to open account?', async ({ page }) => {
        const text = 'Заполните недостающие данные на анкете, введите код из смс сообщения и придумайте пароль из 4 цифр.';
        await Bank.checkHelpCardContent(page, "Как открыть", text);
    });
    test('Account refill', async ({ page }) => {
        const text = 'Пополнить Ozon Счёт можно с карты и по номеру телефона через Систему быстрых платежей.';
        await Bank.checkHelpCardContent(page, "Пополнить ", text);
    });
    test('Transfer money from account', async ({ page }) => {
        const text = 'Вывести деньги можно с помощью перевода по номеру телефона, если у вас персональный Счёт';
        await Bank.checkHelpCardContent(page, "Вывести деньги", text);
    });
    test('Increase limits', async ({ page }) => {
        const text =  `Чтобы увеличить лимиты и иметь возможность переводить по номеру телефона в другие банки, \
    нажмите Лимиты в личном кабинете Счёта и заполните небольшую анкету.`;
        await Bank.checkHelpCardContent(page, "Повысить лимиты", text);
    });
});
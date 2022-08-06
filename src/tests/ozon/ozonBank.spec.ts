import { expect, test } from "@playwright/test";
import { Header } from "../../pageObjects/header";
import { Homepage } from "../../pageObjects/homepage";
import { Bank } from "../../pageObjects/ozonBank";


test.beforeEach(async ({ page }) => {
    await Homepage.open(page);
    await Header.goToNavbarLink(page, 'Ozon Счёт');
})

test('Bank info', async ({ page }) => {
    const infoBlock = page.locator('//div[contains(@class, "infoBlock")]');
    await page.locator('header >> text=О банке').click();
    await expect(infoBlock).toContainText('Ваш новый банк от группы Ozon');
    await expect(infoBlock).toContainText('Узнать подробнее');
});
test.describe('About', () => {
    test('Popup on hover', async ({ page }) => {
        const aboutLoc = Bank.getAboutLocator(page);
        await aboutLoc.click();
        await aboutLoc.hover();
        const mainInfo = page.locator('//a[text()="Основная информация"]');
        const infoDisclosure = page.locator('//a[text()="Раскрытие информации"]');
        const juridicalInfo = page.locator('//a[text()="Правовая информация"]');
        await expect(mainInfo).toBeVisible();
        await expect(infoDisclosure).toBeVisible();
        await expect(juridicalInfo).toBeVisible();
    });
    test('Info details', async ({ page }) => {
        await page.locator('text=Основная информация').click();
        await expect(page.locator('body')).toContainText('Общество с ограниченной ответственностью «Еком Банк»');
        await expect(page.locator('body')).toContainText('Limited Liability Company Ecom Bank');
        await page.locator('text=Установочные сведения').click();
        await expect(page.locator('//span[text()="Установочные сведения"]/parent::div[contains(@class, tabsTitleActive)]')).toHaveCount(1);
        await expect(page.locator('body')).toContainText('3 600 000 000 (три миллиарда шестьсот миллионов) рублей');
        await expect(page.locator('body')).toContainText('Ни Российская Федерация, ни субъекты Российской Федерации не участвуют в капитале кредитной организации');
    });
    test('Information disclosure', async ({ page }) => {
        await page.locator('text=Раскрытие информации').click();
        await expect(page.locator('body')).toContainText('Скоро здесь появятся наши');
        await expect(page.locator('body')).toContainText('обновлённые документы');
    });
});
test('For clients', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click();
    await expect(page.locator('body')).toContainText('Встречайте банк от группы Ozon');
    await expect(page.locator('body')).toContainText('Информация для клиентов');
});
test('Client info docs', async ({ page }) => {
    await page.locator('header >> text=Клиентам').click();
    await page.locator('//div[text()="Информация для клиентов"]/../../following-sibling::div').click();
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
//TODO: The section was removed for now at least. Delete test if it doesn't return
// test('Archive docs', async ({ page }) => {
//     await page.locator('header >> text=Клиентам').click();
//     await page.locator('//div[text()="Информация для клиентов"]/../../following-sibling::div').click();

//     const archiveDocs = page.locator('//div[text()="Архив документов"]/ancestor::div[contains(@class, "headerWrapper")]/..');
//     await expect(archiveDocs.locator('.doc')).toHaveCount(10);
//     await expect(archiveDocs).toContainText('Общие условия');
//     await expect(archiveDocs).toContainText('Тарифы РКО');
//     await expect(archiveDocs).toContainText('Правила (общие условия) выпуска и обслуживания расчетных карт с овердрафтом ООО "ОЗОН Банк"');
//     await expect(archiveDocs).toContainText('Правила обслуживания клиентов (до 24.03.2022)');
//     await expect(archiveDocs).toContainText('Правила обслуживания клиентов (до 21.03.2022)');
//     await expect(archiveDocs).toContainText('Порядок обработки персональных данных (до 24.03.2022)');
//     await expect(archiveDocs).toContainText('Порядок обработки персональных данных (до 21.03.2022)');
//     await expect(archiveDocs).toContainText('Политика обработки и защиты персональных данных (до 24.03.2022)');
//     await expect(archiveDocs).toContainText('Политика обработки и защиты персональных данных (до 21.03.2022)');
// });

test.describe('Help section', () => {
    test('Smoke', async ({ page }) => {
        const helpSection = page.locator(Bank.selectors.helpSection);
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
        const text = 'Вывести деньги можно с помощью перевода по номеру телефона, если у вас Базовый Счёт';
        await Bank.checkHelpCardContent(page, "Вывести деньги", text);
    });
    test('Increase limits', async ({ page }) => {
        const text = `Чтобы увеличить лимиты и иметь возможность переводить по номеру телефона в другие банки, \
    нажмите Лимиты в личном кабинете Счёта и заполните небольшую анкету.`;
        await Bank.checkHelpCardContent(page, "Повысить лимиты", text);
    });
});
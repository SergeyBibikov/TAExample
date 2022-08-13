import { expect, test } from "@playwright/test";
import { Bank } from "../../pageObjects/ozonBank";
import Urls from "../../urls";

const FOR_CLIENTS = 'header >> text=Клиентам'
const INFO_BLOCK = 'div[class*="main"] div[class*="infoBlock"]'
const CLIENT_INFO_DOCS_ARROW = '//div[text()="Информация для клиентов"]/../following-sibling::div'
const CLIENT_INFO_DOCS_LIST = '//div[text()="Информация для клиентов"]/ancestor::div[contains(@class, "headerWrapper")]/..'
const ARCHIVE_DOCS_ARROW = '//div[text()="Архив"]/../following-sibling::div'
const ARCHIVE_DOCS_LIST = '//div[text()="Архив"]/ancestor::div[contains(@class, "headerWrapper")]/..'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.OZON_FINANCE);
})

test('Bank info', async ({ page }) => {
    await page.locator('header >> text=О банке').click();
    await page.waitForSelector(INFO_BLOCK)
    const infoBlock = page.locator(INFO_BLOCK);

    await expect.soft(infoBlock).toContainText('Ваш новый банк от группы Ozon');
    await expect.soft(infoBlock).toContainText('Узнать подробнее');
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

test.describe('For clients tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.locator(FOR_CLIENTS).click();
    });
    test('Main info', async ({ page }) => {

        await expect(page.locator('body')).toContainText('Встречайте банк от группы Ozon');
        await expect(page.locator('body')).toContainText('Информация для клиентов');
    });
    test('Client info docs', async ({ page }) => {
        await page.locator(CLIENT_INFO_DOCS_ARROW).click();
        const infoDocs = page.locator(CLIENT_INFO_DOCS_LIST);

        await expect.soft(infoDocs.locator('.doc')).toHaveCount(5);
        await expect.soft(infoDocs)
            .toContainText('Информация о праве потребителей финансовых услуг на направление обращения финансовому уполномоченному');
        await expect.soft(infoDocs)
            .toContainText('Памятка об электронных денежных средствах');
        await expect.soft(infoDocs)
            .toContainText('Памятка о документах для открытия Ozon Счёт для бизнеса');
        await expect.soft(infoDocs)
            .toContainText('Согласие на получение рекламы');
        await expect.soft(infoDocs)
            .toContainText('Памятка о безопасности');
    });

    test('Archive docs', async ({ page }) => {

        await page.locator(ARCHIVE_DOCS_ARROW).click();

        const archiveDocs = page.locator(ARCHIVE_DOCS_LIST);

        await expect.soft(archiveDocs.locator('.doc')).toHaveCount(14);
        await expect.soft(archiveDocs).toContainText('Правила обслуживания клиентов (от 24.05.2022)');
        await expect.soft(archiveDocs).toContainText('Общие положения Клиентских правил (от 18.07.2022)');
        await expect.soft(archiveDocs).toContainText('Общие положения Клиентских правил (от 13.07.2022)');
        await expect.soft(archiveDocs).toContainText('Общие положения Клиентских правил (от 06.06.2022)');
        await expect.soft(archiveDocs).toContainText('Общие положения Клиентских правил (от 16.06.2022)');
        await expect.soft(archiveDocs).toContainText('Правила использования «Ozon Карта» (от 13.07.2022)');
        await expect.soft(archiveDocs).toContainText('Правила использования «Ozon Карта» (от 25.07.2022)');
        await expect.soft(archiveDocs).toContainText('Правила использования «Ozon Счёт» (от 06.06.2022)');
        await expect.soft(archiveDocs).toContainText('Порядок обработки персональных данных (от 20.07.2022)');
        await expect.soft(archiveDocs).toContainText('Порядок обработки персональных данных (от 13.07.2022)');
        await expect.soft(archiveDocs).toContainText('Порядок обработки персональных данных (от 24.05.2022)');
        await expect.soft(archiveDocs).toContainText('Порядок обработки персональных данных (от 06.06.2022)');
    });
})

test.describe('Q&A answers', () => {
    test('All four topics should be present', async ({ page }) => {
        const helpSection = page.locator(Bank.selectors.helpSection);
        await expect(helpSection).toContainText('Как открыть Ozon Карту?');
        await expect(helpSection).toContainText('Пополнить Ozon Карту');
        await expect(helpSection).toContainText('Вывести деньги');
        await expect(helpSection).toContainText('Повысить лимиты');
    });
    test('How to open card?', async ({ page }) => {
        const text = 'Заполните недостающие данные в анкете, введите код из смс сообщения и придумайте пароль из 4 цифр.';

        const answer = await Bank.getAnswerCardContent(page, 'Как открыть')

        await expect.soft(answer).toContainText(text);
        await expect.soft(answer).toContainText('4 цифр.');
    });
    test('Card refill', async ({ page }) => {
        const answer = await Bank.getAnswerCardContent(page, 'Пополнить')

        await expect.soft(answer).toContainText('можно по номеру телефона через Систему быстрых платежей');
        await expect.soft(answer).toContainText('или с карты другого банка');
        await expect.soft(answer).toContainText('Мы не берем комиссию за пополнение независимо от суммы');
    });
    test('Transfer money from account', async ({ page }) => {
        const text = 'Вывести деньги можно с помощью перевода по номеру телефона, если у вас Базовый';

        const answer = await Bank.getAnswerCardContent(page, 'Вывести деньги')

        await expect.soft(answer).toContainText(text);
        await expect.soft(answer).toContainText('С Анонимного ');
        await expect.soft(answer).toContainText(' вы сможете потратить деньги только на покупки в ');
        await expect.soft(answer).toContainText('Ozon');
    });
    test('Increase limits', async ({ page }) => {
        const answer = await Bank.getAnswerCardContent(page, 'Повысить лимиты')

        await expect.soft(answer).toContainText('После регистрации у вас будет Анонимный ');
        await expect.soft(answer).toContainText(', который имеет ограничения:');
        await expect.soft(answer).toContainText('Чтобы увеличить лимиты и иметь возможность переводить по номеру телефона в другие банки,');
        await expect.soft(answer).toContainText('нажмите Лимиты в личном кабинете');
    });
});
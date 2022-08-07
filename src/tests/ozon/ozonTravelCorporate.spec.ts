import { test, expect } from '@playwright/test';
import Urls from '../../urls';

const ADVANTAGES_LIST = '//div[contains(text(), "Плюсы для")]/following-sibling::div/div[1]'
const BRING_A_FRIEND_CARD = '//div[h2[text()="Приведите друга"]]'
const CALL_ME_BUTTON = '//button[contains(.,"Заказать звонок")]'
const INSTRUCTION = '//div[@id="checklist"]/following-sibling::div[2]'
const I_PAY_BUTTON = '//button[contains(text(), "Плачу я, компания возмещает")]'
const LEARN_AND_RECOMMEND_BUTTON = '//button[span[span[text()="Узнать больше и порекомендовать"]]]'
const PERSONAL_APPROACH_CARD = '//div[contains(text(), "Индивидуальный подход")]/following-sibling::div/div[1]'
const SPECIAL_OFFERS_CARD = '//span[span[contains(text(), "Специальные")]]/following-sibling::div'

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.OZON_CORPORATE_TRAVEL);
})

test('Promo info', async ({ page }) => {
    const body = page.locator('body')

    await expect(body).toContainText('Ozon Travel');
    await expect(body).toContainText('для бизнеса');
    await expect(body).toContainText('Командировки по вашим правилам');
});

test('Two "Call me" buttons', async ({ page }) => {
    await expect.soft(page.locator(CALL_ME_BUTTON)).toHaveCount(2);
});

test('Corporate advantages list text', async ({ page }) => {
    const advList = page.locator(ADVANTAGES_LIST)

    await expect.soft(advList).toContainText('Возмещение НДС до 20%');
    await expect.soft(advList).toContainText('Отсрочка платежа');
    await expect.soft(advList).toContainText('Круглосуточная поддержка');
});

test('Special offers', async ({ page }) => {
    const specOffersCard = page.locator(SPECIAL_OFFERS_CARD);

    await expect.soft(specOffersCard).toContainText('Premium-подписка');
    await expect.soft(specOffersCard).toContainText('Промокоды ');
    await expect.soft(specOffersCard).toContainText('на товары');
    await expect.soft(specOffersCard).toContainText('Отсрочка ');
    await expect.soft(specOffersCard).toContainText('на оплату заказа');
    await expect.soft(specOffersCard).toContainText('Баллбэк за отели');
});

test('Personal approach client categories', async ({ page }) => {
    const approachCard = page.locator(PERSONAL_APPROACH_CARD);

    await expect.soft(approachCard).toContainText('Владельцу бизнеса');
    await expect.soft(approachCard).toContainText('Тревел-менеджеру');
    await expect.soft(approachCard).toContainText('Бухгалтеру');
    await expect.soft(approachCard).toContainText('Сотруднику');
});

test('Instruction steps when the company pays', async ({ page }) => {
    const instruction = page.locator(INSTRUCTION);

    await expect.soft(instruction).toContainText('Зарегистрируйтесь в 2 клика');
    await expect.soft(instruction).toContainText('Оплатите билеты и отель');
    await expect.soft(instruction).toContainText('Подготовьте отчётные документы');
    await expect.soft(instruction).toContainText('Заполните авансовый отчет');
});
test('Instruction steps when the company compensates', async ({ page }) => {
    await page.locator(I_PAY_BUTTON).click();

    const instruction = page.locator(INSTRUCTION);

    await expect.soft(instruction).toContainText('Напишите заявление на выплату аванса');
    await expect.soft(instruction).toContainText('Оплатите билеты и отель');
    await expect.soft(instruction).toContainText('Подготовьте отчётные документы');
    await expect.soft(instruction).toContainText('Заполните авансовый отчет');
});

test('Bring a friend card has "recommend us" text', async ({ page }) => {
    const card = page.locator(BRING_A_FRIEND_CARD);
    await expect.soft(card).toContainText('Порекомендуйте нас');
    await expect.soft(card).toContainText('Если ваш друг оформит командировку,\
        мы начислим вам и вашему другу до');
});

test('Bring a friend card has "Learn more" button', async ({ page }) => {
    await page.waitForSelector(`${BRING_A_FRIEND_CARD} >> ${LEARN_AND_RECOMMEND_BUTTON}`);
});

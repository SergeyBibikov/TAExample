import { expect, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";

const COUNTRY_CODE_LIST = '.drop-list';
const GET_CODE_BUTTON = '#requestCode';
const RECIEVE_SMS_INFO_CHECKBOX = '//span[contains(text(), "Получать эксклюзивные скидки")]/preceding-sibling::input';
const RETURN_RULES_LINK = '//a[text()="Правил пользования торговой площадкой"]';
const SOMEONE_ELSES_PC_CHECKBOX = '//span[text()="Чужой компьютер"]/preceding-sibling::input';
const TERMS_OF_USE_LINK = '//a[text()="правилами возврата"]';

test.beforeEach(async ({ page }) => {
    await page.goto(Urls.WB_LOGIN_PAGE);
})
//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('Get code button is disabled by default', async ({ page }) => {
    await expect(page.locator(GET_CODE_BUTTON)).toHaveClass(/disabled/);
});

test('Phone number validation on get code button click', async ({ page }) => {
    await page.locator(GET_CODE_BUTTON).click();
    await expect.soft(page.locator(WbLocators.AUTH_FORM)).toContainText('Введите номер телефона!');

});

test("Someone else's checkbox is unchecked by default", async ({ page }) => {
    await expect(page.locator(SOMEONE_ELSES_PC_CHECKBOX)).not.toBeChecked();
});

test("Get info via SMS checkbox is checked by default", async ({ page }) => {
    await expect(page.locator(RECIEVE_SMS_INFO_CHECKBOX)).toBeChecked();
});

test('There are 5 country phone codes', async ({ page }) => {
    
    const codeList = page.locator(COUNTRY_CODE_LIST);

    await expect.soft(codeList).toContainText('+7');
    await expect.soft(codeList).toContainText('+375');
    await expect.soft(codeList).toContainText('+374');
    await expect.soft(codeList).toContainText('+996');
    await expect.soft(codeList).toContainText('+998');
});

test('Terms of use and return rules links are present', async ({ page }) => {
    
    const authForm = page.locator(WbLocators.AUTH_FORM);

    await expect.soft(authForm.locator(TERMS_OF_USE_LINK)).toHaveCount(1);
    await expect.soft(authForm.locator(RETURN_RULES_LINK)).toHaveCount(1);
});

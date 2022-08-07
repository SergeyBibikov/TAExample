import { expect, Page, Locator, test } from "@playwright/test";
import Urls from "../../urls";
import WbLocators from "../../wbLocators";


const PICKUP_POINT_JOB_DESC = 'section#pickup-point'
const WAREHOUSE_JOB_DESC = 'section#storage'
const WORK_PLACE_SECTION = 'section[class*="employment__intro"]'

const getPickupPointCardLocator = async (page: Page, card: String): Promise<Locator> => {
    const iFrame = page.frameLocator('#pageInfoIfr');
    const jobDescription = iFrame.locator(PICKUP_POINT_JOB_DESC);
    return jobDescription.locator(`section:has-text("${card}")`)
}

//Avoiding anti-bot threshold
test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})

test('"Work at Wildberries" button lead on click', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(WbLocators.WORK_AT_WB_BUTTON).click();
    expect.soft(page.url()).toContain('services/trudoustroystvo');
});

test.describe('Job at WB page contents', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(Urls.WB_WORK);
    });
    
    test('Two job place options are present', async ({ page }) => {

        const iFrame = page.frameLocator('#pageInfoIfr');
        const workPlace = iFrame.locator(WORK_PLACE_SECTION)

        await expect.soft(workPlace.locator('button')).toHaveCount(2);
        await expect.soft(workPlace.locator('button:has-text("В складской комплекс")')).toHaveCount(1);
        await expect.soft(workPlace.locator('button:has-text("В пункт выдачи")')).toHaveCount(1);
    });

    test('Warehouse job desc has three advantages', async ({ page }) => {

        const iFrame = page.frameLocator('#pageInfoIfr');
        const jobDescription = iFrame.locator(WAREHOUSE_JOB_DESC);

        await expect.soft(jobDescription).toContainText('Гибкий / свободный график');
        await expect.soft(jobDescription).toContainText('Бесплатный транспорт');
        await expect.soft(jobDescription).toContainText('До 140 000 ₽ в месяц');
    });

    test('Pickup point worker responsibilities', async ({ page }) => {

        const responsibilitiesCard = await getPickupPointCardLocator(page, 'Что нужно делать');

        await expect.soft(responsibilitiesCard).toContainText('Выдача товара курьерам и клиентам');
        await expect.soft(responsibilitiesCard).toContainText('Прием и распределение товаров на пункте выдачи заказов');
        await expect.soft(responsibilitiesCard).toContainText('Ведение базы во внутренней системе');
    });
    test('Pickup point worker expected skills', async ({ page }) => {

        const skillsCard = await getPickupPointCardLocator(page, 'Что мы ожидаем');

        await expect.soft(skillsCard).toContainText('Знание ПК на уровне пользователя');
        await expect.soft(skillsCard).toContainText('Приветствуется опыт работы на складе, либо продавцом-консультантом');
        await expect.soft(skillsCard).toContainText('Аккуратность‚ ответственность, исполнительность');
    });
    test('What is offered to the pickup point worker', async ({ page }) => {

        const offerCard = await getPickupPointCardLocator(page, 'Что мы предлагаем');

        await expect.soft(offerCard).toContainText('Оформление по договору');
        await expect.soft(offerCard).toContainText('Высокий уровень дохода');
        await expect.soft(offerCard).toContainText('Перспектива профессионального и карьерного роста');
    });

})


import { expect, test } from "@playwright/test";
import Urls from "../../urls";



const PICKUP_POINT_JOB_DESC = 'section#pickup-point'
const WAREHOUSE_JOB_DESC = 'section#storage'
const WORK_AT_WB_BUTTON = 'a:has-text("Работа в Wildberries")'
const WORK_PLACE_SECTION = 'section[class*="employment__intro"]'

test('"Work at Wildberries" button lead on click', async ({ page }) => {
    await page.goto(Urls.WB_MAIN_PAGE);
    await page.locator(WORK_AT_WB_BUTTON).click();
    expect.soft(page.url()).toContain('services/trudoustroystvo');
});

test('Two job place options are present', async ({ page }) => {
    await page.goto(Urls.WB_WORK);

    const iFrame = page.frameLocator('#pageInfoIfr');
    const workPlace = iFrame.locator(WORK_PLACE_SECTION)

    await expect.soft(workPlace.locator('button')).toHaveCount(2);
    await expect.soft(workPlace.locator('button:has-text("В складской комплекс")')).toHaveCount(1);
    await expect.soft(workPlace.locator('button:has-text("В пункт выдачи")')).toHaveCount(1);
});

test('Warehouse job desc has three advantages', async ({ page }) => {
    await page.goto(Urls.WB_WORK);

    const iFrame = page.frameLocator('#pageInfoIfr');
    const jobDescription = iFrame.locator(WAREHOUSE_JOB_DESC);
    await expect.soft(jobDescription).toContainText('Гибкий / свободный график');
    await expect.soft(jobDescription).toContainText('Бесплатный транспорт');
    await expect.soft(jobDescription).toContainText('До 140 000 ₽ в месяц');
});

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(1000);
})
import { test, expect } from '@playwright/test';

import { Homepage } from '../pageObjects/homepage';

test("Top bar links list", async ({ page }) => {
    await Homepage.open(page);
    const topBarLinks = page.locator(Homepage.topBar).locator('//ul');
    await Promise.all(
        [
            expect(topBarLinks).toContainText('Ozon для бизнеса'),
            expect(topBarLinks).toContainText('Мобильное приложение'),
            expect(topBarLinks).toContainText('Реферальная программа'),
            expect(topBarLinks).toContainText('Зарабатывай с Ozon'),
            expect(topBarLinks).toContainText('Помощь'),
            expect(topBarLinks).toContainText('Пункты выдачи'),
        ]
    );
});

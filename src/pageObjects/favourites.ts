import { Page, Browser} from "@playwright/test";

export class Favourites{
    static readonly fileName = "favsState.json"
    static async open(page: Page){
        await page.goto('https://www.ozon.ru/my/favorites');
    }

    
    static async getPageWithContext(browser: Browser): Promise<Page>{
        const context = await browser.newContext({ storageState: 'favsState.json' });
        const page = await context.newPage();
        return page;
    }
}
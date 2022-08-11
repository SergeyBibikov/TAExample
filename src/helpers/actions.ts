import { Page } from "@playwright/test";

export async function scrollToBottom(p: Page) {
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}
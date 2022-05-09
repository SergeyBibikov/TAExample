import { Page } from "@playwright/test";

export class SignInCard{

    root
    cardFrame
    cardBody
    signInButton
    phoneInput
    signInWithEmail
    signInWithApple

    constructor (page: Page){
        this.root = page.locator('[data-widget="ozonIdIframe"]');
        this.cardFrame = this.root.frameLocator('iframe');
        this.cardBody = this.cardFrame.locator('body');
        this.signInButton = this.cardFrame.locator('//button[contains(., "Войти")]');
        this.phoneInput = this.cardFrame.locator('input[name="phone"]');
        this.signInWithEmail = this.cardFrame.locator('//a[text()="Войти по почте"]');
        this.signInWithApple = this.cardFrame.locator('//a[span[contains(., "Вход с Apple")]]');
    }
}
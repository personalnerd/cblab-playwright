import { Locator, Page } from '@playwright/test';

export default class OnBoarding {
  readonly page: Page;
  readonly baseUrl: string;
  readonly appOnBoardingDelivery: Locator;
  readonly btnEntrar: Locator;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.appOnBoardingDelivery = this.page.locator('app-on-boarding-delivery');
    this.btnEntrar = this.page.getByText('Entrar');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.baseUrl);
    //await this.page.waitForLoadState('networkidle');
    await this.appOnBoardingDelivery.waitFor({ state: 'visible' });
  }
}

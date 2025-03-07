import { Page, Locator } from '@playwright/test';

export default class NavBar {
  readonly page: Page;
  readonly navBar: Locator;
  readonly btnDelivery: Locator;
  readonly btnPromocoes: Locator;
  readonly btnVouchers: Locator;
  readonly btnPerfil: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navBar = this.page.locator('cb-nav-bar');
    this.btnDelivery = this.navBar.locator('div').filter({ hasText: /^Delivery$/ });
    this.btnPromocoes = this.navBar.locator('div').filter({ hasText: /^Promoções$/ });
    this.btnVouchers = this.navBar.locator('div').filter({ hasText: /^Vouchers$/ });
    this.btnPerfil = this.navBar.locator('div').filter({ hasText: /^Perfil$/ });
  }
}

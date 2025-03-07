import { Locator, Page } from '@playwright/test';

export default class Entrar {
  readonly page: Page;
  readonly baseUrl: string;
  readonly btnCadastrar: Locator;

  // modal de cadastro
  readonly inputNomeCompleto: Locator;
  readonly inputEmail: Locator;
  readonly inputSenha: Locator;
  readonly inputConfirmarSenha: Locator;
  readonly selectUF: Locator;
  readonly checkTermos: Locator;
  readonly btnAceitarTermos: Locator;
  readonly btnModalCadastrar: Locator;
  readonly btnFechar: Locator;

  // código de confirmação
  readonly inputCodigo: Locator;
  readonly btnAcessar: Locator;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.btnCadastrar = this.page.getByText('Não tem uma conta?Cadastre-se');

    // modal de cadastro
    this.inputNomeCompleto = this.page.getByRole('textbox', { name: 'Nome completo' });
    this.inputEmail = this.page.locator('#ion-input-5');
    this.inputSenha = this.page.locator('#ion-input-6');
    this.inputConfirmarSenha = this.page.getByRole('textbox', { name: 'Confirmar senha' });
    this.selectUF = this.page.getByText('Selecione seu Estado');
    this.checkTermos = this.page.locator('ion-checkbox').filter({ hasText: 'Ao clicar em cadastrar você' }).getByRole('img');
    this.btnAceitarTermos = this.page.getByRole('button', { name: 'ACEITAR' });
    this.btnModalCadastrar = this.page.getByRole('button', { name: 'CADASTRAR' });
    this.btnFechar = this.page.getByRole('button', { name: 'FECHAR' });

    // código de confirmação
    this.inputCodigo = this.page.locator('input.otp-input:first-child');
    this.btnAcessar = this.page.getByRole('button', { name: 'ACESSAR' });
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.baseUrl);
    //await this.page.waitForLoadState('networkidle');
    //await this.appOnBoardingDelivery.waitFor({ state: 'visible' });
  }
}

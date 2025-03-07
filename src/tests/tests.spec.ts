import { expect, test, Locator, Page } from '@playwright/test';
import {  Entrar, NavBar } from '@/page-objects';
import config from '@/helpers/config.json';
import { fakerPT_BR as faker } from '@faker-js/faker'

const BASE_URL = config.baseURL;
let page: Page;
let entrarPage: Entrar;
let navBar: NavBar;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  entrarPage = new Entrar(page, `${BASE_URL}/entrar`);
  navBar = new NavBar(page);
})

test.describe('Cadastro de usuário', async () => {
  test('Deve realizar cadastro de novo usuário', async () => {
    const user = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      senha: 'qwe123A*', // 6 caracteres, letras minúsculas, maiúsculas, números e caractere especial
      uf: 'Distrito Federal'
    }

    await entrarPage.navigate();
    await entrarPage.btnCadastrar.click();

    // fill form
    await entrarPage.inputNomeCompleto.fill(user.nome);
    await entrarPage.inputEmail.fill(user.email);
    await entrarPage.inputSenha.fill(user.senha);
    await entrarPage.inputConfirmarSenha.fill(user.senha);
    await entrarPage.selectUF.click({timeout: 5000});
    await page.getByRole('button', { name: user.uf }).click( {timeout: 5000} );
    await entrarPage.checkTermos.click();
    await entrarPage.btnAceitarTermos.click();
    await entrarPage.btnModalCadastrar.click();

    // fecha a modal de código de confirmação
    await entrarPage.btnFechar.click();

    // digita o código de confirmação
    await entrarPage.inputCodigo.fill('AAAAAA');
    await entrarPage.btnAcessar.click();

    // check if user is logged in
    await navBar.btnPerfil.click();

    await expect(page.url()).toBe(`${BASE_URL}/perfil`);
    await expect(page.getByText(user.nome)).toBeVisible();

    await page.getByText('Editar').click();

    await expect(page.getByLabel('Nome Completo')).toHaveValue(user.nome)
    await expect(page.getByLabel('E-mail')).toHaveValue(user.email);
    await expect(page.getByText('Distrito Federal').nth(1)).toBeVisible();
  });
})

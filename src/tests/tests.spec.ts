import { expect, test } from '@playwright/test';
import {  Entrar, NavBar } from '@/page-objects';
import config from '@/helpers/config.json';
import { fakerPT_BR as faker } from '@faker-js/faker'

const BASE_URL = config.baseURL;

test.describe('Cadastro de usuário', async () => {
  test('Deve realizar cadastro de novo usuário', async ( {page}) => {
    const entrarPage = new Entrar(page, `${BASE_URL}/entrar`);
    const navBar = new NavBar(page);
    const user = {
      nomeCompleto: faker.person.fullName(),
      email: faker.internet.email(),
      senha: 'qwe123A*',
      uf: faker.location.state()
    }

    await entrarPage.navigate();
    await entrarPage.btnCadastrar.click();

    // preencher cadastro
    await entrarPage.preencherCadastro(user);

    // fecha a modal de código de confirmação
    await entrarPage.btnFechar.click();

    // digita o código de confirmação
    await entrarPage.inputCodigo.fill(config.codigoConfirmacao);
    await entrarPage.btnAcessar.click();

    // verifica se o usuário foi corretamente cadastrado e está logado
    await navBar.btnPerfil.click();

    await expect(page.url(), 'deve estar na página de perfil').toBe(`${BASE_URL}/perfil`);
    await expect(page.getByText(user.nomeCompleto), 'o nome do usuário cadastrado deve estar visível').toBeVisible();

    await page.getByText('Editar').click();

    await expect(page.getByLabel('Nome Completo'), 'confere o nome do usuário cadastrado').toHaveValue(user.nomeCompleto)
    await expect(page.getByLabel('E-mail'), 'confere o email cadastrado').toHaveValue(user.email);
    await expect(page.getByText(user.uf).nth(1), 'confere a UF cadastrada').toBeVisible();
  });
})

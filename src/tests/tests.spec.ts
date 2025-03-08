import { expect, Page, test } from '@playwright/test';
import {  Entrar, NavBar } from '@/page-objects';
import config from '@/helpers/config.json';
import { fakerPT_BR as faker } from '@faker-js/faker'

const BASE_URL = config.baseURL;
let page: Page;
let entrarPage: Entrar;
let navBar: NavBar;
const user = {
  nomeCompleto: faker.person.fullName(),
  email: faker.internet.email(),
  senha: 'qwe123A*',
  uf: faker.location.state(),
  termos: true
}

test.beforeAll(async ({browser}) => {
  page = await browser.newPage();
  entrarPage = new Entrar(page, `${BASE_URL}/entrar`);
  navBar = new NavBar(page);
})

test.beforeEach(async () => {
  await entrarPage.navigate();
  await entrarPage.btnCadastrar.click();
})

test.describe('Cadastro de usuário', async () => {
  test('Deve realizar cadastro de novo usuário', async () => {
    // preencher cadastro
    await entrarPage.preencherCadastro(user);
    await entrarPage.btnModalCadastrar.click();

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

  test.describe('Validação dos campos - cenários negativos', async () => {
    test('Não deve cadastrar sem preencher os campos obrigatórios', async () => {
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar sem o nome completo', async () => {
      const nomeSimples = faker.person.firstName()
      const mensagemErroNome = await page.locator('.error-message').filter({ hasText: 'Digite seu nome completo'});

      await entrarPage.preencherCadastro({...user, nomeCompleto: nomeSimples});

      await expect(mensagemErroNome, 'Mensagem de erro deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar com senha fraca', async () => {
      const senhaFraca = {
        minimo: {
          senha: '12345',
          mensagem: page.locator('.error-message').filter({ hasText: 'Senha deve conter no mínimo 6 caracteres'})
        },
        maiuscula: {
          senha: '123456',
          mensagem: page.locator('.error-message').filter({ hasText: 'Senha deve conter no mínimo 1 caractere maiúsculo'})
        },
        minuscula: {
          senha: '123456A',
          mensagem: page.locator('.error-message').filter({ hasText: 'Senha deve conter no mínimo 1 caractere minúsculo'})
        },
        especial: {
          senha: '123456Aa',
          mensagem: page.locator('.error-message').filter({ hasText: 'Senha deve conter no mínimo 1 caractere especial'})
        },
        numero: {
          senha: 'aaaaaaA*',
          mensagem: page.locator('.error-message').filter({ hasText: 'Senha deve conter no mínimo 1 número'})
        },
        confirmarSenhaMensagem: page.locator('.error-message').filter({ hasText: 'As senhas inseridas são diferentes'})
      }

      await entrarPage.preencherCadastro({...user, senha: senhaFraca.minimo.senha});
      await expect(senhaFraca.minimo.mensagem, 'Mensagem de erro "tamanho mínimo" deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();

      await entrarPage.inputSenha.fill(senhaFraca.maiuscula.senha);
      await expect(senhaFraca.maiuscula.mensagem, 'Mensagem de erro "letra maiúscula" deve ser exibida').toBeVisible();
      await expect(senhaFraca.confirmarSenhaMensagem, 'Mensagem de erro de confirmação de senha diferente deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();

      await entrarPage.inputSenha.fill(senhaFraca.minuscula.senha);
      await expect(senhaFraca.minuscula.mensagem, 'Mensagem de erro "letra minúscula" deve ser exibida').toBeVisible();
      await expect(senhaFraca.confirmarSenhaMensagem, 'Mensagem de erro de confirmação de senha diferente deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();

      await entrarPage.inputSenha.fill(senhaFraca.especial.senha);
      await expect(senhaFraca.especial.mensagem, 'Mensagem de erro "caractere especial" deve ser exibida').toBeVisible();
      await expect(senhaFraca.confirmarSenhaMensagem, 'Mensagem de erro de confirmação de senha diferente deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();

      await entrarPage.inputSenha.fill(senhaFraca.numero.senha);
      await expect(senhaFraca.numero.mensagem, 'Mensagem de erro "número" deve ser exibida').toBeVisible();
      await expect(senhaFraca.confirmarSenhaMensagem, 'Mensagem de erro de confirmação de senha diferente deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar com email inválido', async () => {
      const emailInvalido = {
        email: 'teste.com',
        mensagem: page.locator('.error-message').filter({ hasText: 'E-mail inválido'})
      }

      await entrarPage.preencherCadastro({...user, email: emailInvalido.email});
      await expect(emailInvalido.mensagem, 'Mensagem de erro "e-mail inválido" deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar com email já cadastrado', async () => {
      const mensagemErroEmail = await page.locator('.error-message').filter({ hasText: 'E-mail já cadastrado'});
      await entrarPage.preencherCadastro(user);

      await expect(mensagemErroEmail, 'Mensagem de erro "e-mail já cadastrado" deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar sem UF', async () => {
      const newEmail = faker.internet.email();
      const mensagemErroUF = await page.locator('.error-message').filter({ hasText: 'Estado é obrigatório'});

      await entrarPage.preencherCadastro({...user, email: newEmail, uf: null});

      await expect(mensagemErroUF, 'Mensagem de erro "estado é obrigatório" deve ser exibida').toBeVisible();
      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })

    test('Não deve cadastrar sem concordar com os termos', async () => {
      const newEmail = faker.internet.email();

      await entrarPage.preencherCadastro({...user, email: newEmail, termos: false});

      await expect(entrarPage.btnModalCadastrar, 'Botão cadastrar da modal deve estar desabilitado').toBeDisabled();
    })
  })
})

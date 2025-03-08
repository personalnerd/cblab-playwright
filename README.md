# CB LAB Desafio QA

Este repositório contém o código para o desafio de QA utilizando Playwright.

## Descrição

O projeto tem como objetivo automatizar testes de interface de usuário (UI) para garantir a qualidade do software. Utilizamos o Playwright, uma ferramenta poderosa para automação de navegadores, que suporta múltiplos navegadores como Chromium, Firefox e WebKit.

Dos fluxos identificados na "tarefa 1", escolhi o fluxo de cadastro de usuário para automatizar nesse desafio.

## Estrutura do Projeto

- `src/tests/`: Contém os arquivos de teste.
- `src/page-objects/`: Contém os objetos de página (Page Objects) que abstraem a interação com as páginas e componentes.
- `src/helpers/`: Contém utilitários e funções auxiliares.
- `playwright.config.js`: Arquivo de configuração do Playwright.
- `tsconfig.json`: Arquivo de configuração do Typescript.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/personalnerd/cblab-playwright.git
```

2. Navegue até o diretório do projeto:

```bash
cd cblab-playwright
```

3. Instale as dependências:

```bash
npm install
```

4. Se é a primeira vez que executa o Playwright em sua máquina, execute o comando abaixo para instalar os navegadores do Playwright:

```bash
npx playwright install
```

## Executando os Testes

Para executar os testes, utilize o seguinte comando:

```bash
npx playwright test
```

Para facilitar, preparei scripts no `package.json` com comandos úteis:

Executa os testes em modo headless (sem visualização), sem configurações adicionais:

```bash
npm run test
```

Executa os testes em modo headed (abre o navegador e exibe os testes em execução):

```bash
npm run test-headed
```

Executa o teste em [modo UI](https://playwright.dev/docs/test-ui-mode), abrindo uma ferramenta do Playwright para acompanhamento e debug dos testes:

```bash
npm run test-ui
```

Executa os testes com o [Playwright Inspector](https://playwright.dev/docs/running-tests#debug-tests-with-the-playwright-inspector):

```bash
npm run test-debug
```

Exibe no navegador o relatório do último teste executado:

```bash
npm run show-report
```

## Design Patterns utilizados

### Page Object Model

Utilizei o design pattern Page Object Model (POM) que ajuda a evitar duplicação de código, melhora a manutenibilidade e simplifica interações entre páginas e múltiplos testes, mantendo os testes e localizadores de elementos separados, usando um conceito de código limpo para facilitar o entendimento e a manutenção.

### Path Mapping

Typescript criou a ferramenta [path mapping](https://blog.rocketseat.com.br/path-mapping-typescript/) que permite mapear os módulos da aplicação e criar atalhos para essas pastas/arquivos de maneira escalável.

Dentro do arquivo `tsconfig.json`, foi declarado o path `"@/*": ["src/*"]` dentro da propriedade `compilersOptions`, de forma a evitar o problema do "SlashPathHell": `../../../path/to/file`, assim facilita a importação e melhorando a legibilidade do código:

```typescript
import { NavBar } from '@/page-objects';
```

### Barrels

Outra forma de facilitar a importação de arquivos e a legibilidade do código com o uso de [Barrels](http://cangaceirojavascript.com.br/barrels-simplificando-importacoes-de-modulos/).

Dentro da pasta `page-objects/` é criado o arquivo `index.ts`, se tornando o módulo padrão procurado quando utilizamos a instrução `import` apenas com o nome da pasta.

No módulo `index.js`, são exportados todos os artefatos de todos os módulos que fazem parte de `page-objects/` e suas subpastas (cada subpasta também tem o seu `index.ts`)

```typescript
// ficando:
import { Entrar, NavBar } from '@/page-objects';

// em vez de:
import { Entrar } from '@/page-objects/Entrar';
import { NavBar } from '@/page-objects/components/NavBar';
```

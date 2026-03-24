import { test, expect } from '@playwright/test';

/**
 * Suite E2E de Autenticação.
 *
 * Pré-requisito: app rodando em localhost:4200.
 *   - Ambiente real:    npm run start
 *   - Ambiente local:   npm run start:local  (Firebase Emulator)
 *
 * Para o cenário de login bem-sucedido, defina variáveis de ambiente:
 *   TEST_EMAIL=seu@email.com TEST_PASSWORD=SuaSenha@123 npx playwright test
 *
 * Com o emulador, os dados são efêmeros e resetam ao reiniciar o processo.
 */

const EMAIL_TESTE = process.env['TEST_EMAIL'] ?? '';
const SENHA_TESTE = process.env['TEST_PASSWORD'] ?? '';

/** Retorna o textbox de e-mail (input real, não o host app-campo). */
const campoEmail = (page: import('@playwright/test').Page) =>
  page.getByRole('textbox', { name: 'seu@email.com' });

/** Retorna o textbox de senha. */
const campoSenha = (page: import('@playwright/test').Page) =>
  page.getByRole('textbox', { name: 'Mínimo 8 caracteres' });

test.describe('Autenticação — Guard de Rota', () => {
  test('redireciona /dashboard para /auth/login quando não autenticado', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/auth/login', { timeout: 8_000 });
    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByRole('heading', { name: 'RH Seleção' })).toBeVisible();
  });
});

test.describe('Autenticação — Validações do Formulário de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'RH Seleção' })).toBeVisible();
  });

  test('exibe erro para e-mail em formato inválido', async ({ page }) => {
    await campoEmail(page).fill('emailinvalido');
    await campoEmail(page).blur();
    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  });

  test('exibe erro para e-mail obrigatório vazio', async ({ page }) => {
    await campoEmail(page).focus();
    await campoEmail(page).blur();
    await expect(page.getByText('Campo obrigatório.').first()).toBeVisible();
  });

  test('exibe erro de regex para senha fraca', async ({ page }) => {
    await campoSenha(page).fill('123');
    await campoSenha(page).blur();
    await expect(
      page.getByText('Mínimo 8 caracteres com maiúsculas, minúsculas e número.')
    ).toBeVisible();
  });

  test('mantém botão Entrar desabilitado com formulário inválido', async ({ page }) => {
    await campoEmail(page).fill('emailinvalido');
    await campoSenha(page).fill('123');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeDisabled();
  });

  test('habilita botão Entrar com formulário válido', async ({ page }) => {
    await campoEmail(page).fill('valido@email.com');
    await campoSenha(page).fill('Senha@123');
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeEnabled();
  });

  test('exibe erro do Firebase para credenciais inexistentes', async ({ page }) => {
    await campoEmail(page).fill('naocadastrado@email.com');
    await campoSenha(page).fill('Senha@123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/auth\/login/);
  });
});

test.describe('Autenticação — Login Bem-sucedido', () => {
  test.skip(!EMAIL_TESTE || !SENHA_TESTE, 'Defina TEST_EMAIL e TEST_PASSWORD para rodar este teste');

  test('redireciona para /dashboard após login válido', async ({ page }) => {
    await page.goto('/auth/login');
    await campoEmail(page).fill(EMAIL_TESTE);
    await campoSenha(page).fill(SENHA_TESTE);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('redireciona /auth/login para /dashboard quando já autenticado', async ({ page }) => {
    await page.goto('/auth/login');
    await campoEmail(page).fill(EMAIL_TESTE);
    await campoSenha(page).fill(SENHA_TESTE);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL('**/dashboard', { timeout: 10_000 });

    await page.goto('/auth/login');
    await page.waitForURL('**/dashboard', { timeout: 5_000 });
    await expect(page).toHaveURL(/dashboard/);
  });
});

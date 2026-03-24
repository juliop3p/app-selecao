import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração global do Playwright para testes E2E.
 *
 * Roda contra o ng serve local (porta 4200).
 * Configura um único browser (Chromium) para execução rápida.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 15_000,

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

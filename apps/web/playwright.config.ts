import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    // ローカルは Docker Compose の Caddy（https://localhost）に対して実行する
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://localhost",
    // ローカルの証明書は Caddy の内部 CA で発行されるため
    ignoreHTTPSErrors: true,
  },
  // Chrome と Safari（WebKit）で確認する（architecture.md 2.2）
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});

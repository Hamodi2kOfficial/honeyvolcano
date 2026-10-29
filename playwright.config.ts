import { defineConfig, devices } from "@playwright/test";

/**
 * The suite runs against the exported site (out/), served by
 * scripts/serve-out.js — the same files Netlify publishes, so a test failure
 * is a failure a visitor would have seen.
 *
 *   npm run build && npm test
 */
const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE,
    trace: "retain-on-failure",
    // Motion is decorative everywhere; without this the suite spends its time
    // waiting for reveals rather than checking what they reveal.
    reducedMotion: "reduce",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: `node scripts/serve-out.js ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

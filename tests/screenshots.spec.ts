import { test, type Page } from "@playwright/test";
import path from "node:path";

/**
 * Not assertions — evidence.
 *
 * Captures the site at every width in the brief, in both themes, into
 * test-results/screenshots/. Run it on its own:
 *
 *   npx playwright test tests/screenshots.spec.ts --project=desktop
 */
const OUT = path.join(process.cwd(), "test-results", "screenshots");

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const PAGES = [
  { path: "/", name: "home" },
  { path: "/products/", name: "products" },
  { path: "/where-to-buy/", name: "where-to-buy" },
  { path: "/about/", name: "about" },
  { path: "/contact/", name: "contact" },
  { path: "/privacy/", name: "privacy" },
  { path: "/under-construction/", name: "under-construction" },
];

async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

test.describe.configure({ mode: "serial" });

test.skip(({ isMobile }) => isMobile, "capture once, from the desktop project");

for (const theme of ["dark", "light"] as const) {
  for (const width of WIDTHS) {
    test(`capture ${theme} at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width, height: Math.round(width * 1.6) },
        deviceScaleFactor: 2,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.addInitScript((t) => localStorage.setItem("hv-theme", t), theme);

      for (const target of PAGES) {
        await page.goto(target.path);
        await settle(page);

        // The first screen — what the visitor actually lands on.
        await page.screenshot({
          path: path.join(OUT, `${target.name}-${width}-${theme}-fold.png`),
          fullPage: false,
        });

        // And the whole page, for the sections further down.
        await page.screenshot({
          path: path.join(OUT, `${target.name}-${width}-${theme}-full.png`),
          fullPage: true,
        });
      }

      await context.close();
    });
  }
}

test("capture the navigation bar, open and closed", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(600);
  await page.locator("header").screenshot({ path: path.join(OUT, "navbar-desktop.png") });
  await context.close();

  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const small = await phone.newPage();
  await small.goto("/");
  await small.getByRole("button", { name: /menu/i }).first().click();
  await small.waitForTimeout(700);
  await small.screenshot({ path: path.join(OUT, "navbar-mobile-open.png") });
  await phone.close();
});

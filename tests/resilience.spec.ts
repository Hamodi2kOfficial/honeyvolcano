import { expect, test, type Page } from "@playwright/test";

/**
 * The site on a device that cannot keep up, and the language swap.
 *
 * Every scroll reveal is server-rendered at `opacity: 0` and waits for motion
 * to bring it in — 65 elements on the home page. If motion never runs, the
 * visitor reads a blank page, the Call to taste among the things missing. That
 * is what an old phone was showing, and anyone whose scripts failed or timed
 * out on a slow connection.
 */

const READY = "html[data-hv-ready]";

async function lightsOn(page: Page) {
  await page.waitForSelector(READY, { state: "attached" });
}

test.describe("the page survives its own animations not running", () => {
  test("with scripts switched off, the site is still readable and callable", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();

    for (const path of ["/", "/products/", "/about/", "/where-to-buy/"]) {
      await page.goto(path);
      await page.waitForTimeout(500);

      // The whole point of the site: the phone number has to be reachable.
      // Not `.first()` — the navigation bar's own call button is display:none
      // on a phone and comes first in the document.
      const tel = page.locator('a[href^="tel:"]:visible');
      expect(
        await tel.count(),
        `${path}: no phone number anyone could tap, without scripts`
      ).toBeGreaterThan(0);

      await expect(
        page.locator("h1, h2").first(),
        `${path}: the page is blank without scripts`
      ).toBeVisible();
    }
    await ctx.close();
  });

  test("a browser without IntersectionObserver is shown everything at once", async ({
    browser,
  }) => {
    const ctx = await browser.newContext();
    // Take it away before any of the page's own code runs, the way an old
    // browser would arrive.
    await ctx.addInitScript(() => {
      // @ts-expect-error - deliberately removing it
      delete window.IntersectionObserver;
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(1500);

    // The stub observer means the page comes up properly rather than
    // throwing: without it motion raises a ReferenceError, hydration dies
    // with it, and React strips <html> bare on the way down.
    await expect(
      page.locator("html"),
      "the page never came alive without IntersectionObserver"
    ).toHaveAttribute("data-hv-ready", "1");

    const tel = page.locator('a[href^="tel:"]:visible');
    expect(
      await tel.count(),
      "no phone number on a browser without IntersectionObserver"
    ).toBeGreaterThan(0);

    const faded = await page.evaluate(
      () =>
        [...document.querySelectorAll("h1, h2, main p")].filter((el) => {
          let n: HTMLElement | null = el as HTMLElement;
          let least = 1;
          while (n && n !== document.body) {
            least = Math.min(least, Number(getComputedStyle(n).opacity));
            n = n.parentElement;
          }
          return least < 0.9;
        }).length
    );
    expect(faded, "content is still hidden on a browser that cannot reveal it").toBe(
      0
    );
    await ctx.close();
  });

  test("the failsafe stays out of the way on a browser that works", async ({
    page,
  }) => {
    await page.goto("/");
    await lightsOn(page);
    await page.waitForTimeout(1200);
    expect(
      await page.locator("#hv-failsafe").count(),
      "the failsafe fired on a healthy browser and killed the animations"
    ).toBe(0);
  });
});

test.describe("changing language", () => {
  test.use({ reducedMotion: "no-preference" });

  async function pickLithuanian(page: Page) {
    const trigger = page.locator("button[data-lang-picker]:visible");
    if ((await trigger.count()) === 0) {
      await page.locator('button[aria-controls="hv-menu"]').click();
      await page.waitForTimeout(400);
    }
    if ((await trigger.count()) > 0) await trigger.first().click();
    await page.getByRole("option").filter({ hasText: "Lietuvių" }).first().click();
  }

  test("the words fade rather than snap, and come all the way back", async ({
    page,
  }) => {
    await page.goto("/");
    await lightsOn(page);
    await page.waitForTimeout(800);

    const opacity = () =>
      page.evaluate(() =>
        Number(getComputedStyle(document.querySelector("main")!).opacity)
      );
    expect(await opacity(), "the page did not start solid").toBeGreaterThan(0.95);

    // Watched with a MutationObserver rather than by sampling frames.
    // requestAnimationFrame runs at roughly 20fps here, so a 140ms fade is
    // three frames and polling misses it at random — it is the measurement
    // that is unreliable, not the fade.
    await page.evaluate(() => {
      const w = window as unknown as { __swapped: boolean };
      w.__swapped = false;
      new MutationObserver(() => {
        if (document.documentElement.classList.contains("hv-lang-swap")) {
          w.__swapped = true;
        }
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    await pickLithuanian(page);
    await page.waitForTimeout(700);

    expect(
      await page.evaluate(
        () => (window as unknown as { __swapped: boolean }).__swapped
      ),
      "the language changed with no transition at all"
    ).toBe(true);

    // And that the class is what actually dims the page, rather than being
    // set and doing nothing.
    await page.evaluate(() => document.documentElement.classList.add("hv-lang-swap"));
    await expect
      .poll(opacity, { timeout: 2000, message: "the swap class does not dim the page" })
      .toBeLessThan(0.95);
    await page.evaluate(() =>
      document.documentElement.classList.remove("hv-lang-swap")
    );

    // And it must always come back — a page left faded would be a disaster.
    await expect
      .poll(opacity, { timeout: 3000, message: "the page stayed faded out" })
      .toBeGreaterThan(0.95);

    await expect(page.locator("html")).toHaveAttribute("lang", "lt");
    await expect(
      page.locator("html"),
      "the swap class was left behind"
    ).not.toHaveClass(/hv-lang-swap/);
  });

  test("tapping through languages quickly cannot leave the page faded", async ({
    page,
  }) => {
    await page.goto("/");
    await lightsOn(page);
    await page.waitForTimeout(800);

    const trigger = page.locator("button[data-lang-picker]:visible");
    const options = page.getByRole("option");
    for (const name of ["Lietuvių", "Русский", "Polski", "English"]) {
      // Open whatever needs opening, but only if the list is not already
      // there: on a phone it lives in the drawer, which stays open between
      // choices, and pressing the menu button again would shut it.
      if ((await options.count()) === 0) {
        if ((await trigger.count()) > 0) {
          await trigger.first().click();
        } else {
          await page.locator('button[aria-controls="hv-menu"]').click();
          await page.waitForTimeout(300);
        }
      }
      await options.filter({ hasText: name }).first().click();
      await page.waitForTimeout(60); // faster than the swap finishes, on purpose
    }

    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Number(getComputedStyle(document.querySelector("main")!).opacity)
          ),
        { timeout: 3000, message: "rapid switching left the page faded out" }
      )
      .toBeGreaterThan(0.95);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("a visitor who asked for no motion gets no fade", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await lightsOn(page);
    await page.waitForTimeout(600);

    await pickLithuanian(page);
    // Checked straight away: there should be nothing to catch.
    const op = await page.evaluate(() =>
      Number(getComputedStyle(document.querySelector("main")!).opacity)
    );
    expect(op, "the page faded for someone who asked for no motion").toBeGreaterThan(
      0.95
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "lt");
    await ctx.close();
  });
});

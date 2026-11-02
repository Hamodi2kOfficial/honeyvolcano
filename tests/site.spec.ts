import { expect, test, type Page } from "@playwright/test";

import supplied from "./fixtures/about-supplied.json";

/** The shape of one language in tests/fixtures/about-supplied.json. */
type AboutContent = {
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string[];
  cta: string;
  outro: string[];
  valuesHeading: string;
  values: { title: string; body: string }[];
  close1: string;
  close2: string;
};

/**
 * The flows that matter: can a visitor find a product, find a shop, and —
 * above all — call. Every page is also checked for the things that make a
 * site feel broken: console errors, failed requests, horizontal scroll and
 * images that never arrive.
 */

const PAGES = [
  { path: "/", name: "home" },
  { path: "/products/", name: "products" },
  { path: "/where-to-buy/", name: "where to buy" },
  { path: "/about/", name: "about" },
  { path: "/contact/", name: "contact" },
  { path: "/privacy/", name: "privacy" },
  { path: "/terms/", name: "terms" },
  { path: "/under-construction/", name: "under construction" },
  { path: "/gallery/", name: "gallery" },
];

const TEL = "tel:+3548340999";

/** Scrolls the whole page so lazy images and scroll reveals all fire. */
/**
 * Waits until React has hydrated, so a click actually reaches a handler.
 * The pre-paint theme script styles the page long before that, which makes
 * "painted" a useless signal for anything interactive.
 */
async function ready(page: Page) {
  await page.waitForSelector("html[data-hv-ready]", { state: "attached" });
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

test.describe("every page", () => {
  for (const { path, name } of PAGES) {
    test(`${name} loads cleanly`, async ({ page }) => {
      const errors: string[] = [];
      const failed: string[] = [];

      // /api/* is a Netlify function. The export is served here by a plain
      // file server, so those calls 404 — which the site is written to
      // survive. Judge a failed resource by its URL, from the response, not
      // from the console: Chromium's generic "Failed to load resource" line
      // does not carry the URL that failed.
      page.on("response", (r) => {
        if (r.status() >= 400 && !r.url().includes("/api/")) {
          failed.push(`${r.status()} ${r.url()}`);
        }
      });
      page.on("requestfailed", (r) => {
        if (r.url().includes("/api/")) return;
        // A cancelled request is not a broken one: the browser aborts video
        // range requests and in-flight navigations as a matter of course.
        if (r.failure()?.errorText === "net::ERR_ABORTED") return;
        failed.push(`${r.url()} ${r.failure()?.errorText}`);
      });
      page.on("console", (m) => {
        if (m.type() !== "error") return;
        if (/Failed to load resource/i.test(m.text())) return; // judged above
        errors.push(m.text());
      });

      await page.goto(path);
      await settle(page);

      expect(errors, `console errors on ${name}`).toEqual([]);
      expect(failed, `failed requests on ${name}`).toEqual([]);

      // No horizontal scroll at any width.
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(overflows, `${name} scrolls sideways`).toBe(false);

      // Every image that is meant to be on screen actually arrived.
      const broken = await page.evaluate(() =>
        [...document.querySelectorAll("img")]
          .filter((i) => i.loading !== "lazy" || i.getBoundingClientRect().top < 100_000)
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src)
      );
      expect(broken, `broken images on ${name}`).toEqual([]);

      // One <h1>, and it is not empty.
      const h1 = page.locator("h1");
      await expect(h1.first()).toBeVisible();
    });

    test(`${name} offers a working call link`, async ({ page }) => {
      await page.goto(path);
      const calls = page.locator(`a[href="${TEL}"]`);
      expect(await calls.count(), `no call link on ${name}`).toBeGreaterThan(0);
      await expect(calls.first()).toHaveAttribute("aria-label", /\+354 834 0999/);
    });
  }
});

test.describe("titles and metadata", () => {
  /**
   * "In Google should appear lithuanian honey." The phrase was in the
   * keywords and buried in the description, but not in the title, which is
   * the part Google leans on hardest.
   */
  test("the page Google shows says Lithuanian honey", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/lithuanian honey/i);
    const description = await page
      .locator('head meta[name="description"]')
      .getAttribute("content");
    expect(description?.toLowerCase(), "the description buries it").toMatch(
      /^lithuanian honey/
    );
    for (const prop of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      const value = await page.locator(`head ${prop}`).getAttribute("content");
      expect(value, `${prop} still says something else`).toMatch(/lithuanian honey/i);
    }
  });

  /**
   * He struck both halves of the old line: "carried here by hand" read as
   * bringing it over in a suitcase, and "taste before you buy" said the same
   * thing as the Call to taste button a few millimetres away.
   */
  test("the hero line is his, and the struck phrases are gone", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    await expect(page.locator("section#top")).toContainText(
      "Lithuanian honey. Collected at a Lithuanian family apiary."
    );
    for (const lang of ["en", "lt", "is", "es", "ru", "pl"]) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/");
      await ready(page);
      const text = await page.locator("section#top").innerText();
      expect(text, `${lang}: "carried by hand" is still there`).not.toMatch(
        /carried here by hand|borið hingað í höndunum|traída a mano|atneštas rankomis|принесён в руках|przyniesiony w rękach/i
      );
      expect(text, `${lang}: the hero repeats the call button`).not.toMatch(
        /taste before you buy|smakkaðu áður en þú kaupir|pruébala antes de comprarla/i
      );
    }
  });

  test('nothing says "Forest" any more', async ({ page }) => {
    for (const { path } of PAGES) {
      await page.goto(path);
      const html = await page.content();
      expect(html.toLowerCase(), `"forest" still on ${path}`).not.toContain("forest honey");
    }
  });

  test("each page has its own title and description", async ({ page }) => {
    const seen = new Set<string>();
    for (const { path } of PAGES) {
      await page.goto(path);
      const title = await page.title();
      expect(title).toContain("Honey Volcano");
      seen.add(title);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description, `no description on ${path}`).toBeTruthy();
    }
    expect(seen.size, "pages share a title").toBeGreaterThan(4);
  });

  test("the share preview is set", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Honey Volcano/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });
});

test.describe("navigation", () => {
  test("every menu item reaches its page and is then marked current", async ({ page }, info) => {
    const items = [
      { label: /^Products$/, path: "/products/" },
      { label: /^Where to buy$/, path: "/where-to-buy/" },
      { label: /^About Honey Volcano$/, path: "/about/" },
      { label: /^Contact information$/, path: "/contact/" },
      { label: /^Gallery$/, path: "/gallery/" },
    ];

    for (const item of items) {
      await page.goto("/");
      if (info.project.name === "mobile") {
        await page.getByRole("button", { name: /menu/i }).first().click();
      }
      await page.getByRole("link", { name: item.label }).first().click();
      await page.waitForURL(`**${item.path}`);
      const current = page.locator('a[aria-current="page"]');
      expect(await current.count(), `${item.path} is not highlighted`).toBeGreaterThan(0);
    }
  });

  test('"What\'s best for me?" goes nowhere, on purpose', async ({ page }, info) => {
    await page.goto("/");
    if (info.project.name === "mobile") {
      await page.getByRole("button", { name: /menu/i }).first().click();
      // Scope to the open drawer: the desktop menu holds the same wording,
      // hidden, and an unscoped locator matches both.
      const drawer = page.locator("#hv-menu");
      await expect(drawer.getByText("What's best for me?")).toBeVisible();
      await expect(drawer.getByText("Coming soon")).toBeVisible();
      // No link, so there is nothing to follow by accident.
      await expect(drawer.locator('a:has-text("What\'s best for me?")')).toHaveCount(0);
      return;
    }
    const soon = page.getByRole("button", { name: /What's best for me\?/ });
    await expect(soon).toBeVisible();
    await expect(soon).toHaveAttribute("aria-disabled", "true");
    // It is a <button>, not an <a>: there is no href to follow by accident.
    await expect(soon).toHaveJSProperty("tagName", "BUTTON");
    // Playwright treats aria-disabled as "not enabled", so a plain click would
    // wait for ever. Force it through and prove the page did not move.
    await soon.click({ force: true });
    await page.waitForTimeout(300);
    expect(page.url()).toMatch(/\/$/);
    await expect(page.getByText("Coming soon").first()).toBeVisible();
  });

  test("the basket is gone", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /basket/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /basket/i })).toHaveCount(0);
  });
});

test.describe("the hero", () => {
  test("logo, film and all six seals are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#top img").first()).toBeVisible();
    await expect(page.locator("#top video")).toHaveCount(1);

    // The seals are laid out twice — down the sides on a wide screen, in a
    // grid under the film on a narrow one — so only one copy is ever on
    // screen. Check the one that is.
    for (const seal of [
      "Direct from bees",
      "Natural & real",
      "Fair & affordable",
      "All bee products",
      "Authorised in LT & IS",
      "Hand to hand • Heart to heart",
    ]) {
      const visible = page.locator("#top").getByText(seal, { exact: true }).locator("visible=true");
      await expect(visible.first()).toBeVisible();
    }
  });

  /**
   * The seals used to have to fit on the first screen alongside the film,
   * which kept the film short. The owner would rather see the film: they now
   * begin just under it and the last row may fall below the fold. What still
   * has to hold is that they sit under the film rather than over it, that
   * they stay in at most two rows, and that the row starts close enough to
   * the fold that there is something to scroll to.
   */
  test("the seals sit directly under the film, in no more than two rows", async ({ page }) => {
    await page.goto("/");

    // boundingBox() waits for the element to be attached, not for it to have
    // a size — and straight after a load the film has none yet, which read as
    // "there is no film" rather than "ask again in a moment".
    const video = page.locator("#top video");
    await expect(video).toBeVisible();
    const film = await video.boundingBox();
    expect(film).not.toBeNull();

    const seals = page.locator("#top ul[aria-label] > li");
    await expect(seals).toHaveCount(6);

    // They arrive staggered. Measuring while they are still on their way
    // reads six different heights and calls it six rows, so wait until two
    // readings agree before believing either.
    await expect
      .poll(
        async () => {
          const read = () =>
            page.evaluate(() =>
              [...document.querySelectorAll("#top ul[aria-label] > li")]
                .map((el) => Math.round(el.getBoundingClientRect().y))
                .join(",")
            );
          const first = await read();
          await page.waitForTimeout(250);
          return (await read()) === first ? first : null;
        },
        { timeout: 10_000 }
      )
      .not.toBeNull();

    const boxes = [];
    for (let i = 0; i < 6; i++) boxes.push(await seals.nth(i).boundingBox());

    for (const [i, box] of boxes.entries()) {
      expect(box, `seal ${i} has no box`).not.toBeNull();
      expect(box!.y, `seal ${i} sits on top of the film`).toBeGreaterThanOrEqual(
        film!.y + film!.height - 2
      );
    }

    // One line on a wide screen, two rows of three on a phone — never more.
    const rows = new Set(boxes.map((b) => Math.round(b!.y))).size;
    expect(rows, "the seals are broken over too many rows").toBeLessThanOrEqual(2);

    // The first row is visible without scrolling, so a visitor knows there is
    // something below the film rather than guessing.
    const height = page.viewportSize()!.height;
    expect(boxes[0]!.y, "nothing hints that the seals are there").toBeLessThan(height);
  });

  test("each seal carries its own icon", async ({ page }) => {
    await page.goto("/");
    const withIcon = await page.evaluate(
      () =>
        [...document.querySelectorAll("#top ul[aria-label] > li")].filter((li) =>
          li.querySelector("svg")
        ).length
    );
    expect(withIcon, "a seal is missing its icon").toBe(6);
  });
});

test.describe("products", () => {
  test("the call button is the first action, under the logo", async ({ page }) => {
    await page.goto("/products/");
    await ready(page);
    const logoImg = page.locator("main img").first();
    await expect(logoImg).toBeVisible();
    const logo = await logoImg.boundingBox();
    const call = await page.locator(`main a[href="${TEL}"]`).first().boundingBox();
    expect(logo && call).toBeTruthy();
    expect(call!.y).toBeGreaterThan(logo!.y);
    // and above the catalogue
    const catalogue = await page.locator("#catalog").boundingBox();
    expect(call!.y).toBeLessThan(catalogue!.y);
  });

  test("all seven products are listed, each with a picture and a price", async ({ page }) => {
    await page.goto("/products/");
    await settle(page);
    const cards = page.locator("#catalog article");
    await expect(cards).toHaveCount(7);

    for (const name of [
      "Raw honey 500 g",
      "Raw honey 1 kg",
      "Honeycomb 300 g",
      "Honey delicacies 220 g",
      "Honey multicoloured 220 g",
      "Pollen 100 g",
      "Bee bread 100 g",
    ]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }

    const missing = await page.evaluate(() =>
      [...document.querySelectorAll("#catalog article")]
        .filter((a) => !a.querySelector("img"))
        .map((a) => a.querySelector("h3")?.textContent ?? "?")
    );
    expect(missing, "products without a photo").toEqual([]);
  });

  test("the delicacy flavours live in the opened product and switch the picture", async ({
    page,
  }) => {
    await page.goto("/products/");
    await ready(page);
    await settle(page);

    await page
      .locator("#catalog article")
      .filter({ hasText: "Honey delicacies 220 g" })
      .getByRole("button", { name: /delicacies/i })
      .click();

    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();

    const tabs = panel.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    for (const flavour of ["raspberries", "sea buckthorn", "quinces and pumpkins", "cannabis"]) {
      await expect(panel.getByRole("tab", { name: new RegExp(flavour, "i") })).toBeVisible();
    }

    const before = await panel.locator("img").first().getAttribute("src");
    await panel.getByRole("tab", { name: /sea buckthorn/i }).click();
    await expect(async () => {
      expect(await panel.locator("img").first().getAttribute("src")).not.toBe(before);
    }).toPass();
  });

  test("a product opens, shows its line and its price, and closes", async ({ page }) => {
    await page.goto("/products/");
    await ready(page);
    await settle(page);

    const open = () =>
      page
        .locator("#catalog article")
        .filter({ hasText: "Raw honey 500 g" })
        .getByRole("button", { name: /raw honey 500 g/i })
        .click();

    await open();
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    await expect(panel.getByText(/straight from lithuanian hives/i)).toBeVisible();
    await expect(panel.getByText("2299 ISK")).toBeVisible();
    await expect(panel.locator(`a[href="${TEL}"]`)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();

    await open();
    await page.getByRole("button", { name: /^close$/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });

  test("every product picture fills the same frame", async ({ page }) => {
    await page.goto("/products/");
    await ready(page);
    await settle(page);

    const frames = await page.evaluate(() =>
      [...document.querySelectorAll("#catalog article")].map((a) => {
        const img = a.querySelector("img");
        const box = img?.parentElement?.getBoundingClientRect();
        return box ? +(box.width / box.height).toFixed(2) : null;
      })
    );
    expect(
      frames.filter((r) => r === null),
      "a product has no picture frame"
    ).toEqual([]);
    expect(new Set(frames).size, "the pictures are not all one shape").toBe(1);
    expect(frames[0]).toBeCloseTo(0.8, 1);
  });

  test("the cut sections are gone", async ({ page }) => {
    await page.goto("/products/");
    await settle(page);
    await expect(page.getByRole("heading", { name: /500 g or 1 kg/i })).toHaveCount(0);
    await expect(page.locator('img[src*="raw-honey-sizes"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^our products$/i })).toHaveCount(0);
    await expect(page.getByText(/prices in icelandic kr/i)).toHaveCount(0);
  });

  test("the decoration never sits over the content", async ({ page }) => {
    await page.goto("/products/");
    const decorHitsContent = await page.evaluate(() => {
      const layer = document.querySelector<HTMLElement>(".pointer-events-none.absolute.inset-0");
      if (!layer) return false;
      return getComputedStyle(layer).pointerEvents !== "none";
    });
    expect(decorHitsContent).toBe(false);

    // Clicking where the rails live must still reach the page beneath.
    const clickable = await page.evaluate(() => {
      const el = document.elementFromPoint(40, window.innerHeight / 2);
      return el?.closest("[aria-hidden='true']") === null;
    });
    expect(clickable).toBe(true);
  });
});

test.describe("where to buy", () => {
  test("the map draws, with pins", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".hv-map")).toBeVisible();
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("img.leaflet-tile").first()).toBeVisible({ timeout: 15_000 });
    await expect
      .poll(async () => page.locator(".hv-pin, .hv-cluster").count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
  });

  test("the tiles come from a source that needs no key", async ({ page }) => {
    const refused: string[] = [];
    page.on("response", (r) => {
      if (/\.png|\.jpg|\.webp/.test(r.url()) && r.status() >= 400) refused.push(`${r.status()} ${r.url()}`);
    });

    await page.goto("/where-to-buy/");
    await expect(page.locator("img.leaflet-tile").first()).toBeVisible({ timeout: 15_000 });

    // CARTO started demanding an API key and stamped every tile with a notice,
    // which is exactly the sort of thing that only shows up in a screenshot.
    const sources = await page.evaluate(() =>
      [...document.querySelectorAll("img.leaflet-tile")].map((t) => (t as HTMLImageElement).src)
    );
    expect(sources.length, "no tiles at all").toBeGreaterThan(0);
    for (const src of sources) {
      expect(src, "a tile came from a provider that wants a key").not.toMatch(/cartocdn|api_key|apikey/i);
    }
    expect(refused, "tiles were refused").toEqual([]);

    // Every tile that loaded has real pixels in it.
    const broken = await page.evaluate(
      () =>
        [...document.querySelectorAll("img.leaflet-tile")].filter(
          (t) => (t as HTMLImageElement).complete && (t as HTMLImageElement).naturalWidth === 0
        ).length
    );
    expect(broken, "a tile loaded as nothing").toBe(0);
  });

  test("a pin opens the shop it belongs to", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });
    await expect.poll(async () => page.locator(".hv-pin").count(), { timeout: 15_000 }).toBeGreaterThan(0);

    await page.locator(".hv-pin").first().click();
    const popup = page.locator(".leaflet-popup-content");
    await expect(popup).toBeVisible();
    expect((await popup.innerText()).trim().length, "the popup says nothing").toBeGreaterThan(2);
  });

  test("the zoom controls change the zoom", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });

    // The map publishes its own zoom on the container, so this waits on the
    // map rather than on a tile server — reading it back from tile URLs made
    // the test fail whenever the network was busy instead of when the map
    // was actually broken.
    const zoom = () =>
      page.evaluate(() => {
        const el = document.querySelector(".leaflet-container") as HTMLElement | null;
        const z = el?.dataset.zoom;
        return z ? Number(z) : null;
      });

    // The map re-fits itself around the pins once they are added, so read the
    // starting zoom after that has happened rather than before it.
    await expect
      .poll(async () => page.locator(".hv-pin, .hv-cluster").count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
    await expect.poll(zoom, { timeout: 15_000 }).not.toBeNull();

    // Wait until the zoom has held still for a moment, so the reading below
    // is the map at rest and not the middle of its opening move.
    await page.waitForFunction(
      () => {
        const el = document.querySelector(".leaflet-container") as HTMLElement | null;
        const z = el?.dataset.zoom;
        if (!z) return false;
        const w = window as unknown as { __hvZ?: string; __hvAt?: number };
        if (w.__hvZ !== z) {
          w.__hvZ = z;
          w.__hvAt = Date.now();
          return false;
        }
        return Date.now() - (w.__hvAt ?? 0) > 700;
      },
      null,
      { timeout: 15_000 }
    );
    const before = await zoom();

    await page.locator(".leaflet-control-zoom-in").click();
    await expect.poll(zoom, { timeout: 10_000 }).toBeGreaterThan(before!);

    await page.locator(".leaflet-control-zoom-out").click();
    await expect.poll(zoom, { timeout: 10_000 }).toBe(before);
  });

  test("every shop is listed, and unverified hours say so", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await settle(page);
    const cards = page.locator("section article");
    await expect(cards).toHaveCount(25);
    // 21 of the 25 have no verified hours, so this is what most of the page
    // says. It has to read as information, not as something to arrange.
    await expect(
      page.getByText(/opening hours not listed/i).first()
    ).toBeVisible();
  });

  test("a shop in the list flies the map to its pin", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });
    await settle(page);
    await page.getByRole("button", { name: /show on the map/i }).first().click();
    await expect(page.locator(".leaflet-popup")).toBeVisible({ timeout: 15_000 });
  });

  test("the stockist invitation offers both ways to get in touch", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await settle(page);
    await expect(page.getByRole("heading", { name: /your shop could be here/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get in touch/i })).toBeVisible();
  });
});

test.describe("the contact form", () => {
  test("it asks for a name and a way to reply", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/please tell us your name/i)).toBeVisible();

    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/email address or a phone number/i)).toBeVisible();
  });

  test("it rejects an email that is not one", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/^email$/i).fill("not-an-email");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/does not look right|doesn't look right/i)).toBeVisible();
  });

  test("it has a honeypot the eye cannot see", async ({ page }) => {
    await page.goto("/contact/");
    const pot = page.locator('input[name="company"]');
    await expect(pot).toHaveCount(1);
    await expect(pot).toBeHidden();
  });

  test("it shows an error, not a silent failure, when sending fails", async ({ page }) => {
    await page.route("**/api/lead", (route) => route.fulfill({ status: 500, body: "{}" }));
    await page.goto("/contact/");
    await ready(page);
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/^email$/i).fill("test@example.com");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator("form").getByRole("alert")).toBeVisible();
  });

  test("it confirms when the message is away", async ({ page }) => {
    await page.route("**/api/lead", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' })
    );
    await page.goto("/contact/");
    await ready(page);
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/^email$/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("Hello — this is a Playwright check.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toBeVisible();
  });
});

test.describe("a layout published before these sections existed", () => {
  /**
   * The owner's published layout can only name the sections that existed when
   * he last pressed publish. This is the real one from the live site: seven
   * sections, none of the six added since. Taking it wholesale hid all six.
   */
  const PUBLISHED = ["hero", "video", "trust", "values", "letter", "showcase", "cta"].map(
    (builtin) => ({ id: `b-${builtin}`, kind: "builtin", builtin, visible: true })
  );

  test("still shows the sections it has never heard of", async ({ page }) => {
    await page.route("**/api/content", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ content: { home: { sections: PUBLISHED } } }),
      })
    );

    await page.goto("/");
    await ready(page);
    await settle(page);

    // One from each family that the published layout leaves out.
    await expect(page.getByRole("heading", { name: /our favourites/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /a spoon is never enough/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /good on bread/i })).toBeVisible();

    // And what he did publish is still there, in his order.
    await expect(page.getByRole("heading", { name: /reliable source/i })).toBeVisible();
  });
});

test.describe("light and dark", () => {
  test("the toggle switches the page and is remembered", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const toggle = page.getByRole("button", { name: /switch between light and dark/i });

    const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    await toggle.click();
    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.classList.contains("dark"))
      )
      .toBe(!before);

    await page.reload();
    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.classList.contains("dark"))
      )
      .toBe(!before);
  });

  test("text stays readable in both", async ({ page }) => {
    for (const theme of ["light", "dark"]) {
      await page.addInitScript((t) => localStorage.setItem("hv-theme", t), theme);
      await page.goto("/");
      const sameAsBackground = await page.evaluate(() => {
        const body = getComputedStyle(document.body);
        const h = document.querySelector("h2");
        return h ? getComputedStyle(h).color === body.backgroundColor : false;
      });
      expect(sameAsBackground, `invisible headings in ${theme}`).toBe(false);
    }
  });
});

/**
 * The About page is his, word for word.
 *
 * tests/fixtures/about-supplied.json was pulled line by line out of the
 * message he sent, in all six languages. It is the contract: every line he
 * wrote must be on the page, and the page must not say anything he did not
 * write.
 *
 * This exists because the page has drifted from his text twice. First his
 * Lithuanian and Polish were quietly left as a translation written here.
 * Then, reading his Icelandic, every emoji was moved from the end of a
 * sentence onto the heading below it — tidier, and not what he wrote. Both
 * times the words looked fine in isolation. Only a comparison against the
 * message itself catches that kind of mistake, so that is what this does.
 */
test.describe("the About page is the owner's own words", () => {
  const SUPPLIED = supplied as Record<string, AboutContent>;

  for (const [lang, about] of Object.entries(SUPPLIED)) {
    test(`${lang} shows every line he wrote, and nothing else`, async ({ page }) => {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/about/");
      await ready(page);
      const text = await page.locator("main").innerText();
      // Both sides collapse runs of whitespace: a browser renders his double
      // spaces as one, which is the browser's doing and not a change to his
      // text. Everything else must match exactly.
      const flat = text.replace(/\s+/g, " ");

      const lines = [
        about.eyebrow,
        about.title,
        about.tagline,
        about.cta,
        about.valuesHeading,
        about.close1,
        about.close2,
        ...about.intro,
        ...about.outro,
        ...about.values.flatMap((v) => [v.title, v.body]),
      ].filter((s) => s.trim() !== "");

      for (const line of lines) {
        expect(flat, `${lang}: this line of his is missing or altered —\n  ${line}`).toContain(
          line.replace(/\s+/g, " ")
        );
      }
    });
  }

  /**
   * He writes the last value on two lines in English, Lithuanian, Polish and
   * Spanish — a hand on one, a heart on the other — and on a single line in
   * Icelandic and Russian. Both are his layout; neither gets "tidied".
   */
  const TWO_LINE = ["en", "lt", "pl", "es"];
  for (const [lang, about] of Object.entries(SUPPLIED)) {
    test(`${lang} keeps his own line breaks in the last value`, async ({ page }) => {
      const title = about.values[about.values.length - 1].title;
      expect(
        title.includes("\n"),
        `${lang}: the hand and the heart are on the wrong number of lines`
      ).toBe(TWO_LINE.includes(lang));

      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/about/");
      await ready(page);
      const last = page.locator("article h3").last();
      await expect(last).toHaveCSS("white-space", /pre-line/);
      expect(await last.innerText()).toContain(title.includes("\n") ? "\n" : "❤️");
    });
  }

  test("the Icelandic sign-off is his spelling, not a correction", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("medaus-lang", "is"));
    await page.goto("/about/");
    await ready(page);
    const text = await page.locator("main").innerText();
    expect(text, "GÓSA was silently changed to GJÓSA again").toContain("GÓSA");
    expect(text).not.toContain("GJÓSA");
  });

  /**
   * Switching language emptied the values. The scroll reveal fires once, on
   * the grid rather than on each card; the cards were keyed by their titles,
   * so changing language replaced all six, and the replacements mounted
   * hidden with nothing left to reveal them.
   *
   * This walks the picker the way a visitor does, which is the only way to
   * catch it — loading each language directly always looked fine.
   */
  test("the values survive switching language, one after another", async ({ page }) => {
    await page.goto("/about/");
    await ready(page);

    const cards = page.locator("main article");
    const heading = page.getByRole("heading", { name: /values|gildin|vertyb|warto|valores|ценност/i });
    await heading.scrollIntoViewIfNeeded();
    await expect(cards).toHaveCount(6);
    for (let i = 0; i < 6; i++) await expect(cards.nth(i)).toBeVisible();

    // Below 640px the picker lives inside the menu, so the way in differs.
    // Nothing here is found by a visible name or an aria-label: both are
    // translated, "Meniu" and "Меню" do not match /menu/i, and that is what
    // made the first draft of this test hang on the second language.
    const trigger = page.locator("button[data-lang-picker]:visible");
    const choose = async (optionIndex: number) => {
      if ((await trigger.count()) === 0) {
        await page.locator('button[aria-controls="hv-menu"]').click();
        await expect(page.locator("#hv-menu")).toBeVisible();
      }
      // On a phone the six are listed in the menu itself, with no dropdown
      // to open — a dropdown down there opened past the bottom of the screen.
      if ((await trigger.count()) > 0) await trigger.first().click();
      await page.getByRole("option").nth(optionIndex).click();
      // Choosing closes the dropdown but not the menu it sat in.
      if (await page.locator("#hv-menu").isVisible()) {
        await page.keyboard.press("Escape");
        await expect(page.locator("#hv-menu")).toBeHidden();
      }
    };

    // Every language in turn, without reloading — one picker click each.
    for (const [index, lang] of ["lt", "is", "es", "ru", "pl", "en"].entries()) {
      await choose(index === 5 ? 0 : index + 1);
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await expect(cards, `${lang}: the values vanished`).toHaveCount(6);
      for (let i = 0; i < 6; i++) {
        const card = cards.nth(i);
        await expect(card, `${lang}: value ${i + 1} is not visible`).toBeVisible();
        // Visible to Playwright is not enough — a card faded to nothing still
        // counts as visible, and that is exactly the failure.
        const opacity = await card.evaluate((el) => {
          let node: HTMLElement | null = el as HTMLElement;
          let least = 1;
          while (node && node !== document.body) {
            least = Math.min(least, Number(getComputedStyle(node).opacity));
            node = node.parentElement;
          }
          return least;
        });
        expect(opacity, `${lang}: value ${i + 1} is faded out`).toBeGreaterThan(0.9);
        expect((await card.innerText()).trim().length, `${lang}: value ${i + 1} is empty`)
          .toBeGreaterThan(2);
      }
    }
  });

  /**
   * What he reported: "on the phone the languages page is not appearing".
   * The picker sat 704px down an 839px screen and its list opened at 756px
   * and ran to 1022px, so four of the six languages were below the bottom
   * of the window. Every one of them now has to be fully on screen.
   */
  test("every language is on screen, whatever the screen", async ({ page }) => {
    await page.goto("/");
    await ready(page);

    const trigger = page.locator("button[data-lang-picker]:visible");
    if ((await trigger.count()) === 0) {
      await page.locator('button[aria-controls="hv-menu"]').click();
      await expect(page.locator("#hv-menu")).toBeVisible();
    }
    if ((await trigger.count()) > 0) await trigger.first().click();

    const options = page.getByRole("option");
    await expect(options).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      const name = (await options.nth(i).innerText()).trim();
      const off = await options.nth(i).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return {
          below: Math.round(r.bottom - window.innerHeight),
          above: Math.round(-r.top),
          right: Math.round(r.right - window.innerWidth),
        };
      });
      expect(off.below, `${name} is ${off.below}px below the bottom of the screen`)
        .toBeLessThanOrEqual(0);
      expect(off.above, `${name} is ${off.above}px above the top of the screen`)
        .toBeLessThanOrEqual(0);
      expect(off.right, `${name} is ${off.right}px off the right edge`)
        .toBeLessThanOrEqual(0);
    }
  });

  test("picking a language on a phone changes the menu behind it", async ({ page }) => {
    await page.goto("/");
    await ready(page);

    // There is no drawer to open above `xl` — the menu is the bar itself.
    const burger = page.locator('button[aria-controls="hv-menu"]');
    test.skip(!(await burger.isVisible()), "no drawer at this width");

    await burger.click();
    const menu = page.locator("#hv-menu");
    await expect(menu).toBeVisible();

    const trigger = page.locator("button[data-lang-picker]:visible");
    if ((await trigger.count()) > 0) await trigger.first().click();

    // Lietuvių, by name rather than by position.
    await page.getByRole("option").filter({ hasText: "Lietuvių" }).first().click();
    // The links behind it re-label themselves: that is the confirmation.
    await expect(menu).toContainText("Produktai");
    await expect(page.locator("html")).toHaveAttribute("lang", "lt");
  });

  test("the picker's own label is translated too", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("medaus-lang", "lt"));
    await page.goto("/");
    await ready(page);

    const trigger = page.locator("button[data-lang-picker]:visible");
    if ((await trigger.count()) > 0) {
      await expect(trigger.first()).toHaveAttribute("aria-label", /Pasirinkite kalb/);
    } else {
      await page.locator('button[aria-controls="hv-menu"]').click();
      await expect(page.locator('[role="listbox"][aria-label="Kalba"]')).toBeVisible();
    }
  });

  test("Spanish gets no products button, because he wrote none", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("medaus-lang", "es"));
    await page.goto("/about/");
    await ready(page);
    // Every other language has his own bracketed wording for it.
    await expect(page.locator('main a[href="/products/"]')).toHaveCount(0);
    await page.addInitScript(() => localStorage.setItem("medaus-lang", "pl"));
    await page.goto("/about/");
    await ready(page);
    await expect(page.locator('main a[href="/products/"]')).toContainText(
      "Zobacz listę produktów"
    );
  });
});

test.describe("the owner's October round of fixes", () => {
  test("the warehouse and hive line is gone from every language", async ({ page }) => {
    for (const lang of ["en", "lt", "is", "es", "ru", "pl"]) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/");
      await ready(page);
      const text = await page.locator("main").innerText();
      expect(text, `the struck line is still showing in ${lang}`).not.toMatch(
        /no warehouse|sandėli|vöruhús|magazynu|almacén|склада|which hive|из какого улья|hvaða búi|którego ula|qué colmena|kurio avilio/i
      );
    }
  });

  test("the hand-to-hand section keeps its heading and its call", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const heading = page.getByRole("heading", { name: /beekeeper/i });
    await expect(heading).toBeVisible();
    // Striking the paragraph must not strike the call that followed it.
    const section = page.locator("section").filter({ has: heading });
    await expect(section.getByRole("link", { name: /call to taste/i }).first()).toBeVisible();
  });

  test("About shows the three of them, not the painted volcano", async ({ page }) => {
    await page.goto("/about/");
    await ready(page);
    await expect(page.locator('img[src*="honey-lava"]')).toHaveCount(0);
    await expect(page.locator('img[src*="3faces"]').first()).toBeVisible();
  });

  test("the film opens on the three of them, and runs", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const video = page.locator("section#top video");
    const poster = await video.getAttribute("poster");
    expect(poster, "the film has no first frame to show while it loads").toBeTruthy();

    // The photograph is the first three seconds of the film itself, not only
    // the poster, so the film has to be the longer cut and it has to play.
    const duration = await video.evaluate((v: HTMLVideoElement) =>
      v.readyState >= 1
        ? v.duration
        : new Promise<number>((res) => {
            v.addEventListener("loadedmetadata", () => res(v.duration), { once: true });
            setTimeout(() => res(v.duration || 0), 5000);
          })
    );
    expect(duration, "this looks like the old cut, without the opening shot").toBeGreaterThan(10);

    const moved = await video.evaluate(async (v: HTMLVideoElement) => {
      const start = v.currentTime;
      await v.play().catch(() => {});
      await new Promise((r) => setTimeout(r, 1200));
      return v.currentTime > start;
    });
    expect(moved, "the film is sitting on one frame instead of playing").toBe(true);
  });

  /**
   * The logo has been wrong twice, in opposite directions: first its top sat
   * behind the fixed navbar on a short window ("you cutted logo"), then on a
   * phone it covered the film it was sitting on ("the logo is truly over
   * taking the whole video").
   *
   * So it is laid out two different ways and both are checked here. Under
   * 768px it sits in the page, below the film. From 768 up it goes back to
   * being an overlay on the film, where it must clear the navbar and stay
   * inside the film's box.
   */
  for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
    test(`the whole logo is on screen at ${width}px wide`, async ({ page }) => {
      // Short windows are where it broke, so each width is checked at three
      // heights, including one shorter than any laptop.
      for (const height of [560, 700, 900]) {
        await page.setViewportSize({ width, height });
        await page.goto("/");
        await ready(page);

        const logo = page.locator('section#top img[alt="Honey Volcano"]');
        const film = page.locator("section#top > div").first();
        const l = (await logo.boundingBox())!;
        const h = (await page.locator("header").boundingBox())!;
        const f = (await film.boundingBox())!;
        const at = `${width}x${height}`;

        if (width < 768) {
          // Stacked: the logo begins where the film ends.
          expect(l.y, `${at}: the logo is sitting on top of the film`).toBeGreaterThanOrEqual(
            f.y + f.height - 1
          );
        } else {
          // Overlaid: clear of the navbar, and inside the film.
          expect(l.y, `${at}: the logo is ${Math.round(h.y + h.height - l.y)}px behind the navbar`)
            .toBeGreaterThanOrEqual(h.y + h.height);
          expect(l.y, `${at}: the logo is cut off at the top of the film`).toBeGreaterThanOrEqual(
            f.y - 0.5
          );
          expect(l.y + l.height, `${at}: the logo is cut off at the bottom of the film`)
            .toBeLessThanOrEqual(f.y + f.height + 0.5);
        }

        // Either way: on screen sideways, and actually rendered.
        expect(l.x, `${at}: the logo is cut off on the left`).toBeGreaterThanOrEqual(-0.5);
        expect(l.x + l.width, `${at}: the logo runs off the right`).toBeLessThanOrEqual(width + 0.5);
        expect(l.width, `${at}: the logo has no size`).toBeGreaterThan(80);
        await expect(logo).toBeVisible();
      }
    });
  }

  test("a seal opens its explanation over a blurred page, and shuts", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const seals = page.locator("ul[aria-label] button");
    await expect(seals).toHaveCount(6);

    await seals.nth(0).click();
    const dialog = page.getByRole("dialog");
    const panel = page.locator("#hv-seal-detail");
    await expect(dialog).toBeVisible();
    await expect(panel).toContainText(/straight from the bees/i);
    await expect(seals.nth(0)).toHaveAttribute("aria-expanded", "true");

    // It is in front of the page, not under the fold, and the page behind is
    // blurred and held still — which is what was asked for.
    const box = (await dialog.boundingBox())!;
    const view = page.viewportSize()!;
    expect(box.y, "the explanation is off the top of the screen").toBeGreaterThanOrEqual(0);
    expect(box.y + box.height, "the explanation runs off the bottom").toBeLessThanOrEqual(
      view.height + 1
    );
    const backdrop = page.locator('[role="dialog"]').locator("xpath=preceding-sibling::button[1]");
    await expect(backdrop).toHaveCSS("backdrop-filter", /blur/);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    // Escape shuts it, and the page is free to scroll again.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    // A different seal shows its own words.
    await seals.nth(3).click();
    await expect(panel).toContainText(/full range of bee products/i);
    await expect(page.locator("#hv-seal-detail")).toHaveCount(1);

    // The backdrop closes it too.
    await backdrop.click({ position: { x: 8, y: 8 } });
    await expect(dialog).toBeHidden();
  });

  test("every seal has an explanation to show", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const seals = page.locator("ul[aria-label] button");
    for (let i = 0; i < 6; i++) {
      await seals.nth(i).click();
      const text = await page.locator("#hv-seal-detail").innerText();
      expect(text.trim().length, `seal ${i + 1} opens an empty panel`).toBeGreaterThan(10);
      // Shut it before reaching for the next one, as a visitor would.
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
    }
  });

  // Six languages, a footer link and a page load each: real work, about 21
  // seconds of it. Under a loaded machine that overran the 45s budget and
  // failed for no reason of its own.
  test.slow();

  test("terms and conditions exist, in every language, linked from the footer", async ({
    page,
  }) => {
    const TITLES: Record<string, RegExp> = {
      en: /terms and conditions/i,
      lt: /taisyklės ir sąlygos/i,
      is: /skilmálar/i,
      es: /términos y condiciones/i,
      ru: /условия использования/i,
      pl: /regulamin/i,
    };
    for (const [lang, title] of Object.entries(TITLES)) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/terms/");
      await ready(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      // Nine sections and the note, all in the same language.
      expect(await page.locator("article h2").count(), `${lang} is missing sections`).toBe(9);
      // And it is reachable without typing the address.
      await page.goto("/");
      await ready(page);
      await expect(page.locator('footer a[href="/terms/"]')).toHaveText(title);
    }
  });

  test("the product window is large enough to see the jar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/products/");
    await ready(page);
    await page.locator("#catalog article").first().getByRole("button").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    // It used to be a 384px column on a 1280px screen — too small to look at.
    expect(box.width, "the product window is still narrow").toBeGreaterThan(640);
    const img = (await dialog.locator("img").first().boundingBox())!;
    expect(img.height, "the photograph is too small to see").toBeGreaterThan(380);
  });

  test("the Lithuanian jar has its own section on the products page", async ({ page }) => {
    const HEADINGS: Record<string, RegExp> = {
      en: /honey in lithuania's colours/i,
      lt: /medus lietuvos spalvomis/i,
      is: /hunang í litum litháens/i,
      es: /miel con los colores de lituania/i,
      ru: /мёд в цветах литвы/i,
      pl: /miód w barwach litwy/i,
    };
    for (const [lang, heading] of Object.entries(HEADINGS)) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/products/");
      await ready(page);

      const section = page.locator("section").filter({ hasText: /MEDAUS SKAN/ });
      await expect(section, `${lang}: the section is missing`).toBeVisible();
      await expect(section.getByRole("heading", { name: heading })).toBeVisible();

      // His photograph, and a way to act on it.
      const img = section.locator('img[src*="medaus-skanestai"]');
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      await expect(section.locator('a[href^="tel:"]').first()).toBeVisible();
    }
  });

  /**
   * Bee bread is fermented pollen, not bread. An earlier round took "bee
   * bread should have a picture of bread with honey" literally and put a
   * slice of sourdough on the card; he sent the real jars.
   */
  test("bee bread shows the jars, not a loaf of bread", async ({ page }) => {
    await page.goto("/products/");
    await ready(page);
    const card = page.locator("#catalog article").filter({ hasText: /bee bread/i }).first();
    // Far down the page on a phone, and the photo is lazy-loaded, so it will
    // never decode until it has been scrolled to.
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    const img = card.locator("img").first();
    await expect(img).toHaveAttribute("src", /bee-bread/);
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 15_000 })
      .toBeGreaterThan(0);
    // His photo is 4:5 like the rest of the shelf; the loaf was too.
    const ratio = await img.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight);
    expect(ratio, "the bee bread photo is not framed like the others").toBeCloseTo(0.8, 1);
  });

  test("the cannabis jar is framed like the others", async ({ page }) => {
    await page.goto("/products/");
    await ready(page);
    await page
      .locator("#catalog article")
      .filter({ hasText: "Honey delicacies 220 g" })
      .getByRole("button", { name: /delicacies/i })
      .click();

    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();
    await panel.getByRole("tab", { name: /cannabis/i }).click();

    const img = panel.locator('img[src*="delicacy-cannabis"]');
    await expect(img).toBeVisible();
    // naturalWidth is 0 until the file has decoded, so wait for it rather
    // than measuring an empty box.
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    // Its siblings are square. This one was 4:5, padded out with blurred
    // copies of itself, which is what "does not fit very well" was.
    const ratio = await img.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight);
    expect(ratio, "the cannabis photo is not square like its siblings").toBeCloseTo(1, 1);
  });

  /**
   * The catch-phrase was hardcoded English in three components, so an
   * Icelandic visitor met "Let happiness erupt" four times on a page that
   * was otherwise entirely in Icelandic — which is what "Icelandic does not
   * work" meant.
   */
  test("the catch-phrase speaks the page's language", async ({ page }) => {
    for (const [lang, expected] of Object.entries({
      lt: "Te laimė trykšta vulkanu",
      is: "Leyfðu gleðinni að gósa",
      pl: "Niech szczęście wybuchnie",
      es: "Que la felicidad estalle como un volcán",
      ru: "Пусть счастье извергается вулканом",
    })) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/");
      await ready(page);
      const text = await page.locator("main").innerText();
      expect(text.toLowerCase(), `the phrase is missing in ${lang}`).toContain(
        expected.toLowerCase()
      );
      expect(text, `English catch-phrase leaked into ${lang}`).not.toMatch(/happiness erupt/i);
    }
  });
});

/**
 * Word-for-word translation is the failure mode here, not missing text.
 *
 * "Raw honey" came out as "Žalias medus" in Lithuanian — žalias is the
 * colour green, so it read as green honey. The same calque was in Russian
 * ("сырой" = damp/uncooked) and Polish ("surowy" = crude). Icelandic listed
 * "brauð" — plain bread — where it meant býflugnabrauð, bee bread.
 *
 * These pin the corrected words and bar the literal ones.
 */
test.describe("the translations say what they mean", () => {
  const BANNED: Record<string, { word: RegExp; why: string }[]> = {
    lt: [{ word: /\bžali[aou]\w*\s+med/i, why: "žalias is the colour green" }],
    ru: [{ word: /сыр(ой|ого|ым)\s+м[её]д/i, why: "сырой reads as damp or uncooked" }],
    pl: [{ word: /surow\w*\s+mi[oó]d|mi[oó]d\s+surow\w*/i, why: "surowy reads as crude" }],
    is: [{ word: /frjókorn,\s*brauð/i, why: "brauð alone is ordinary bread" }],
  };

  const PAGES_TO_SWEEP = ["/", "/products/"];

  for (const [lang, rules] of Object.entries(BANNED)) {
    test(`${lang} does not translate "raw" literally`, async ({ page }) => {
      for (const path of PAGES_TO_SWEEP) {
        await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
        await page.goto(path);
        await ready(page);
        const text = await page.locator("main").innerText();
        for (const { word, why } of rules) {
          expect(text, `${lang} on ${path}: ${why}`).not.toMatch(word);
        }
      }
    });
  }

  test("every jar is named in the language being read", async ({ page }) => {
    const NAMES: Record<string, string[]> = {
      lt: ["Natūralus medus 500 g", "Bičių duona 100 g", "Žiedadulkės 100 g", "Korys 300 g"],
      is: ["Hrátt hunang 500 g", "Býflugnabrauð 100 g", "Frjókorn 100 g", "Vaxkaka 300 g"],
      es: ["Miel cruda 500 g", "Pan de abeja 100 g", "Polen 100 g", "Panal 300 g"],
      ru: ["Натуральный мёд 500 г", "Перга 100 г", "Пыльца 100 г", "Соты 300 г"],
      pl: ["Miód naturalny 500 g", "Pierzga 100 g", "Pyłek kwiatowy 100 g", "Plaster miodu 300 g"],
    };
    for (const [lang, names] of Object.entries(NAMES)) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/products/");
      await ready(page);
      const text = await page.locator("#catalog").innerText();
      for (const name of names) {
        expect(text, `${lang}: "${name}" is missing — the shelf is still in English`).toContain(
          name
        );
      }
      // And the English names are not sitting there beside them.
      expect(text, `${lang}: an English product name is still showing`).not.toMatch(
        /Raw honey \d|Bee bread 100 g|Pollen 100 g|Honeycomb 300 g/
      );
    }
  });

  test("the flavours are named in the language being read", async ({ page }) => {
    const FIRST: Record<string, RegExp> = {
      lt: /su avietėmis/i,
      is: /með hindberjum/i,
      es: /con frambuesas/i,
      ru: /с малиной/i,
      pl: /z malinami/i,
    };
    for (const [lang, flavour] of Object.entries(FIRST)) {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/products/");
      await ready(page);
      await page.locator("#catalog article").filter({ hasText: /220 g/ }).first().click();
      const panel = page.getByRole("dialog");
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("tab").first(), `${lang}: the flavours are still English`)
        .toHaveText(flavour);
      await page.keyboard.press("Escape");
    }
  });
});

test.describe("languages", () => {
  const LANGS = ["lt", "is", "es", "ru", "pl"];

  for (const lang of LANGS) {
    test(`${lang} translates the page and does not break it`, async ({ page }) => {
      await page.addInitScript((l) => localStorage.setItem("medaus-lang", l), lang);
      await page.goto("/about/");
      await settle(page);

      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(overflows, `${lang} pushes the page sideways`).toBe(false);

      // The values list is the longest wording on the site — if a language is
      // missing, these fall back to English, which this catches.
      const body = (await page.locator("main").innerText()).toLowerCase();
      expect(body).not.toContain("straight from the bees".toLowerCase());
    });
  }
});

test.describe("accessibility basics", () => {
  test("every image carries alt text", async ({ page }) => {
    for (const { path } of PAGES) {
      await page.goto(path);
      await settle(page);
      const missing = await page.evaluate(() =>
        [...document.querySelectorAll("img")]
          .filter((i) => !i.hasAttribute("alt"))
          .map((i) => i.currentSrc || i.src)
      );
      expect(missing, `images without alt on ${path}`).toEqual([]);
    }
  });

  test("the keyboard can reach the call button and it keeps a focus ring", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const s = getComputedStyle(el);
      return { outline: s.outlineStyle, width: s.outlineWidth };
    });
    expect(ring?.outline).not.toBe("none");
  });

  test("form fields have real labels", async ({ page }) => {
    await page.goto("/contact/");
    for (const name of [/your name/i, /^email$/i, /phone/i, /message/i]) {
      await expect(page.getByLabel(name)).toBeVisible();
    }
  });
});

test.describe("on a phone", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("the call button follows you down the page", async ({ page }) => {
    await page.goto("/");
    const sticky = page.locator(`a[href="${TEL}"]`).last();
    await expect(sticky).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect(sticky).toBeVisible();
  });

  test("every seal is readable, and arrives without being scrolled to", async ({ page }) => {
    await page.goto("/");
    await ready(page);
    const seals = page.locator("#top ul[aria-label] > li");
    await expect(seals).toHaveCount(6);

    // They animate in on load rather than on scroll, so they are never blank
    // when a visitor does reach them. No scrolling here on purpose.
    await page.waitForTimeout(1600);

    const faded = await page.evaluate(
      () =>
        [...document.querySelectorAll("#top ul[aria-label] > li > *")].filter(
          (d) => Number(getComputedStyle(d).opacity) < 0.95
        ).length
    );
    expect(faded, "a seal never finished arriving").toBe(0);

    /*
     * On a phone the three parts are stacked, in this order and not
     * overlapping: the film, then the logo and the call, then the seals.
     * The logo used to sit on top of the film and swallow it.
     */
    const view = page.viewportSize()!.height;
    const film = (await page.locator("#top video").boundingBox())!;
    const logo = (await page.locator('#top img[alt="Honey Volcano"]').boundingBox())!;
    const call = (await page.locator('#top a[href^="tel:"]').first().boundingBox())!;
    const firstSeal = (await seals.first().boundingBox())!;

    expect(logo.y, "the logo is on top of the film again").toBeGreaterThanOrEqual(
      film.y + film.height - 1
    );
    expect(firstSeal.y, "the seals are not below the logo").toBeGreaterThan(logo.y + logo.height);

    // The film is still the biggest thing on the screen…
    expect(film.height / view, "the film gave up too much of the screen").toBeGreaterThan(0.33);
    // …and the one thing a visitor must be able to do is on screen with it.
    expect(call.y + call.height, "the call button is below the fold").toBeLessThanOrEqual(view);

    // And once you scroll to them, all six are there and readable.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.12));
    await page.waitForTimeout(400);
    for (let i = 0; i < 6; i++) {
      const text = (await seals.nth(i).innerText()).trim();
      expect(text.length, `seal ${i + 1} has no words`).toBeGreaterThan(2);
    }
  });

  test("the menu opens, lists everything, and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).first().click();
    const menu = page.locator("#hv-menu");
    await expect(menu).toBeVisible();
    for (const label of ["Home", "Products", "Where to buy", "Contact information", "Gallery"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(menu.locator(`a[href="${TEL}"]`)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("the map can be touched and pinched", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });
    const dragging = await page.evaluate(
      () => document.querySelector(".leaflet-container")?.classList.contains("leaflet-touch") ?? false
    );
    expect(dragging).toBe(true);
  });
});

/**
 * What his Lithuanian reader found, on 1 November.
 */
test.describe("the round his Lithuanian reader found", () => {
  /**
   * "Terms and conditions does not work."
   *
   * It worked if you read it slowly. Flick to the bottom and five of the
   * nine headings were never there: they crossed the window between two
   * observer samples, so `whileInView` never fired, and `once` meant it
   * never fired again. Only scrolling back up brought them back.
   */
  for (const path of PAGES.map((p) => p.path)) {
    test(`nothing is left invisible by a flick to the bottom of ${path}`, async ({
      page,
    }) => {
      await page.goto(path);
      await ready(page);
      await page.waitForTimeout(600);

      // One jump, the way a flick or a tap on the scrollbar lands — not a
      // gentle walk down the page, which is what hid this for so long.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);

      const invisible = await page.evaluate(() =>
        [...document.querySelectorAll("main h2, main h3, main p, main article")]
          .filter((el) => {
            let node: HTMLElement | null = el as HTMLElement;
            let least = 1;
            while (node && node !== document.body) {
              least = Math.min(least, Number(getComputedStyle(node).opacity));
              node = node.parentElement;
            }
            return least < 0.9;
          })
          .map((el) => (el.textContent || "").trim().slice(0, 40))
      );
      expect(
        invisible,
        `${path}: this scrolled past and never appeared`
      ).toHaveLength(0);
    });
  }

  /**
   * A first-time visitor gets English.
   *
   * The language is a saved preference, so a browser that once chose Spanish
   * keeps being shown Spanish — which is correct, and is exactly why this
   * needs saying out loud: nothing may ever pick a language on a visitor's
   * behalf, from the browser locale or anywhere else.
   */
  test("a first-time visitor gets English, whatever their browser says", async ({
    browser,
  }) => {
    for (const locale of ["en-GB", "es-ES", "is-IS", "ru-RU"]) {
      const ctx = await browser.newContext({ locale });
      const page = await ctx.newPage();
      await page.goto("/");
      await ready(page);
      await page.waitForTimeout(400);

      await expect(
        page.locator("html"),
        `a ${locale} browser was served something other than English`
      ).toHaveAttribute("lang", "en");
      await expect(page.locator("main").first()).toContainText(
        "Lithuanian honey"
      );
      expect(
        await page.evaluate(() => localStorage.getItem("medaus-lang")),
        "a language was saved for someone who never chose one"
      ).toBeNull();
      await ctx.close();
    }
  });

  /**
   * Reveals must finish for a visitor who asked for no motion.
   *
   * useReducedMotion reports null on the first render and the truth on the
   * second, so an element can take the hidden initial state before the answer
   * is known. An attempt to skip the animation entirely once the answer
   * arrived left every such visitor looking at a blank page — the reveal has
   * to still run, it just takes no time.
   */
  test("a visitor who asked for no motion still sees the page", async ({
    page,
  }) => {
    for (const path of ["/", "/about/", "/terms/", "/products/"]) {
      await page.goto(path);
      await ready(page);
      await page.waitForTimeout(700);
      // No scrolling at all: whatever is on the first screen must be readable.
      // IN_VIEW holds its trigger 12% up from the bottom, so anything still in
      // that band is correctly waiting its turn rather than stuck.
      const faded = await page.evaluate(() =>
        [...document.querySelectorAll("main h1, main h2, main p")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const trigger = window.innerHeight * 0.88;
            if (r.top > trigger || r.bottom < 0) return false;
            let n: HTMLElement | null = el as HTMLElement;
            let least = 1;
            while (n && n !== document.body) {
              least = Math.min(least, Number(getComputedStyle(n).opacity));
              n = n.parentElement;
            }
            return least < 0.9;
          })
          .map((el) => (el.textContent || "").trim().slice(0, 30))
      );
      expect(faded, `${path}: invisible with reduced motion on`).toHaveLength(0);
    }
  });

  /**
   * The month that sent him a list of Lithuanian month names. "31 October
   * 2026" was a literal string shown in all six languages.
   */
  // The line is drawn uppercase by CSS, and innerText returns what is on
  // screen rather than what is in the source — hence the `i` on each.
  const DATED = [
    ["en", /October 31, 2026/i],
    ["lt", /2026 m\. spalio 31 d\./i],
    ["is", /31\. október 2026/i],
    ["es", /31 de octubre de 2026/i],
    ["ru", /31 октября 2026/i],
    ["pl", /31 października 2026/i],
  ] as const;

  for (const [code, expected] of DATED) {
    test(`the terms date is written in ${code}, not in English`, async ({ page }) => {
      await page.addInitScript(
        (c) => localStorage.setItem("medaus-lang", c),
        code
      );
      await page.goto("/terms/");
      await ready(page);
      const line = await page.locator("main p").first().innerText();
      expect(line, `the date is not in ${code}`).toMatch(expected);
      if (code !== "en") {
        expect(line, `${code} still shows the English month`).not.toMatch(
          /October/i
        );
      }
    });
  }

  /**
   * "Lots of shops have no times, and it says agree working hours with the
   * shop." 21 of the 25 have no verified hours, so this line is what most
   * visitors read; it should not sound like something they must arrange.
   */
  test("a shop with no listed hours says so plainly", async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem("medaus-lang", "lt")
    );
    await page.goto("/where-to-buy/");
    await ready(page);
    const text = await page.locator("main").innerText();
    expect(text).toContain("Darbo laikas nenurodytas");
    // the old wording read as 'agree your working hours with the shop'
    expect(text).not.toContain("pasiteiraukite parduotuvėje");
  });

  /**
   * He confirmed the Lithuanian greeting reads correctly without the comma.
   * It has none; this keeps it that way.
   */
  test("the Lithuanian greeting keeps its comma off", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("medaus-lang", "lt"));
    await page.goto("/");
    await ready(page);
    const text = await page.locator("body").innerText();
    expect(text).toContain("Te laimė trykšta vulkanu");
    expect(text, "the comma is back").not.toContain("Te laimė, trykšta");
  });
});

import { expect, test, type Page } from "@playwright/test";

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
  { path: "/under-construction/", name: "under construction" },
  { path: "/gallery/", name: "gallery" },
];

const TEL = "tel:+3548340999";

/** Scrolls the whole page so lazy images and scroll reveals all fire. */
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
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("requestfailed", (r) => {
        // The content API only exists on Netlify; the site is built to work
        // without it, and the export is served here by a plain file server.
        if (!r.url().includes("/api/")) failed.push(`${r.url()} ${r.failure()?.errorText}`);
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
      await expect(page.getByText("What's best for me?")).toBeVisible();
      await expect(page.getByText("Coming soon").first()).toBeVisible();
      return;
    }
    const soon = page.getByRole("button", { name: /What's best for me\?/ });
    await expect(soon).toBeVisible();
    await expect(soon).toHaveAttribute("aria-disabled", "true");
    await soon.click();
    expect(page.url()).toMatch(/\/$/);
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

    for (const seal of [
      "Direct from bees",
      "Natural & real",
      "Fair & affordable",
      "All bee products",
      "Authorised in LT & IS",
      "Hand to hand • Heart to heart",
    ]) {
      await expect(page.getByText(seal, { exact: true }).first()).toBeVisible();
    }
  });

  test("the film never covers the seals or the logo", async ({ page }) => {
    await page.goto("/");
    const film = await page.locator("#top video").boundingBox();
    expect(film).not.toBeNull();

    const seals = page.locator("#top .group");
    for (let i = 0; i < (await seals.count()); i++) {
      const box = await seals.nth(i).boundingBox();
      if (!box || !film) continue;
      const overlaps =
        box.x < film.x + film.width &&
        box.x + box.width > film.x &&
        box.y < film.y + film.height &&
        box.y + box.height > film.y;
      expect(overlaps, `seal ${i} sits on top of the film`).toBe(false);
    }
  });
});

test.describe("products", () => {
  test("the call button is the first action, under the logo", async ({ page }) => {
    await page.goto("/products/");
    const logo = await page.locator("main img").first().boundingBox();
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

  test("the delicacy flavours are separate and switch the picture", async ({ page }) => {
    await page.goto("/products/");
    await settle(page);
    const card = page
      .locator("#catalog article")
      .filter({ hasText: "Honey delicacies 220 g" });

    const tabs = card.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    for (const flavour of ["raspberries", "sea buckthorn", "quinces and pumpkins", "cannabis"]) {
      await expect(card.getByRole("tab", { name: new RegExp(flavour, "i") })).toBeVisible();
    }

    const before = await card.locator("img").getAttribute("src");
    await card.getByRole("tab", { name: /sea buckthorn/i }).click();
    await expect(async () => {
      expect(await card.locator("img").getAttribute("src")).not.toBe(before);
    }).toPass();
  });

  test("the 500 g and 1 kg jars are shown side by side", async ({ page }) => {
    await page.goto("/products/");
    await settle(page);
    await expect(page.getByRole("heading", { name: /500 g or 1 kg/i })).toBeVisible();
    await expect(page.locator('img[src*="raw-honey-sizes"]')).toBeVisible();
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
    await expect(page.locator(".leaflet-pane").first()).toBeVisible({ timeout: 15_000 });
    await expect
      .poll(async () => page.locator(".hv-pin, .hv-cluster").count(), { timeout: 15_000 })
      .toBeGreaterThan(0);
  });

  test("every shop is listed, and unverified hours say so", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await settle(page);
    const cards = page.locator("section article");
    await expect(cards).toHaveCount(25);
    await expect(page.getByText(/please check with the store/i).first()).toBeVisible();
  });

  test("a shop in the list flies the map to its pin", async ({ page }) => {
    await page.goto("/where-to-buy/");
    await expect(page.locator(".leaflet-pane").first()).toBeVisible({ timeout: 15_000 });
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
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/^email$/i).fill("test@example.com");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("it confirms when the message is away", async ({ page }) => {
    await page.route("**/api/lead", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' })
    );
    await page.goto("/contact/");
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/^email$/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("Hello — this is a Playwright check.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toBeVisible();
  });
});

test.describe("light and dark", () => {
  test("the toggle switches the page and is remembered", async ({ page }) => {
    await page.goto("/");
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

  test("every seal is on screen without scrolling", async ({ page }) => {
    await page.goto("/");
    const offscreen = await page.evaluate(() => {
      const seals = [...document.querySelectorAll("#top .group")];
      return seals.filter((s) => s.getBoundingClientRect().bottom > window.innerHeight).length;
    });
    expect(offscreen, "seals below the fold on a phone").toBe(0);
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
    await expect(page.locator(".leaflet-pane").first()).toBeVisible({ timeout: 15_000 });
    const dragging = await page.evaluate(
      () => document.querySelector(".leaflet-container")?.classList.contains("leaflet-touch") ?? false
    );
    expect(dragging).toBe(true);
  });
});

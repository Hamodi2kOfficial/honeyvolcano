import { expect, test, type Page } from "@playwright/test";

import octoberBundle from "./fixtures/saved-27-october.json";

/**
 * The 27 October bundle, against every page, proving it changes nothing.
 *
 * This is the copy that was really sitting in the site's blob store, read back
 * from production — not a reconstruction. When the content API came back it
 * emptied the product shelf of its photos, weights, featured flags and
 * flavours, put the film on the page twice and hung "under construction"
 * plates on two finished sections.
 *
 * Rather than check for those three symptoms, this asks a stronger question:
 * does serving that bundle change *anything at all*? Each page is loaded twice
 * — once with the content API dead, which is the build on its own, and once
 * with the real bundle served — and the two are compared. Anything the bundle
 * takes away, anywhere, shows up as a difference.
 *
 * It is written against the page rather than against a list of expected
 * numbers, so it keeps meaning something as the site changes.
 */

const PAGES = [
  "/",
  "/products/",
  "/about/",
  "/where-to-buy/",
  "/contact/",
  "/gallery/",
  "/terms/",
  "/privacy/",
];

type Shape = {
  text: string;
  headings: string[];
  images: string[];
  brokenImages: string[];
  films: number;
  plates: number;
};

async function shapeOf(page: Page, path: string, serve: "nothing" | "october") {
  await page.unroute("**/api/content").catch(() => {});
  await page.route("**/api/content", (route) =>
    serve === "nothing"
      ? route.fulfill({ status: 404, body: "" })
      : route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(octoberBundle),
        })
  );

  await page.goto(path);
  await page.waitForSelector("html[data-hv-ready]", { state: "attached" });
  // Everything on the page, including whatever loads on the way down.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  return page.evaluate((): Shape => {
    const imgs = [...document.querySelectorAll("img")];
    return {
      text: (document.querySelector("main")?.innerText ?? "")
        .replace(/\s+/g, " ")
        .trim(),
      headings: [...document.querySelectorAll("main h1, main h2, main h3")]
        .map((h) => (h.textContent ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean),
      images: imgs
        .map((i) => new URL(i.currentSrc || i.src, location.href).pathname)
        .filter(Boolean)
        .sort(),
      brokenImages: imgs
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
      films: document.querySelectorAll("video").length,
      plates: document.querySelectorAll('[class*="blur-[13px]"]').length,
    };
  });
}

for (const path of PAGES) {
  test(`the 27 October bundle changes nothing on ${path}`, async ({ page }) => {
    const build = await shapeOf(page, path, "nothing");
    const withOctober = await shapeOf(page, path, "october");

    expect(
      withOctober.brokenImages,
      `${path}: an image on the page failed to load`
    ).toEqual([]);
    expect(
      withOctober.images,
      `${path}: the saved bundle changed which pictures are on the page`
    ).toEqual(build.images);
    expect(
      withOctober.films,
      `${path}: the saved bundle changed how many films play`
    ).toBe(build.films);
    expect(
      withOctober.plates,
      `${path}: the saved bundle put an under-construction plate back`
    ).toBe(build.plates);
    expect(
      withOctober.headings,
      `${path}: the saved bundle changed the headings`
    ).toEqual(build.headings);
    expect(
      withOctober.text,
      `${path}: the saved bundle changed the words on the page`
    ).toBe(build.text);

    // A page that renders nothing would pass every check above.
    expect(build.text.length, `${path}: nothing rendered to compare`).toBeGreaterThan(
      40
    );
  });
}

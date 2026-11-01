/**
 * Every shop in Iceland that sells Honey Volcano honey.
 *
 * One file, one source of truth — the map page and the shop list both read it.
 *
 * Coordinates were geocoded against OpenStreetMap, not guessed. `precision`
 * says how much we actually know:
 *   "exact"  — full street address confirmed; the pin is the door.
 *   "street" — the street is confirmed but not the number; the pin is the
 *              street, and the popup says so.
 *   "town"   — only the town is known. These get NO pin (a town-centre pin
 *              would be a wrong pin) and appear in the list with a note.
 *
 * `hours` is only filled in where it was verified against the shop's own site
 * or a current directory listing. Everything else stays null and the page says
 * "please check with the store" — we never invent opening hours.
 *
 * `note` records a correction made to the owner's original list.
 */

export type StorePrecision = "exact" | "street" | "town";

export type Store = {
  id: string;
  /** Shop name, spelled the Icelandic way. */
  name: string;
  /** Street line, as you would write it on an envelope. */
  address: string;
  town: string;
  postcode: string;
  lat: number | null;
  lng: number | null;
  precision: StorePrecision;
  /** Verified opening hours, or null when we could not confirm them. */
  hours: string[] | null;
  /** A correction or caveat worth showing the owner. Not shown to visitors. */
  note?: string;
};

export const stores: Store[] = [
  {
    id: "urta-islandica",
    name: "Urta Islandica",
    address: "Fjörður shopping centre, Fjarðargata 13–15",
    town: "Hafnarfjörður",
    postcode: "220",
    lat: 64.06805,
    lng: -21.95643,
    precision: "exact",
    hours: null,
    note: "Pinned at the Fjörður centre, as listed. Urta Islandica's own shop and office is at Austurgata 47, 220 Hafnarfjörður — worth confirming which one stocks the honey.",
  },
  {
    id: "fiska",
    name: "Fiska",
    address: "Nýbýlavegur 6",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.11429,
    lng: -21.8967,
    precision: "exact",
    hours: null,
    note: 'Listed as "FISKA"; the shop spells it Fiska. House number 6 found via OpenStreetMap.',
  },
  {
    id: "fjardarkaup",
    name: "Fjarðarkaup",
    address: "Hólshraun 1b",
    town: "Hafnarfjörður",
    postcode: "220",
    lat: 64.08237,
    lng: -21.94045,
    precision: "exact",
    hours: null,
  },
  {
    id: "euromarket-smidjuvegur",
    name: "Euro Market",
    address: "Smiðjuvegur 2",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.11077,
    lng: -21.85093,
    precision: "exact",
    hours: ["Mon–Fri 10:00–21:00", "Sat–Sun 10:00–20:00"],
  },
  {
    id: "euromarket-hamraborg",
    name: "Euro Market",
    address: "Hamraborg 9",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.1128,
    lng: -21.90321,
    precision: "exact",
    hours: null,
  },
  {
    id: "euromarket-thverholt",
    name: "Euro Market",
    address: "Þverholt",
    town: "Reykjavík",
    postcode: "105",
    lat: 64.14083,
    lng: -21.91336,
    precision: "street",
    hours: null,
    note: 'Written as "Þerholt". Listings also give this shop as Stakkholt 4B, one street over — the house number needs confirming.',
  },
  {
    id: "euromarket-vogar",
    name: "Euro Market",
    address: "Address to be confirmed",
    town: "Vogar",
    postcode: "240",
    lat: null,
    lng: null,
    precision: "town",
    hours: null,
    note: "No Euro Market in Vogar found in any directory. Needs the street address before it can go on the map.",
  },
  {
    id: "euromarket-akranes",
    name: "Euro Market",
    address: "Address to be confirmed",
    town: "Akranes",
    postcode: "300",
    lat: null,
    lng: null,
    precision: "town",
    hours: null,
    note: "No Euro Market in Akranes found in any directory. Needs the street address before it can go on the map.",
  },
  {
    id: "mamma-veit-best",
    name: "Mamma veit best",
    address: "Laufbrekka 30",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.1136,
    lng: -21.89383,
    precision: "exact",
    hours: null,
    note: "Listed as Nýbýlavegur; the shop is registered at Laufbrekka 30, one street away.",
  },
  {
    id: "melabudin",
    name: "Melabúðin",
    address: "Hagamelur 39",
    town: "Reykjavík",
    postcode: "107",
    lat: 64.14471,
    lng: -21.96036,
    precision: "exact",
    hours: ["Mon–Fri 09:00–20:00", "Sat–Sun 10:00–20:00"],
  },
  {
    id: "minimarket-smidjuvegur",
    name: "Minimarket",
    address: "Smiðjuvegur",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.112,
    lng: -21.85045,
    precision: "street",
    hours: null,
    note: "Street confirmed, house number not. Pin sits on the street.",
  },
  {
    id: "minimarket-breidholt",
    name: "Minimarket",
    address: "Address to be confirmed",
    town: "Breiðholt, Reykjavík",
    postcode: "111",
    lat: null,
    lng: null,
    precision: "town",
    hours: null,
    note: "Breiðholt is a large district — needs a street address before it can go on the map.",
  },
  {
    id: "minimarket-hafnarfjordur",
    name: "Minimarket",
    address: "Address to be confirmed",
    town: "Hafnarfjörður",
    postcode: "220",
    lat: null,
    lng: null,
    precision: "town",
    hours: null,
    note: "No street given and nothing found in directories — needs an address.",
  },
  {
    id: "fylgifiskar",
    name: "Fylgifiskar",
    address: "Nýbýlavegur 4",
    town: "Kópavogur",
    postcode: "200",
    lat: 64.11423,
    lng: -21.89731,
    precision: "exact",
    hours: ["Mon–Fri 10:30–18:00", "Sat–Sun closed"],
  },
  {
    id: "lindabakari-baejarlind",
    name: "Lindabakarí",
    address: "Bæjarlind 1–3",
    town: "Kópavogur",
    postcode: "201",
    lat: 64.09873,
    lng: -21.87589,
    precision: "exact",
    hours: ["Mon–Fri 07:00–17:00", "Sat 07:00–16:00", "Sun 08:00–16:00"],
    note: "Listed as Reykjavík; Bæjarlind is in Kópavogur, 201.",
  },
  {
    id: "lindabakari-vellir",
    name: "Lindabakarí",
    address: "Tjarnarvellir 15",
    town: "Hafnarfjörður",
    postcode: "221",
    lat: 64.05245,
    lng: -21.97934,
    precision: "exact",
    hours: null,
    note: 'Listed as "Vellir 220"; the shop is at Tjarnarvellir 15, postcode 221.',
  },
  {
    id: "lindabakari-ogurhvarf",
    name: "Lindabakarí",
    address: "Ögurhvarf 3",
    town: "Kópavogur",
    postcode: "203",
    lat: 64.09634,
    lng: -21.8027,
    precision: "exact",
    hours: null,
    note: 'Written as "Ogurhvær"; the street is Ögurhvarf, postcode 203.',
  },
  {
    id: "kassinn",
    name: "Kassinn",
    address: "Norðurtangi 1",
    town: "Ólafsvík",
    postcode: "355",
    lat: 64.89742,
    lng: -23.70913,
    precision: "exact",
    hours: null,
  },
  {
    id: "filipino-market",
    name: "Filipino Market",
    address: "Vesturberg 76",
    town: "Reykjavík",
    postcode: "111",
    lat: 64.10552,
    lng: -21.82288,
    precision: "exact",
    hours: null,
  },
  {
    id: "blomaborg",
    name: "Blómaborg",
    address: "Breiðamörk",
    town: "Hveragerði",
    postcode: "810",
    lat: 63.9994,
    lng: -21.18672,
    precision: "street",
    hours: null,
    note: "Found on Breiðamörk, Hveragerði. House number not confirmed.",
  },
  {
    id: "deli-mosfellsbaer",
    name: "Deli",
    address: "Þverholt 2 (Kjarninn)",
    town: "Mosfellsbær",
    postcode: "270",
    lat: 64.16751,
    lng: -21.6967,
    precision: "exact",
    hours: null,
    note: 'Written as "Þervolti 2" — the street is Þverholt. The building at number 2 is the Kjarninn centre.',
  },
  {
    id: "gk-bakari",
    name: "GK Bakarí",
    address: "Austurvegur 31b",
    town: "Selfoss",
    postcode: "800",
    lat: 63.93738,
    lng: -20.99294,
    precision: "exact",
    hours: null,
  },
  {
    id: "reykjavikurblom",
    name: "Reykjavíkurblóm",
    address: "Borgartún 23",
    town: "Reykjavík",
    postcode: "105",
    lat: 64.14617,
    lng: -21.90049,
    precision: "exact",
    hours: null,
    note: 'Written as "Reykjavikublom" — the shop is Reykjavíkurblóm.',
  },
  {
    id: "vaxtavorur",
    name: "Vaxtavörur — supplements department",
    address: "Address to be confirmed",
    town: "Hafnarfjörður",
    postcode: "220",
    lat: null,
    lng: null,
    precision: "town",
    hours: null,
    note: "No shop of this name found in Hafnarfjörður. The name itself needs checking, then an address.",
  },
  {
    id: "haskoli-islands",
    name: "Coffee shop at Háskóli Íslands",
    address: "Háskólatorg, Sæmundargata 4",
    town: "Reykjavík",
    postcode: "102",
    lat: 64.13988,
    lng: -21.95045,
    precision: "exact",
    hours: null,
    note: "Pinned at Háskólatorg, the main student building. Confirm which café it is if there is more than one.",
  },
];

/** The shops we can honestly put on the map. */
export const mappedStores = stores.filter(
  (s): s is Store & { lat: number; lng: number } => s.lat != null && s.lng != null
);

/** Centre of Iceland's capital region — the map's starting view. */
export const MAP_CENTER: [number, number] = [64.1, -21.9];

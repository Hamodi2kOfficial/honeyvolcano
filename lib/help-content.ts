/**
 * The help articles, as content rather than code.
 *
 * They live here so they ship with the site and are searchable offline, and
 * they are plain data — the dashboard reads them, and they can later be moved
 * into the published content without touching any screen that shows them.
 *
 * Written for someone who has never built a website: no jargon, no file paths,
 * no mention of anything technical unless the owner really has to do it.
 */

export type HelpArticle = {
  id: string;
  title: string;
  /** Dashboard screen this article belongs to, for the "?" button. */
  screen?: string;
  /** Words someone might search for that are not already in the text. */
  keywords?: string[];
  /** Short paragraphs and "- " bullet lines. */
  body: string[];
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "getting-started",
    title: "A tour of your dashboard",
    screen: "overview",
    keywords: ["start", "begin", "tour", "first", "learn"],
    body: [
      "This is where you run your website. Nothing you do here can break it, and nothing appears for visitors until you press Publish.",
      "- **Dashboard** — the overview, with quick jobs and what works today.",
      "- **Home page** — the sections your front page is made of.",
      "- **Pages & menus** — the words everywhere else: menus, buttons, the products page.",
      "- **Pictures** — your photo library and the gallery slideshow.",
      "- **Products** — names, prices and order.",
      "- **Contact** — phone, email and the business note.",
      "- **Marketing** — enquiries from visitors, announcements, offers, share preview and visitor numbers.",
      "- **Publishing** — the Publish button, backups and starting over.",
      "Everything you type is saved automatically as you go. The gold button at the top right puts it on the live site.",
    ],
  },
  {
    id: "home-layout",
    title: "Building your home page",
    screen: "home",
    keywords: ["section", "order", "drag", "hide", "layout", "add", "move"],
    body: [
      "Your home page is a stack of sections, shown here in the order visitors see them.",
      "- **Reorder** — drag a section by the handle on the left, or use the up and down arrows (easier on a phone).",
      "- **Hide** — the eye icon keeps a section here but takes it off the site.",
      "- **Edit** — tap a section's name to open its words and pictures.",
      "- **Duplicate and Delete** — the copy and bin icons. Designed sections can be hidden but not deleted.",
      "- **Add a section** — choose from the library: text, picture + text, pictures, cards, quote, reviews, call to action, numbers, gold ribbon, video, questions & answers, or an enquiry form.",
      "**Preview** at the top right shows the page as it will look, and you can switch between computer, tablet and phone. Tap any section in the preview to jump straight to editing it.",
      "Each section can also be set to appear only on computers or only on phones, and to show only between two dates — handy for a seasonal campaign.",
    ],
  },
  {
    id: "editing-text",
    title: "Changing words, pictures and video",
    screen: "home",
    keywords: ["text", "language", "translate", "photo", "image", "film", "wording"],
    body: [
      "Open any section and you can rewrite everything in it.",
      "**Languages.** Your site speaks six languages. The language bar above the words says which one you are editing. Change the Icelandic and only the Icelandic changes — the other five keep their translation. A dot marks the languages you have rewritten.",
      "**Putting a wording back.** If you change your mind, the small “original” link next to a field restores the wording the site came with.",
      "**Pictures.** Choose a picture to swap it for another from your library, upload a new one, or paste a link. “Original picture” puts the first one back.",
      "Careful with very long headings: they are designed for a short line or two. The preview shows you immediately if something is too long.",
    ],
  },
  {
    id: "pictures",
    title: "Adding pictures (and what size they should be)",
    screen: "gallery",
    keywords: ["upload", "photo", "image", "size", "blurry", "gallery", "slideshow"],
    body: [
      "**Picture library** holds every photo you can use anywhere on the site. Upload once, then pick it wherever you need it.",
      "**Gallery slideshow** is the full-screen gallery page. Reorder the pictures, write the gold phrase that appears above a photo, and describe each picture so search engines understand it.",
      "**Sizes.** Anything from a modern phone is plenty. Pictures are shrunk automatically to about 1600 pixels on the long side, which keeps the site fast.",
      "**If a picture looks blurry**, it was probably small to begin with — a screenshot or something saved from a chat app. Use the original photo instead.",
      "JPG and PNG are both fine. A cut-out with a transparent background (like the jar) needs to be a PNG.",
    ],
  },
  {
    id: "products",
    title: "Products and prices",
    screen: "products",
    keywords: ["price", "isk", "product", "catalogue", "tba", "order"],
    body: [
      "Add, rename, reprice and reorder your products here.",
      "- Type the price in ISK, or tick **TBA** if it is not decided yet — the site then shows “Price TBA”.",
      "- The arrows set the order customers see.",
      "- The bin removes a product. There is no undo once published, so publish carefully — or use Undo at the top before you publish.",
      "Prices appear on the products page as soon as you press Publish.",
    ],
  },
  {
    id: "publishing",
    title: "Publishing, and going back to an earlier version",
    screen: "publish",
    keywords: ["publish", "live", "save", "backup", "restore", "undo", "revert"],
    body: [
      "Your work is saved in your browser as you type. Visitors see nothing until you press **Publish changes** at the top right.",
      "A gold line appears whenever you have changes that are not live yet. After publishing, the site updates within a few seconds.",
      "**Load the live version** throws away anything you have not published and brings back exactly what the site is showing — a safe way out if you have made a mess.",
      "**Download a backup** saves everything in one file. Keep it somewhere safe; you can load it back here, or on another computer or phone.",
    ],
  },
  {
    id: "enquiries",
    title: "Enquiries from visitors",
    screen: "marketing",
    keywords: ["form", "email", "lead", "contact", "customer", "inbox", "csv"],
    body: [
      "When someone fills the form on your site, it arrives in **Marketing → Enquiries** — not in an email inbox somewhere, but here.",
      "- New enquiries are marked with a gold “new” label and counted on the tab.",
      "- **Reply** opens your own email program with their address ready.",
      "- **Export** downloads everything as a spreadsheet file, which is what you would upload to a newsletter service later.",
      "The form appears in the taste block on the products page, and you can add an **Enquiry form** section anywhere on the home page.",
    ],
  },
  {
    id: "marketing",
    title: "Announcements, offers and how your link looks when shared",
    screen: "marketing",
    keywords: ["announcement", "banner", "offer", "code", "discount", "facebook", "whatsapp", "share", "seo"],
    body: [
      "**Announcement** puts a gold strip across the top of every page. Give it a start and end date and it switches itself on and off.",
      "**Offers** are codes with a percentage and validity dates, shown with your catalogue. There is no online checkout yet, so a code is something the customer mentions when they call or order.",
      "**Share preview** controls what people see when your link is sent on WhatsApp or posted on Facebook: the headline, the sentence under it and the picture. It updates the moment you publish.",
      "**Visitors** counts page views, taste-button presses and enquiries. It is anonymous — no cookies, nothing for visitors to accept.",
    ],
  },
  {
    id: "phone",
    title: "Using the dashboard on your phone",
    screen: "overview",
    keywords: ["mobile", "phone", "touch", "small screen"],
    body: [
      "Everything here works on a phone. A few things are worth knowing:",
      "- Reorder sections with the **up and down arrows** rather than dragging — dragging is for a mouse.",
      "- The tabs along the top scroll sideways; swipe them to reach Marketing and Publishing.",
      "- Uploading a picture opens your camera roll, and you can take a photo on the spot.",
      "- Publishing works exactly the same as on a computer.",
    ],
  },
  {
    id: "password",
    title: "Your password",
    screen: "publish",
    keywords: ["password", "login", "security", "sign in", "change"],
    body: [
      "You sign in with one password, which also protects publishing and your enquiries.",
      "To change it, ask your developer to update the site's **ADMIN_PASSWORD** setting in Netlify and deploy once. It takes two minutes.",
      "Do not share the password with anyone who should not be able to change the website.",
    ],
  },
  {
    id: "troubleshooting",
    title: "Something is not working",
    keywords: ["problem", "help", "broken", "error", "not showing", "stuck"],
    body: [
      "**“I published but I cannot see the change.”** Give it a few seconds and refresh the page. Phones are keen on showing an old copy — pull down to refresh.",
      "**“My picture looks blurry.”** It was probably a small picture to start with. Use the original photo from your camera.",
      "**“A section disappeared.”** Check the eye icon in the Home page list, and whether the section has campaign dates that have passed, or is set to phones only.",
      "**“It says the browser is full.”** Publish your changes, or download a backup and then use Reset everything.",
      "**“I changed the English but the Icelandic is still old.”** Each language is edited separately — switch the language bar to Icelandic and edit it there.",
    ],
  },
];

export const HELP_FAQ: { q: string; a: string }[] = [
  {
    q: "Will my changes break the website?",
    a: "No. Nothing reaches visitors until you press Publish, and if a picture or a text is missing the site simply leaves that part out rather than showing an error.",
  },
  {
    q: "How long until visitors see my change?",
    a: "A few seconds after you press Publish. People who already have the page open need to refresh it.",
  },
  {
    q: "Can I undo something?",
    a: "Yes. Undo and redo are at the top of the dashboard, and “Load the live version” throws away everything you have not published yet.",
  },
  {
    q: "Do I need to know anything technical?",
    a: "No. The only technical thing in the whole system is changing the password, which is a two-minute job for your developer.",
  },
  {
    q: "Does editing the English also change the other languages?",
    a: "No. Each language is edited on its own, so your translations stay as they are until you decide to change them.",
  },
  {
    q: "Can I take online orders?",
    a: "Not yet. The site takes enquiries, and customers order by phone. A proper shop with payment is the next big step whenever you want it.",
  },
];

/** Simple word match across titles, bodies and keywords. */
export function searchHelp(query: string): HelpArticle[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return HELP_ARTICLES;
  return HELP_ARTICLES.filter((article) =>
    [article.title, ...(article.keywords ?? []), ...article.body]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  );
}

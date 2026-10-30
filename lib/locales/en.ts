/**
 * English — the source dictionary.
 *
 * Every other language in lib/locales mirrors this shape exactly; `Dict` is
 * derived from it, so adding a key here makes the compiler ask for it in the
 * other five. Keys are two levels deep ("about.p1") because that is the path
 * the dashboard's copy editor uses.
 */
const en = {
  nav: {
    home: "Home",
    products: "Products",
    stores: "Where to buy",
    about: "About Honey Volcano",
    best: "What's best for me?",
    bestSoon: "Coming soon",
    contact: "Contact information",
    gallery: "Gallery",
    menu: "Menu",
    close: "Close menu",
    theme: "Switch between light and dark",
  },

  hero: {
    tagline: "Raw Honey & All Bee Products",
    lead: "Lithuanian honey, carried here by hand. Taste before you buy.",
    sealsLabel: "What every jar promises",
  },

  stamps: {
    s1: "Direct from bees",
    s2: "Natural & real",
    s3: "Fair & affordable",
    s4: "All bee products",
    s5: "Authorised in LT & IS",
    s6: "Hand to hand • Heart to heart",
  },

  uc: {
    label: "Under construction",
    soon: "Coming soon",
    title: "More is on the way",
    body: "New bee products, recipes and a shop are coming.",
    back: "Back to home",
    more: "See what's coming",
  },

  home: {
    rawEyebrow: "Raw honey & all bee products",
    rawHeading: "Everything the hive makes,\nnothing else.",
    rawBody: "Honey, pollen, bee bread and comb — all from the same hives.",
    rawP1t: "Raw and unheated",
    rawP1d: "Never pasteurised. The pollen and enzymes stay put.",
    rawP2t: "One beekeeper",
    rawP2d: "The same hives, the same hands, every jar.",
    rawP3t: "Carried, not shipped",
    rawP3d: "Brought to Iceland in person, handed over the same way.",

    featEyebrow: "Taste first",
    featHeading: "Our favourites",
    featBody: "The jars people come back for.",
    featAll: "See all products",

    s1Eyebrow: "Let happiness erupt",
    s1Heading: "A spoon is never enough",
    s1Body: "Share a jar and watch what happens at the table.",

    s2Eyebrow: "Hand to hand",
    s2Heading: "From the beekeeper's hands\nstraight to yours",
    s2Body: "No warehouse, no reseller. We know which hives your jar came from.",

    s3Eyebrow: "Morning, improved",
    s3Heading: "Good on bread.\nBest by the spoon.",
    s3Body: "Thick, slow, properly golden. Honey as it was before syrup.",

    ucHeading: "Something sweet is being built",
    ucBody: "A webshop, recipes and more bee products are on the way.",
  },

  trust: {
    heading: "Reliable source.\nTrustworthy business.",
    authorized: "Authorised in",
    body: "Registered and food-safe in both countries, traceable to the hive.",
  },

  values: {
    eyebrow: "Real honey, nothing hidden",
    heading: "Know exactly what's\nin the jar.",
    lead: "One of the most faked foods on earth. Not this one.",
    t1: "Straight from the bees",
    d1: "No unnecessary middlemen — from the beekeeper's hands directly to your home.",
    t2: "Natural and authentic",
    d2: "Created by nature. Gathered by bees. Prepared with human care.",
    t3: "Fair and affordable",
    d3: "High-quality bee products shouldn't be a luxury.",
    t4: "A full range of bee products",
    d4: "From honey to pollen, bee bread and other hive treasures.",
    vision: "Our promise: if you can't taste the difference, it isn't Honey Volcano.",
  },

  letter: {
    eyebrow: "A note from the hive",
    heading: "We don't make honey.\nBees do.",
    p1: "We follow the bees and let the season decide.",
    p2: "What you taste is a Lithuanian summer. Nothing added.",
    p3: "We bottle only what the hives offer.",
    signature: "— Jordanas, Honey Volcano",
  },

  product: {
    heading: "Raw Honey",
    f1t: "100% Raw",
    f2t: "Let happiness erupt",
    f3t: "Natural & Real",
  },

  products: {
    badge: "Call to taste",
    call: "Call to taste",
    title: "Everything the bees make",
    subtitle: "Seven products, one beekeeper, no middlemen.",
    tasteEyebrow: "Try before you buy",
    tasteHeading: "Request a taste",
    tasteBody: "Ask for a taste and judge for yourself.",
    tasteNote: "Asking to taste never raises your price.",
    placeholder: "Your email",
    button: "Request a taste",
    success: "Thank you — we'll be in touch about your taste.",
    invalid: "Please enter a valid email.",
    back: "Back to home",
    flavours: "Choose a flavour",
    close: "Close",
    tba: "Price TBA",
  },

  /** One short line per product, shown when a card is opened. */
  productDesc: {
    "raw-honey-500": "Raw, unheated, straight from Lithuanian hives. The everyday jar.",
    "raw-honey-1kg": "The same raw honey, in the jar that lasts a season.",
    "honeycomb-300": "Comb cut straight from the frame. Chew it, wax and all.",
    "delicacies-220": "Raw honey whipped with real fruit. Four flavours to choose from.",
    "multicoloured-220": "A box of small jars. Every flavour we make, together.",
    "pollen-100": "Flower pollen the bees packed themselves. Sprinkle it on anything.",
    "bee-bread-100": "Pollen the hive fermented into bread. Deeper, tangier than pollen.",
  },

  about: {
    eyebrow: "About us",
    title: "Honey Volcano",
    tagline: "Let happiness erupt!!! :-)",
    p1: "I am Lithuanian, and for the past nine years, my home has been Iceland — a land of ice and fire.",
    p2: "However, our sweet story begins a bit further away: in the tranquil plains of Lithuania, filled with the hum of industrious bees.",
    p3: "And now, a new, sweet surge is erupting in the North! Much like a real Icelandic volcano — only instead of lava, it's pure, natural LITHUANIAN HONEY that flows out!",
    p4: "Bee products are, perhaps, one of those simple joys in life that touch us deep within our hearts.",
    p5: "After all, we are all searching for something authentic, natural, and simple — yet something that evokes a wonderful feeling.",
    p6: "And anyone who has tasted real Lithuanian honey knows one thing for sure: one spoon is never enough! :-)",
    p7: "What else can we offer to delight you? Oh, we have plenty!",
    p8: "It's not just about honey. We offer a whole world of treasures created by bees — treasures we want to share with you. Our goal is to ensure that the finest bee products reach you directly and easily, at a great price, and with a touch of joy! :-)",
    openList: "Open product list",
    valuesHeading: "Our values",
    v1t: "Straight from the bees",
    v1d: "No unnecessary middlemen — from the beekeeper's hands directly to your home.",
    v2t: "Natural and authentic",
    v2d: "Created by nature. Gathered by bees. Prepared with human care.",
    v3t: "Fair and affordable pricing",
    v3d: "We believe that high-quality bee products shouldn't be a luxury.",
    v4t: "A full range of bee products",
    v4d: "From honey to pollen, bee bread, and other hive treasures.",
    v5t: "Officially operating in Lithuania and Iceland",
    v5d: "Responsible sourcing, traceable origins, and full compliance with food safety standards.",
    v6t: "From hand to hand, from heart to heart",
    v6d: "Because what we pass on matters just as much as what we sell.",
    close1: "Honey Volcano",
    close2: "Let happiness erupt!",
  },

  contact: {
    title: "Contact information",
    lead: "Two ways to reach us. Calling is fastest.",
    writeHeading: "Write to us",
    writeBody: "Leave a message and we'll come back to you.",
    callHeading: "Call directly",
    callBody: "We answer in Icelandic, English, Lithuanian, Polish and Russian.",
    name: "Your name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    optional: "optional",
    send: "Send message",
    sending: "Sending…",
    success: "Thank you — your message is with us. We'll be in touch soon.",
    error: "That didn't send. Please try again, or call us instead.",
    errName: "Please tell us your name.",
    errContact: "Please leave an email address or a phone number.",
    errEmail: "That email address doesn't look right.",
    detailsHeading: "Business details",
    vat: "VAT no.",
    addressLabel: "Address",
    emailLabel: "Email",
    phoneLabel: "Phone",
  },

  stores: {
    title: "Where to buy",
    intro: "Find Honey Volcano honey in shops across Iceland.",
    priceNote: "Our partner shops sell at the same retail price as we do.",
    tasteNote: "Want to try before you buy? Just call.",
    listHeading: "Every shop",
    hours: "Opening hours",
    hoursUnknown: "Opening hours: please check with the store",
    address: "Address",
    flyTo: "Show on the map",
    stockistHeading: "Your shop could be here too",
    stockistBody:
      "Get in touch and let's find the best conditions to make life sweeter.",
    stockistContact: "Get in touch",
    count: "shops",
    mapLabel: "Map of shops selling Honey Volcano honey in Iceland",
  },

  privacy: {
    title: "Privacy Policy",
    updated: "Last updated",
    intro: "What happens to your information on this site. We collect very little.",
    s1h: "Who is responsible",
    s1b: "Jordanas Golovinas, VAT no. 161171, Miðholt 1, 270 Mosfellsbær, Iceland. Email golovinasjordanas@gmail.com, phone +354 834 0999.",
    s2h: "What we collect",
    s2b: "Only what you type into the contact form: your name, your email address, your phone number if you give one, and your message. The site sets no advertising or tracking cookies, and we do not use an external analytics service. The site counts page views and button presses in an anonymous tally that holds no personal data and cannot identify you.",
    s3h: "Why, and on what legal basis",
    s3b: "We use your details for one reason: to answer you. The legal basis is our legitimate interest in replying to an enquiry you chose to send us, and, where your message is about an order, taking steps at your request before entering into a contract.",
    s4h: "How long we keep it",
    s4b: "Enquiries are kept for up to 24 months so we can follow up on an order or a repeat question, then deleted. You can ask us to delete yours sooner at any time.",
    s5h: "Who else sees it",
    s5b: "The site is hosted by Netlify, whose servers store the message so the owner can read it. Netlify acts as our processor and does not use your data for its own purposes. We never sell your data and we never pass it to anyone for marketing.",
    s6h: "Your rights",
    s6b: "You can ask for a copy of what we hold about you, ask us to correct it, ask us to delete it, ask us to restrict how we use it, or object to our use of it. Write to golovinasjordanas@gmail.com and we will answer within one month.",
    s7h: "Complaints",
    s7b: "If you think we have handled your data badly, please tell us first so we can fix it. You also have the right to complain to Persónuvernd, the Icelandic Data Protection Authority, at personuvernd.is.",
    s8h: "Changes to this policy",
    s8b: "If we change how we handle data, we will update this page and change the date above.",
    note: "This policy is a starting template prepared for the owner to review. It is not legal advice.",
  },

  cta: {
    heading: "Let happiness erupt.",
    subtitle: "Call and we'll bring a taste to you.",
    placeholder: "Your email",
    button: "Join",
    success: "Thank you — you are on the list.",
    invalid: "Please enter a valid email.",
    call: "Call to taste",
    callNow: "Call now",
    copy: "Copy",
    copied: "Copied",
  },

  footer: {
    tagline: "Raw Honey & All Bee Products",
    made: "Carried from Lithuania. Handed over in Iceland.",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    pages: "Pages",
    contact: "Contact",
  },

  video: {
    button: "Call to taste",
  },

  story: {
    eyebrow: "Where it begins",
    heading: "Born on the plains\nof Lithuania",
    body1: "Meadows of clover, lime and wildflowers, worked by unhurried bees.",
    body2: "Small, raw, unfiltered. Carried north by hand.",
    stat1: "Raw",
    stat2: "Small batch",
    stat3: "Unfiltered",
  },
};

export default en;
export type Dict = typeof en;

import type { Dict } from "@/lib/locales/en";

/**
 * Polski. The About page uses the owner's supplied Polish text; the rest is
 * translated in the same warm, unfussy register. Marked for native review.
 */
const pl: Dict = {
  nav: {
    home: "Strona główna",
    products: "Produkty",
    stores: "Gdzie kupić",
    about: "O Honey Volcano",
    best: "Co będzie dla mnie najlepsze?",
    bestSoon: "Wkrótce",
    contact: "Kontakt",
    gallery: "Galeria",
    menu: "Menu",
    close: "Zamknij menu",
    theme: "Przełącz jasny i ciemny motyw",
    language: "Język",
    chooseLanguage: "Wybierz język",
  },

  hero: {
    tagline: "Naturalny miód i wszystkie produkty pszczele",
    lead: "Litewski miód. Zebrany w rodzinnej pasiece na Litwie.",
    slogan: "Niech szczęście wybuchnie",
    sealsLabel: "Co obiecuje każdy słoik",
    sealsClose: "Zamknij",
  },


  gallery: {
    pause: "Wstrzymaj pokaz",
    play: "Odtwórz pokaz",
  },
  stamps: {
    s1: "Prosto od pszczół",
    s2: "Naturalnie i autentycznie",
    s3: "Uczciwa cena",
    s4: "Wszystkie produkty pszczele",
    s5: "Działamy w LT i IS",
    s6: "Z rąk do rąk • Z serca do serca",
  },

  uc: {
    label: "W budowie",
    soon: "Wkrótce",
    title: "Będzie tego więcej",
    body: "Nowe produkty pszczele, przepisy i sklep są w drodze.",
    back: "Wróć na stronę główną",
    more: "Zobacz, co powstaje",
  },

  home: {
    rawEyebrow: "Naturalny miód i wszystkie produkty pszczele",
    rawHeading: "Wszystko, co daje ul,\ni nic więcej.",
    rawBody: "Miód, pyłek, pierzga i plaster — z tych samych uli.",
    rawP1t: "Naturalny i niepodgrzewany",
    rawP1d: "Nigdy niepasteryzowany. Pyłek i enzymy zostają na miejscu.",
    rawP2t: "Jeden pszczelarz",
    rawP2d: "Te same ule, te same ręce, każdy słoik.",
    rawP3t: "Przywiezione, nie wysłane",
    rawP3d: "Przywieziony na Islandię osobiście i tak samo przekazany.",

    featEyebrow: "Najpierw spróbuj",
    featHeading: "Nasze ulubione",
    featBody: "Słoiki, po które wraca się ponownie.",
    featAll: "Zobacz wszystkie produkty",

    s1Eyebrow: "Niech szczęście wybuchnie",
    s1Heading: "Jedna łyżeczka to za mało",
    s1Body: "Podziel się słoikiem i zobacz, co dzieje się przy stole.",

    s2Eyebrow: "Z rąk do rąk",
    s2Heading: "Z rąk pszczelarza\nprosto do Waszych",
    s2Body: "",

    s3Eyebrow: "Lepszy poranek",
    s3Heading: "Dobry na chlebie.\nNajlepszy łyżką.",
    s3Body: "Gęsty, powolny, naprawdę złoty. Miód taki jak dawniej.",

    ucHeading: "Powstaje coś słodkiego",
    ucBody: "Sklep internetowy, przepisy i więcej produktów pszczelich już w drodze.",
  },

  trust: {
    heading: "Pewne źródło.\nUczciwy biznes.",
    authorized: "Zarejestrowani w",
    body: "Zarejestrowani i zgodni z normami żywnościowymi w obu krajach.",
  },

  values: {
    eyebrow: "Prawdziwy miód, nic ukrytego",
    heading: "Wiedz dokładnie,\nco jest w słoiku.",
    lead: "Jeden z najczęściej fałszowanych produktów świata. Tylko nie ten.",
    t1: "Prosto od pszczół",
    d1: "Bez zbędnych pośredników — prosto z rąk pszczelarza do Waszego domu.",
    t2: "Naturalnie i autentycznie",
    d2: "Stworzone przez naturę. Zebrane przez pszczoły. Przygotowane z troską człowieka.",
    t3: "Uczciwe i przystępne ceny",
    d3: "Wysokiej jakości produkty pszczele nie powinny być luksusem.",
    t4: "Bogactwo produktów pszczelich",
    d4: "Od miodu, przez pyłek i pierzgę, aż po inne skarby ula.",
    vision: "Nasza obietnica: jeśli nie czujecie różnicy, to nie jest Honey Volcano.",
  },

  letter: {
    eyebrow: "Wiadomość z ula",
    heading: "Nie robimy miodu.\nRobią go pszczoły.",
    p1: "Idziemy za pszczołami i pozwalamy decydować sezonowi.",
    p2: "To, co czujesz, to litewskie lato. Nic dodanego.",
    p3: "Rozlewamy tylko tyle, ile dadzą ule.",
    signature: "— Jordanas, Honey Volcano",
  },

  product: {
    heading: "Naturalny miód",
    f1t: "100% naturalny",
    f2t: "Niech szczęście wybuchnie",
    f3t: "Naturalnie i autentycznie",
  },

  products: {
    badge: "Zadzwoń i spróbuj",
    call: "Zadzwoń i spróbuj",
    title: "Wszystko, co robią pszczoły",
    subtitle: "Siedem produktów, jeden pszczelarz, żadnych pośredników.",
    skanestaiLabel: "MEDAUS SKANĖSTAI",
    skanestaiHeading: "Miód w barwach Litwy",
    skanestaiBody: "Trzy warstwy, przewiązane litewską wstążką.",
    tasteEyebrow: "Spróbuj przed zakupem",
    tasteHeading: "Poproś o spróbowanie",
    tasteBody: "Poproś o spróbowanie i oceń sam.",
    tasteNote: "Prośba o spróbowanie nigdy nie podnosi ceny.",
    placeholder: "Twój e-mail",
    button: "Chcę spróbować",
    success: "Dziękujemy — odezwiemy się w sprawie degustacji.",
    invalid: "Podaj prawidłowy adres e-mail.",
    back: "Wróć na stronę główną",
    flavours: "Wybierz smak",
    close: "Zamknij",
    tba: "Cena wkrótce",
  },

  /** One short line per product, shown when a card is opened. */
  /** The name on the jar, in each language. */
  productName: {
    "raw-honey-500": "Miód naturalny 500 g",
    "raw-honey-1kg": "Miód naturalny 1 kg",
    "honeycomb-300": "Plaster miodu 300 g",
    "delicacies-220": "Przysmaki miodowe 220 g",
    "multicoloured-220": "Miód wielokolorowy 220 g",
    "pollen-100": "Pyłek kwiatowy 100 g",
    "bee-bread-100": "Pierzga 100 g",
    "raspberry": "Przysmak miodowy z malinami",
    "buckthorn": "Przysmak miodowy z rokitnikiem",
    "quince-pumpkin": "Przysmak miodowy z pigwą i dynią",
    "cannabis": "Honeyvolcano z kostkami konopnymi i kakao",
  },
  productDesc: {
    "raw-honey-500": "Naturalny, niepodgrzewany, prosto z litewskiej pasieki. Słoik na co dzień.",
    "raw-honey-1kg": "Ten sam naturalny miód, w słoiku na cały sezon.",
    "honeycomb-300": "Plaster krojony prosto z ramki. Żuj razem z woskiem.",
    "delicacies-220": "Naturalny miód ucierany z prawdziwymi owocami. Cztery smaki.",
    "multicoloured-220": "Pudełko małych słoiczków. Wszystkie nasze smaki razem.",
    "pollen-100": "Pyłek kwiatowy zebrany przez pszczoły. Posyp nim wszystko.",
    "bee-bread-100": "Pierzga — pyłek sfermentowany w ulu. Głębsza niż pyłek.",
  },


  /**
   * The owner's own words, used exactly as he supplied them. Each language
   * keeps its own shape — its own number of paragraphs, its own order of
   * values, and descriptions only where he wrote them. Nothing here is
   * translated, shortened or added to.
   */
  about: {
    eyebrow: "🍯 O NAS",
    title: "HONEY VOLCANO",
    tagline: "Niech szczęście wybuchnie! 🌋 :-)",
    intro: [
      "Nazywam się Jordanas i pochodzę z Litwy Od 9 lat moim domem jest Islandia — kraina lodu i ognia.",
      "Jednak nasza słodka historia zaczyna się nieco dalej — na spokojnych równinach Litwy, wśród brzęczenia pracowitych pszczół.",
      "A teraz na północy wybucha nowa, słodka energia! Zupełnie jak prawdziwy islandzki wulkan — z tą różnicą, że zamiast lawy wypływa z niego czysty, naturalny MIÓD LITEWSKI! 🍯🌋",
      "Produkty pszczele to jedne z tych prostych przyjemności życia, które potrafią poruszyć nasze serca.",
      "W końcu wszyscy szukamy czegoś autentycznego, naturalnego i prostego — a jednocześnie czegoś, co wywołuje w nas cudowne uczucia.",
      "A każdy, kto choć raz spróbował prawdziwego litewskiego miodu, wie jedno: na jednej łyżeczce nigdy się nie kończy! :-)",
      "Co jeszcze możemy Wam zaoferować, aby sprawić Wam radość?",
      "Oj, mamy w zanadrzu całkiem sporo! 🐝",
    ],
    cta: "Zobacz listę produktów",
    outro: [
      "Bo to nie tylko miód. To cały świat skarbów stworzonych przez pszczoły — skarbów, którymi chcemy się z Wami dzielić.",
      "Naszym celem jest dostarczanie Wam najlepszych produktów pszczelich prosto do domu — łatwo, wygodnie, w uczciwych cenach i z odrobiną radości! :-)",
    ],
    valuesHeading: "🌋 NASZE WARTOŚCI",
    values: [
      {
        title: "🐝 PROSTO OD PSZCZÓŁ",
        body: "Bez zbędnych pośredników — prosto z rąk pszczelarza do Waszego domu.",
      },
      {
        title: "🌿 NATURALNIE I AUTENTYCZNIE",
        body: "Stworzone przez naturę. Zebrane przez pszczoły. Przygotowane z troską człowieka.",
      },
      {
        title: "⚖️ UCZCIWE I PRZYSTĘPNE CENY",
        body: "Wierzymy, że wysokiej jakości produkty pszczele nie powinny być luksusem dostępnym tylko dla nielicznych.",
      },
      {
        title: "🍯 BOGACTWO PRODUKTÓW PSZCZELICH",
        body: "Od miodu, przez pyłek kwiatowy i pierzgę, aż po inne skarby ula.",
      },
      {
        title: "🇱🇹 🇮🇸 OFICJALNIE DZIAŁAMY NA LITWIE I W ISLANDII",
        body: "Odpowiedzialne pozyskiwanie produktów, identyfikowalne pochodzenie i pełna zgodność z normami bezpieczeństwa żywności.",
      },
      {
        title: "🤝 Z RĄK DO RĄK\n❤️ Z SERCA DO SERCA",
        body: "Bo to, co przekazujemy innym, ma równie wielkie znaczenie jak to, co sprzedajemy.",
      },
    ],
    close1: "🍯 HONEY VOLCANO",
    close2: "NIECH SZCZĘŚCIE WYBUCHNIE! 🌋",
  },

  contact: {
    title: "Kontakt",
    lead: "Dwa sposoby kontaktu. Telefon jest najszybszy.",
    writeHeading: "Napisz do nas",
    writeBody: "Zostaw wiadomość, a my się odezwiemy.",
    callHeading: "Zadzwoń bezpośrednio",
    callBody: "Odpowiadamy po islandzku, angielsku, litewsku, polsku i rosyjsku.",
    name: "Imię",
    email: "E-mail",
    phone: "Telefon",
    message: "Wiadomość",
    optional: "opcjonalnie",
    send: "Wyślij wiadomość",
    sending: "Wysyłanie…",
    success: "Dziękujemy — wiadomość do nas dotarła. Odezwiemy się wkrótce.",
    error: "Nie udało się wysłać. Spróbuj ponownie albo zadzwoń.",
    errName: "Podaj swoje imię.",
    errContact: "Zostaw adres e-mail albo numer telefonu.",
    errEmail: "Ten adres e-mail wygląda na nieprawidłowy.",
    detailsHeading: "Dane firmy",
    vat: "Numer VAT",
    addressLabel: "Adres",
    emailLabel: "E-mail",
    phoneLabel: "Telefon",
  },

  stores: {
    title: "Gdzie kupić",
    intro: "Miodu Honey Volcano szukajcie w sklepach w całej Islandii.",
    priceNote: "Nasze sklepy partnerskie sprzedają w tej samej cenie detalicznej co my.",
    tasteNote: "Chcecie spróbować przed zakupem? Wystarczy zadzwonić.",
    listHeading: "Wszystkie sklepy",
    hours: "Godziny otwarcia",
    hoursUnknown: "Godziny otwarcia niepodane — zapytaj w sklepie",
    address: "Adres",
    flyTo: "Pokaż na mapie",
    stockistHeading: "Tu może być też Wasz sklep",
    stockistBody: "Skontaktujcie się z nami, a znajdziemy warunki, które osłodzą życie.",
    stockistContact: "Skontaktuj się",
    count: "sklepów",
    mapLabel: "Mapa sklepów sprzedających miód Honey Volcano na Islandii",
  },

  terms: {
    title: "Regulamin",
    updated: "Ostatnia aktualizacja",
    intro: "Warunki, które obowiązują przy korzystaniu z tej strony i przy zamówieniu.",
    s1h: "Z kim masz do czynienia",
    s1b: "Jordanas Golovinas, NIP 161171, Miðholt 1, 270 Mosfellsbær, Islandia. E-mail golovinasjordanas@gmail.com, telefon +354 834 0999.",
    s2h: "Czym jest ta strona",
    s2b: "Katalog naszego miodu i produktów pszczelich. Nie ma tu koszyka. Zamawia się telefonicznie, a nic na tej stronie nie jest wiążącą ofertą, dopóki nie potwierdzimy tego przez telefon.",
    s3h: "Ceny",
    s3b: "Ceny podane są w koronach islandzkich i zawierają VAT. Mogą się zmieniać. Płacisz cenę, którą potwierdzimy przez telefon.",
    s4h: "Zamówienie i odbiór",
    s4b: "Produkty, ilość i sposób odbioru ustalamy przez telefon. Wtedy powiemy, co jest dostępne i kiedy można to odebrać.",
    s5h: "Płatność",
    s5b: "Płatność następuje bezpośrednio u nas przy odbiorze zamówienia. Przez tę stronę nie przyjmujemy płatności.",
    s6h: "Bezpieczeństwo żywności i alergie",
    s6b: "Sprzedajemy naturalny miód i produkty pszczele. Nie podawaj miodu dzieciom poniżej 12. miesiąca życia. Produkty pszczele mogą wywołać reakcję u osób uczulonych na pyłki lub użądlenia pszczół. Zapytaj nas, jeśli masz wątpliwości.",
    s7h: "Jeśli coś jest nie tak",
    s7b: "Powiedz nam jak najszybciej, a naprawimy to: wymienimy towar albo zwrócimy pieniądze. Twoje prawa wynikające z islandzkiego prawa konsumenckiego pozostają bez zmian.",
    s8h: "Teksty i zdjęcia",
    s8b: "Teksty, zdjęcia oraz nazwa i znak Honey Volcano należą do nas. Prosimy nie wykorzystywać ich bez pytania.",
    s9h: "Prawo i zmiany regulaminu",
    s9b: "Obowiązuje prawo islandzkie, a sądy islandzkie są właściwe. Jeśli zmienimy ten regulamin, zaktualizujemy tę stronę i datę powyżej.",
    note: "Ten regulamin to wstępny szablon do sprawdzenia przez właściciela. Nie jest to porada prawna.",
  },
  privacy: {
    title: "Polityka prywatności",
    updated: "Ostatnia aktualizacja",
    intro: "Co dzieje się z Twoimi danymi na tej stronie. Zbieramy bardzo mało.",
    s1h: "Kto jest administratorem",
    s1b: "Jordanas Golovinas, numer VAT 161171, Miðholt 1, 270 Mosfellsbær, Islandia. E-mail golovinasjordanas@gmail.com, telefon +354 834 0999.",
    s2h: "Co zbieramy",
    s2b: "Tylko to, co wpiszecie w formularzu kontaktowym: imię, adres e-mail, numer telefonu, jeśli go podacie, oraz wiadomość. Strona nie ustawia żadnych reklamowych ani śledzących plików cookie i nie korzystamy z zewnętrznej usługi analitycznej. Strona liczy odsłony i kliknięcia przycisków w anonimowym zestawieniu, które nie zawiera danych osobowych i nie pozwala Was zidentyfikować.",
    s3h: "Dlaczego i na jakiej podstawie prawnej",
    s3b: "Wykorzystujemy Wasze dane w jednym celu: żeby Wam odpowiedzieć. Podstawą prawną jest nasz prawnie uzasadniony interes polegający na odpowiedzi na zapytanie, które sami zdecydowaliście się wysłać, a gdy wiadomość dotyczy zamówienia — podjęcie działań na Wasze żądanie przed zawarciem umowy.",
    s4h: "Jak długo przechowujemy",
    s4b: "Zapytania przechowujemy do 24 miesięcy, żeby móc wrócić do zamówienia lub powtórnego pytania, a potem je usuwamy. W każdej chwili możecie poprosić o wcześniejsze usunięcie.",
    s5h: "Kto jeszcze to widzi",
    s5b: "Strona jest hostowana przez Netlify, na którego serwerach wiadomość jest zapisywana, żeby właściciel mógł ją przeczytać. Netlify działa jako nasz podmiot przetwarzający i nie wykorzystuje Waszych danych do własnych celów. Nigdy nie sprzedajemy Waszych danych i nikomu nie przekazujemy ich w celach marketingowych.",
    s6h: "Wasze prawa",
    s6b: "Możecie poprosić o kopię tego, co o Was przechowujemy, o sprostowanie, usunięcie, ograniczenie wykorzystania albo wnieść sprzeciw wobec wykorzystania. Napiszcie na golovinasjordanas@gmail.com, a odpowiemy w ciągu miesiąca.",
    s7h: "Skargi",
    s7b: "Jeśli uważacie, że źle obeszliśmy się z Waszymi danymi, powiedzcie nam najpierw, żebyśmy mogli to naprawić. Macie też prawo złożyć skargę do islandzkiego organu ochrony danych Persónuvernd (personuvernd.is).",
    s8h: "Zmiany w polityce",
    s8b: "Jeśli zmienimy sposób postępowania z danymi, zaktualizujemy tę stronę i zmienimy datę powyżej.",
    note: "Ta polityka to wstępny szablon przygotowany do przejrzenia przez właściciela. Nie stanowi porady prawnej.",
  },

  cta: {
    heading: "Niech szczęście wybuchnie.",
    subtitle: "Zadzwoń, a przywieziemy próbkę.",
    placeholder: "Twój e-mail",
    button: "Zapisz się",
    success: "Dziękujemy — jesteś na liście.",
    invalid: "Podaj prawidłowy adres e-mail.",
    call: "Zadzwoń i spróbuj",
    callNow: "Zadzwoń teraz",
    copy: "Kopiuj",
    copied: "Skopiowano",
  },

  footer: {
    tagline: "Naturalny miód i wszystkie produkty pszczele",
    made: "Przywiezione z Litwy. Przekazane na Islandii.",
    rights: "Wszelkie prawa zastrzeżone.",
    privacy: "Polityka prywatności",
    terms: "Regulamin",
    pages: "Strony",
    contact: "Kontakt",
  },

  video: {
    button: "Zadzwoń i spróbuj",
  },

  story: {
    eyebrow: "Tam się zaczyna",
    heading: "Zrodzony na równinach\nLitwy",
    body1: "Łąki koniczyny, lipy i dzikich kwiatów, obrabiane przez niespieszne pszczoły.",
    body2: "Małe partie, naturalny, niefiltrowany. Na północ własnymi rękami.",
    stat1: "Naturalny",
    stat2: "Mała partia",
    stat3: "Niefiltrowany",
  },
};

export default pl;

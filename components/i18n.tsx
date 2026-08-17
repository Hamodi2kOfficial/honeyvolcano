"use client";

import * as React from "react";

export type Lang = "en" | "lt" | "is" | "es" | "ru" | "pl";

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "lt", label: "LT", name: "Lietuvių" },
  { code: "is", label: "IS", name: "Íslenska" },
  { code: "es", label: "ES", name: "Español" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "pl", label: "PL", name: "Polski" },
];

const en = {
  nav: { story: "Story", honey: "The Honey", products: "Products", cta: "Taste the Volcano" },
  story: {
    eyebrow: "Untamed Origin",
    heading: "Born of wild forests\nand volcanic air",
    body1:
      "Our honey is gathered where the road ends — in high forests ringed by snow-capped peaks and rivers of purple lupine. No highways. No hurry. Only the quiet work of bees among wildflowers.",
    body2:
      "Every harvest is small, raw, and unfiltered — bottled exactly as nature intended, so each jar carries the untamed character of the land it came from.",
    stat1: "Wild-foraged",
    stat2: "Small batch",
    stat3: "Unfiltered",
  },
  values: {
    eyebrow: "Real honey, nothing hidden",
    heading: "You deserve to know\nexactly what's in the jar.",
    lead: "Honey is one of the most faked foods on earth — cut with syrup, over-heated, stripped of everything that matters. Honey Volcano is the opposite: pure, traceable, and honest to the last golden drop.",
    t1: "100% Raw & Unheated",
    d1: "Never pasteurised. Enzymes, pollen and antioxidants stay alive.",
    t2: "Single-Origin & Traceable",
    d2: "From our own hives in wild volcanic highlands — you always know where your jar came from.",
    t3: "Independently Tested",
    d3: "Purity and authenticity verified. No syrups, no additives, no dilution.",
    t4: "Nothing Added, Ever",
    d4: "Just honey, exactly as the bees made it.",
    vision: "Our promise: if you can't taste the difference, it isn't Honey Volcano.",
  },
  letter: {
    eyebrow: "A note from the hive",
    heading: "We don't make honey.\nThe forest does.",
    p1: "We simply listen. We watch the lupine bloom, follow the bees into the treeline, and let the season decide when the honey is ready.",
    p2: "What you taste is the mountain morning, the wildflower meadow, and the slow patience of untouched nature. Nothing added. Nothing rushed.",
    p3: "We bottle only what the forest offers — and we are grateful for every single drop.",
    signature: "— The Honey Volcano beekeepers",
  },
  band: {
    quote: "Straight from the comb.\nNothing in between.",
    sub: "Cold-extracted and raw — the way honey was always meant to be.",
  },
  product: {
    eyebrow: "Liquid Gold",
    heading: "Raw Forest Honey",
    subtitle: "Pure, unfiltered, and alive with the character of the wild.",
    f1t: "100% Raw",
    f1d: "Never heated, never processed — enzymes and pollen left intact.",
    f2t: "Artisanal Extraction",
    f2d: "Harvested by hand in small, seasonal batches.",
    f3t: "Untamed Flavor",
    f3d: "Deep, floral, and complex — shaped by wild lupine forests.",
  },
  cta: {
    heading: "Taste the Wild.",
    subtitle: "Join the waitlist and be first to receive our next raw harvest.",
    placeholder: "Your email",
    button: "Join",
    success: "Thank you — you are on the list.",
    invalid: "Please enter a valid email.",
  },
  footer: {
    tagline: "Raw Forest Honey",
    made: "Harvested in the wild. Bottled with care.",
    rights: "All rights reserved.",
  },
  products: {
    badge: "Coming Soon",
    title: "Our first harvest is almost ready.",
    subtitle:
      "We're bottling Honey Volcano raw forest honey right now. Join the list to be first in line when the jars are ready.",
    tasteEyebrow: "Try before you buy",
    tasteHeading: "Request a taste",
    tasteBody: "Curious but not convinced? Ask for a taste and judge the honey for yourself.",
    tasteNote: "Asking to taste never raises your price.",
    placeholder: "Your email",
    button: "Request a taste",
    success: "Thank you — we'll be in touch about your taste.",
    invalid: "Please enter a valid email.",
    back: "Back to home",
  },
};

type Dict = typeof en;

const lt: Dict = {
  nav: { story: "Istorija", honey: "Medus", products: "Produktai", cta: "Paragauk ugnikalnio" },
  story: {
    eyebrow: "Laukinė kilmė",
    heading: "Gimęs laukiniuose miškuose\nir ugnikalnių ore",
    body1:
      "Mūsų medų renkame ten, kur baigiasi kelias — aukštuose miškuose, apsuptuose sniegu padengtų viršūnių ir violetinių lubinų upių. Jokių greitkelių. Jokios skubos. Tik tylus bičių darbas tarp laukinių gėlių.",
    body2:
      "Kiekvienas derlius mažas, žalias ir nefiltruotas — supilstytas tiksliai taip, kaip sumanė gamta, todėl kiekvienas indelis neša žemės, iš kurios kilo, laukinį charakterį.",
    stat1: "Laukinis",
    stat2: "Maža partija",
    stat3: "Nefiltruotas",
  },
  values: {
    eyebrow: "Tikras medus, nieko paslėpta",
    heading: "Turite žinoti,\nkas tiksliai yra stiklainyje.",
    lead: "Medus – vienas dažniausiai klastojamų maisto produktų pasaulyje: skiedžiamas sirupu, perkaitinamas, atimant viską, kas svarbu. „Honey Volcano“ yra priešingybė: grynas, atsekamas ir sąžiningas iki paskutinio auksinio lašo.",
    t1: "100 % žalias ir nekaitintas",
    d1: "Niekada nepasterizuotas. Fermentai, žiedadulkės ir antioksidantai išlieka gyvi.",
    t2: "Vienos kilmės ir atsekamas",
    d2: "Iš mūsų pačių avilių laukinėse ugnikalnių aukštumose – visada žinote, iš kur jūsų stiklainis.",
    t3: "Nepriklausomai ištirtas",
    d3: "Grynumas ir autentiškumas patvirtinti. Jokių sirupų, priedų ar skiedimo.",
    t4: "Niekada nieko nepridėta",
    d4: "Tik medus, toks, kokį sukūrė bitės.",
    vision: "Mūsų pažadas: jei nejaučiate skirtumo, tai ne „Honey Volcano“.",
  },
  letter: {
    eyebrow: "Žinutė iš avilio",
    heading: "Medaus negaminame mes.\nJį kuria miškas.",
    p1: "Mes tiesiog klausomės. Stebime, kaip žydi lubinai, sekame bites į miško pakraštį ir leidžiame sezonui nuspręsti, kada medus paruoštas.",
    p2: "Tai, ką ragaujate, yra kalnų rytas, laukinių gėlių pieva ir lėta nepaliestos gamtos kantrybė. Nieko nepridėta. Niekur neskubama.",
    p3: "Supilstome tik tai, ką dovanoja miškas — ir esame dėkingi už kiekvieną lašą.",
    signature: "— Honey Volcano bitininkai",
  },
  band: {
    quote: "Tiesiai iš korio.\nNieko tarp jūsų ir jo.",
    sub: "Šaltai išgautas ir žalias — toks, koks medus visada turėjo būti.",
  },
  product: {
    eyebrow: "Skystas auksas",
    heading: "Žalias miško medus",
    subtitle: "Grynas, nefiltruotas ir gyvas laukinės gamtos charakteriu.",
    f1t: "100% žalias",
    f1d: "Niekada nekaitintas, neapdorotas — fermentai ir žiedadulkės nepaliesti.",
    f2t: "Rankų darbo išgava",
    f2d: "Renkamas rankomis mažomis sezoninėmis partijomis.",
    f3t: "Laukinis skonis",
    f3d: "Gilus, gėlėtas ir sudėtingas — suformuotas laukinių lubinų miškų.",
  },
  cta: {
    heading: "Paragauk laukinės gamtos.",
    subtitle: "Prisijunk prie laukiančiųjų ir pirmas gauk kitą žalią derlių.",
    placeholder: "Jūsų el. paštas",
    button: "Prisijungti",
    success: "Ačiū — jūs sąraše.",
    invalid: "Įveskite teisingą el. paštą.",
  },
  footer: {
    tagline: "Žalias miško medus",
    made: "Surinkta laukinėje gamtoje. Supilstyta su rūpesčiu.",
    rights: "Visos teisės saugomos.",
  },
  products: {
    badge: "Netrukus",
    title: "Pirmasis derlius beveik paruoštas.",
    subtitle:
      "Šiuo metu pilstome „Honey Volcano“ žalią miško medų. Prisijunkite prie sąrašo ir būkite pirmi, kai stiklainiai bus paruošti.",
    tasteEyebrow: "Paragauk prieš pirkdamas",
    tasteHeading: "Paprašyk paragauti",
    tasteBody: "Smalsu, bet neįsitikinę? Paprašykite paragauti ir nuspręskite patys.",
    tasteNote: "Prašymas paragauti niekada nepakelia kainos.",
    placeholder: "Jūsų el. paštas",
    button: "Prašyti paragauti",
    success: "Ačiū – susisieksime dėl degustacijos.",
    invalid: "Įveskite teisingą el. paštą.",
    back: "Grįžti į pradžią",
  },
};

const is: Dict = {
  nav: { story: "Saga", honey: "Hunangið", products: "Vörur", cta: "Smakkaðu eldfjallið" },
  story: {
    eyebrow: "Villtur uppruni",
    heading: "Fætt af villtum skógum\nog eldfjallalofti",
    body1:
      "Hunangið okkar er sótt þar sem vegurinn endar — í háum skógum umkringdum snævi þöktum tindum og fljótum af fjólubláum lúpínum. Engir þjóðvegir. Enginn asi. Aðeins hljóðlát vinna býflugna á meðal villtra blóma.",
    body2:
      "Hver uppskera er lítil, hrá og ósíuð — sett á glas nákvæmlega eins og náttúran ætlaði, svo hvert glas ber villtan karakter landsins sem það kom frá.",
    stat1: "Villtsafnað",
    stat2: "Lítil lota",
    stat3: "Ósíað",
  },
  values: {
    eyebrow: "Ekta hunang, ekkert falið",
    heading: "Þú átt skilið að vita\nnákvæmlega hvað er í krukkunni.",
    lead: "Hunang er ein mest fölsuðu matvara heims — blandað sírópi, ofhitað og svipt öllu sem máli skiptir. Honey Volcano er andstæðan: hreint, rekjanlegt og heiðarlegt til síðasta gulldropa.",
    t1: "100% hrátt og óhitað",
    d1: "Aldrei gerilsneytt. Ensím, frjókorn og andoxunarefni haldast lifandi.",
    t2: "Einn uppruni og rekjanlegt",
    d2: "Úr okkar eigin búum í villtu eldfjallahálendi — þú veist alltaf hvaðan krukkan þín kemur.",
    t3: "Óháð prófað",
    d3: "Hreinleiki og áreiðanleiki staðfestur. Ekkert síróp, engin aukefni, engin þynning.",
    t4: "Engu bætt við, aldrei",
    d4: "Bara hunang, nákvæmlega eins og býflugurnar bjuggu það til.",
    vision: "Loforð okkar: ef þú finnur ekki muninn, þá er það ekki Honey Volcano.",
  },
  letter: {
    eyebrow: "Orðsending frá búinu",
    heading: "Við búum ekki til hunang.\nSkógurinn gerir það.",
    p1: "Við hlustum einfaldlega. Við fylgjumst með lúpínunni blómstra, fylgjum býflugunum inn í skógarjaðarinn og leyfum árstíðinni að ráða hvenær hunangið er tilbúið.",
    p2: "Það sem þú bragðar er fjallamorgunninn, villiblómaengið og hæg þolinmæði ósnortinnar náttúru. Engu bætt við. Ekkert flýtt.",
    p3: "Við setjum aðeins á glas það sem skógurinn gefur — og við erum þakklát fyrir hvern einasta dropa.",
    signature: "— Býflugnabændur Honey Volcano",
  },
  band: {
    quote: "Beint úr vaxkökunni.\nEkkert þar á milli.",
    sub: "Kaldunnið og hrátt — eins og hunang átti alltaf að vera.",
  },
  product: {
    eyebrow: "Fljótandi gull",
    heading: "Hrátt skógarhunang",
    subtitle: "Hreint, ósíað og iðandi af karakter villtrar náttúru.",
    f1t: "100% hrátt",
    f1d: "Aldrei hitað, aldrei unnið — ensím og frjókorn ósnortin.",
    f2t: "Handverksvinnsla",
    f2d: "Handtekið í litlum, árstíðabundnum lotum.",
    f3t: "Villt bragð",
    f3d: "Djúpt, blómlegt og margslungið — mótað af villtum lúpínuskógum.",
  },
  cta: {
    heading: "Smakkaðu villta náttúru.",
    subtitle: "Skráðu þig á biðlistann og fáðu næstu hráu uppskeru fyrst.",
    placeholder: "Netfangið þitt",
    button: "Skrá",
    success: "Takk — þú ert á listanum.",
    invalid: "Sláðu inn gilt netfang.",
  },
  footer: {
    tagline: "Hrátt skógarhunang",
    made: "Safnað í villtri náttúru. Sett á glas af alúð.",
    rights: "Allur réttur áskilinn.",
  },
  products: {
    badge: "Kemur bráðum",
    title: "Fyrsta uppskeran er næstum tilbúin.",
    subtitle:
      "Við erum að setja Honey Volcano hrátt skógarhunang á glas núna. Skráðu þig á listann til að vera fyrst þegar krukkurnar eru tilbúnar.",
    tasteEyebrow: "Smakkaðu áður en þú kaupir",
    tasteHeading: "Biðja um smakk",
    tasteBody: "Forvitin en ekki viss? Biddu um smakk og dæmdu hunangið sjálf.",
    tasteNote: "Að biðja um smakk hækkar aldrei verðið þitt.",
    placeholder: "Netfangið þitt",
    button: "Biðja um smakk",
    success: "Takk — við höfum samband varðandi smakkið.",
    invalid: "Sláðu inn gilt netfang.",
    back: "Til baka á forsíðu",
  },
};

const es: Dict = {
  nav: { story: "Historia", honey: "La Miel", products: "Productos", cta: "Prueba el volcán" },
  story: {
    eyebrow: "Origen indómito",
    heading: "Nacida de bosques salvajes\ny aire volcánico",
    body1:
      "Nuestra miel se recoge donde termina el camino: en bosques altos rodeados de cumbres nevadas y ríos de altramuz púrpura. Sin autopistas. Sin prisa. Solo el trabajo silencioso de las abejas entre flores silvestres.",
    body2:
      "Cada cosecha es pequeña, cruda y sin filtrar, envasada tal como la naturaleza lo quiso, para que cada tarro lleve el carácter indómito de la tierra de la que proviene.",
    stat1: "Silvestre",
    stat2: "Lote pequeño",
    stat3: "Sin filtrar",
  },
  values: {
    eyebrow: "Miel de verdad, nada oculto",
    heading: "Mereces saber\nexactamente qué hay en el tarro.",
    lead: "La miel es uno de los alimentos más falsificados del mundo: cortada con jarabe, sobrecalentada, despojada de todo lo que importa. Honey Volcano es lo contrario: pura, trazable y honesta hasta la última gota dorada.",
    t1: "100% cruda y sin calentar",
    d1: "Nunca pasteurizada. Enzimas, polen y antioxidantes siguen vivos.",
    t2: "Origen único y trazable",
    d2: "De nuestras propias colmenas en tierras altas volcánicas: siempre sabes de dónde viene tu tarro.",
    t3: "Analizada de forma independiente",
    d3: "Pureza y autenticidad verificadas. Sin jarabes, sin aditivos, sin dilución.",
    t4: "Nada añadido, nunca",
    d4: "Solo miel, tal como la hicieron las abejas.",
    vision: "Nuestra promesa: si no notas la diferencia, no es Honey Volcano.",
  },
  letter: {
    eyebrow: "Una nota desde la colmena",
    heading: "No hacemos miel.\nEl bosque la hace.",
    p1: "Solo escuchamos. Observamos florecer el altramuz, seguimos a las abejas hasta el linde del bosque y dejamos que la estación decida cuándo la miel está lista.",
    p2: "Lo que pruebas es la mañana en la montaña, el prado de flores silvestres y la lenta paciencia de la naturaleza intacta. Nada añadido. Nada apresurado.",
    p3: "Envasamos solo lo que el bosque ofrece, y agradecemos cada gota.",
    signature: "— Los apicultores de Honey Volcano",
  },
  band: {
    quote: "Directa del panal.\nNada en medio.",
    sub: "Extraída en frío y cruda, como la miel siempre debió ser.",
  },
  product: {
    eyebrow: "Oro líquido",
    heading: "Miel cruda del bosque",
    subtitle: "Pura, sin filtrar y viva con el carácter de lo salvaje.",
    f1t: "100% cruda",
    f1d: "Nunca calentada ni procesada: enzimas y polen intactos.",
    f2t: "Extracción artesanal",
    f2d: "Recogida a mano en pequeños lotes de temporada.",
    f3t: "Sabor indómito",
    f3d: "Profundo, floral y complejo, moldeado por bosques de altramuz salvaje.",
  },
  cta: {
    heading: "Prueba lo salvaje.",
    subtitle: "Únete a la lista de espera y sé el primero en recibir nuestra próxima cosecha cruda.",
    placeholder: "Tu correo",
    button: "Unirme",
    success: "Gracias, estás en la lista.",
    invalid: "Introduce un correo válido.",
  },
  footer: {
    tagline: "Miel cruda del bosque",
    made: "Recogida en lo salvaje. Envasada con cuidado.",
    rights: "Todos los derechos reservados.",
  },
  products: {
    badge: "Muy pronto",
    title: "Nuestra primera cosecha casi está lista.",
    subtitle:
      "Estamos envasando la miel cruda del bosque de Honey Volcano ahora mismo. Únete a la lista para ser el primero cuando los tarros estén listos.",
    tasteEyebrow: "Prueba antes de comprar",
    tasteHeading: "Solicita una cata",
    tasteBody: "¿Con curiosidad pero sin convencer? Pide una cata y juzga la miel por ti mismo.",
    tasteNote: "Pedir una cata nunca sube tu precio.",
    placeholder: "Tu correo",
    button: "Solicitar cata",
    success: "Gracias, te contactaremos para tu cata.",
    invalid: "Introduce un correo válido.",
    back: "Volver al inicio",
  },
};

const ru: Dict = {
  nav: { story: "История", honey: "Мёд", products: "Товары", cta: "Попробуй вулкан" },
  story: {
    eyebrow: "Дикое происхождение",
    heading: "Рождён дикими лесами\nи воздухом вулканов",
    body1:
      "Наш мёд собирают там, где кончается дорога, — в высоких лесах, окружённых заснеженными вершинами и реками пурпурного люпина. Никаких магистралей. Никакой спешки. Только тихая работа пчёл среди полевых цветов.",
    body2:
      "Каждый сбор мал, сырой и нефильтрованный — разлит именно так, как задумала природа, чтобы каждая банка хранила дикий характер своей земли.",
    stat1: "Дикий сбор",
    stat2: "Малая партия",
    stat3: "Нефильтрованный",
  },
  values: {
    eyebrow: "Настоящий мёд, ничего не скрыто",
    heading: "Вы вправе знать,\nчто именно в банке.",
    lead: "Мёд — один из самых подделываемых продуктов в мире: разбавляют сиропом, перегревают, лишают всего ценного. Honey Volcano — полная противоположность: чистый, прослеживаемый и честный до последней золотой капли.",
    t1: "100% сырой и ненагретый",
    d1: "Никогда не пастеризован. Ферменты, пыльца и антиоксиданты остаются живыми.",
    t2: "Одно происхождение и прослеживаемость",
    d2: "С наших собственных пасек в диких вулканических нагорьях — вы всегда знаете, откуда ваша банка.",
    t3: "Независимо проверен",
    d3: "Чистота и подлинность подтверждены. Никаких сиропов, добавок и разбавления.",
    t4: "Ничего не добавлено, никогда",
    d4: "Только мёд, ровно таким, каким его создали пчёлы.",
    vision: "Наше обещание: если вы не чувствуете разницы — это не Honey Volcano.",
  },
  letter: {
    eyebrow: "Записка из улья",
    heading: "Мы не делаем мёд.\nЕго делает лес.",
    p1: "Мы просто слушаем. Смотрим, как цветёт люпин, идём за пчёлами к опушке леса и позволяем сезону решить, когда мёд готов.",
    p2: "То, что вы пробуете, — это горное утро, луг полевых цветов и медленное терпение нетронутой природы. Ничего не добавлено. Никакой спешки.",
    p3: "Мы разливаем только то, что даёт лес, и благодарны за каждую каплю.",
    signature: "— Пчеловоды Honey Volcano",
  },
  band: {
    quote: "Прямо из соты.\nНичего между.",
    sub: "Холодного отжима и сырой — таким мёд и должен быть.",
  },
  product: {
    eyebrow: "Жидкое золото",
    heading: "Сырой лесной мёд",
    subtitle: "Чистый, нефильтрованный и живой характером дикой природы.",
    f1t: "100% сырой",
    f1d: "Никогда не нагревался и не обрабатывался — ферменты и пыльца нетронуты.",
    f2t: "Ремесленная добыча",
    f2d: "Собран вручную малыми сезонными партиями.",
    f3t: "Дикий вкус",
    f3d: "Глубокий, цветочный и сложный — сформирован дикими лесами люпина.",
  },
  cta: {
    heading: "Почувствуй дикое.",
    subtitle: "Присоединяйтесь к списку ожидания и первыми получите наш следующий сырой сбор.",
    placeholder: "Ваш e-mail",
    button: "Присоединиться",
    success: "Спасибо — вы в списке.",
    invalid: "Введите корректный e-mail.",
  },
  footer: {
    tagline: "Сырой лесной мёд",
    made: "Собрано в дикой природе. Разлито с заботой.",
    rights: "Все права защищены.",
  },
  products: {
    badge: "Скоро",
    title: "Наш первый сбор почти готов.",
    subtitle:
      "Прямо сейчас мы разливаем сырой лесной мёд Honey Volcano. Присоединяйтесь к списку, чтобы быть первыми, когда банки будут готовы.",
    tasteEyebrow: "Попробуйте перед покупкой",
    tasteHeading: "Запросить дегустацию",
    tasteBody: "Любопытно, но не уверены? Попросите попробовать и оцените мёд сами.",
    tasteNote: "Просьба попробовать никогда не повышает цену.",
    placeholder: "Ваш e-mail",
    button: "Запросить дегустацию",
    success: "Спасибо — мы свяжемся с вами по поводу дегустации.",
    invalid: "Введите корректный e-mail.",
    back: "На главную",
  },
};

const pl: Dict = {
  nav: { story: "Historia", honey: "Miód", products: "Produkty", cta: "Posmakuj wulkanu" },
  story: {
    eyebrow: "Dzikie pochodzenie",
    heading: "Zrodzony z dzikich lasów\ni wulkanicznego powietrza",
    body1:
      "Nasz miód zbieramy tam, gdzie kończy się droga — w wysokich lasach otoczonych ośnieżonymi szczytami i rzekami purpurowego łubinu. Żadnych autostrad. Żadnego pośpiechu. Tylko cicha praca pszczół wśród dzikich kwiatów.",
    body2:
      "Każdy zbiór jest mały, surowy i niefiltrowany — butelkowany dokładnie tak, jak chciała natura, aby każdy słoik niósł dziki charakter ziemi, z której pochodzi.",
    stat1: "Dziko zbierany",
    stat2: "Mała partia",
    stat3: "Niefiltrowany",
  },
  values: {
    eyebrow: "Prawdziwy miód, nic ukrytego",
    heading: "Masz prawo wiedzieć,\nco dokładnie jest w słoiku.",
    lead: "Miód to jeden z najczęściej fałszowanych produktów na świecie — rozcieńczany syropem, przegrzewany, pozbawiany wszystkiego, co ważne. Honey Volcano jest przeciwieństwem: czysty, identyfikowalny i uczciwy do ostatniej złotej kropli.",
    t1: "100% surowy i niepodgrzewany",
    d1: "Nigdy niepasteryzowany. Enzymy, pyłek i antyoksydanty pozostają żywe.",
    t2: "Jedno źródło i identyfikowalność",
    d2: "Z naszych własnych pasiek na dzikich wulkanicznych wyżynach — zawsze wiesz, skąd pochodzi twój słoik.",
    t3: "Niezależnie przebadany",
    d3: "Czystość i autentyczność potwierdzone. Bez syropów, bez dodatków, bez rozcieńczania.",
    t4: "Nic dodanego, nigdy",
    d4: "Tylko miód, dokładnie taki, jaki zrobiły pszczoły.",
    vision: "Nasza obietnica: jeśli nie czujesz różnicy, to nie jest Honey Volcano.",
  },
  letter: {
    eyebrow: "Słowo z ula",
    heading: "Nie robimy miodu.\nRobi go las.",
    p1: "Po prostu słuchamy. Patrzymy, jak kwitnie łubin, idziemy za pszczołami na skraj lasu i pozwalamy, by pora roku zdecydowała, kiedy miód jest gotowy.",
    p2: "To, co smakujesz, to górski poranek, łąka dzikich kwiatów i powolna cierpliwość nietkniętej natury. Nic dodanego. Nic w pośpiechu.",
    p3: "Butelkujemy tylko to, co daje las — i jesteśmy wdzięczni za każdą kroplę.",
    signature: "— Pszczelarze Honey Volcano",
  },
  band: {
    quote: "Prosto z plastra.\nNic pomiędzy.",
    sub: "Wyciskany na zimno i surowy — taki, jaki miód zawsze miał być.",
  },
  product: {
    eyebrow: "Płynne złoto",
    heading: "Surowy miód leśny",
    subtitle: "Czysty, niefiltrowany i żywy charakterem dzikiej natury.",
    f1t: "100% surowy",
    f1d: "Nigdy niepodgrzewany ani przetwarzany — enzymy i pyłek nienaruszone.",
    f2t: "Rzemieślnicze pozyskiwanie",
    f2d: "Zbierany ręcznie w małych sezonowych partiach.",
    f3t: "Dziki smak",
    f3d: "Głęboki, kwiatowy i złożony — ukształtowany przez dzikie lasy łubinu.",
  },
  cta: {
    heading: "Posmakuj dzikości.",
    subtitle: "Dołącz do listy oczekujących i jako pierwszy otrzymaj nasz kolejny surowy zbiór.",
    placeholder: "Twój e-mail",
    button: "Dołącz",
    success: "Dziękujemy — jesteś na liście.",
    invalid: "Podaj prawidłowy e-mail.",
  },
  footer: {
    tagline: "Surowy miód leśny",
    made: "Zebrany w dziczy. Butelkowany z troską.",
    rights: "Wszelkie prawa zastrzeżone.",
  },
  products: {
    badge: "Wkrótce",
    title: "Nasz pierwszy zbiór jest prawie gotowy.",
    subtitle:
      "Właśnie teraz butelkujemy surowy miód leśny Honey Volcano. Dołącz do listy, aby być pierwszym, gdy słoiki będą gotowe.",
    tasteEyebrow: "Spróbuj przed zakupem",
    tasteHeading: "Poproś o degustację",
    tasteBody: "Ciekawy, ale nieprzekonany? Poproś o próbkę i oceń miód sam.",
    tasteNote: "Prośba o degustację nigdy nie podnosi ceny.",
    placeholder: "Twój e-mail",
    button: "Poproś o degustację",
    success: "Dziękujemy — skontaktujemy się w sprawie degustacji.",
    invalid: "Podaj prawidłowy e-mail.",
    back: "Powrót do strony głównej",
  },
};

const DICTS: Record<Lang, Dict> = { en, lt, is, es, ru, pl };

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const Ctx = React.createContext<I18nContext | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    // Read the saved language after mount (client-only) so SSR and the first
    // client render both start from "en" — avoids a hydration mismatch.
    const saved = window.localStorage.getItem("medaus-lang") as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("medaus-lang", l);
    document.documentElement.lang = l;
  }, []);

  const value = React.useMemo<I18nContext>(
    () => ({ lang, setLang, t: DICTS[lang] }),
    [lang, setLang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

import type { Dict } from "@/lib/locales/en";

/**
 * Español — the About page is the owner's own text; the rest still NEEDS
 * NATIVE REVIEW.
 *
 * Everything under `about` was written by the owner and is used as supplied.
 * The rest of the file is translated from the English source, keeping his
 * warm first-person voice rather than a polished marketing tone.
 */
const es: Dict = {
  nav: {
    home: "Inicio",
    products: "Productos",
    stores: "Dónde comprar",
    about: "Sobre Honey Volcano",
    best: "¿Qué me conviene?",
    bestSoon: "Muy pronto",
    contact: "Información de contacto",
    gallery: "Galería",
    menu: "Menú",
    close: "Cerrar menú",
    theme: "Cambiar entre claro y oscuro",
    language: "Idioma",
    chooseLanguage: "Elige un idioma",
  },

  hero: {
    tagline: "Miel cruda y todos los productos de la colmena",
    lead: "Miel lituana. Recogida en un colmenar familiar de Lituania.",
    slogan: "Que la felicidad estalle como un volcán",
    sealsLabel: "Lo que promete cada tarro",
    sealsClose: "Cerrar",
  },


  gallery: {
    pause: "Pausar la presentación",
    play: "Reproducir la presentación",
  },
  stamps: {
    s1: "Directo de las abejas",
    s2: "Natural y auténtico",
    s3: "Precio justo",
    s4: "Todos los productos de la colmena",
    s5: "Autorizados en LT e IS",
    s6: "De mano a mano • De corazón a corazón",
  },

  uc: {
    label: "En construcción",
    soon: "Muy pronto",
    title: "Viene más",
    body: "Nuevos productos de la colmena, recetas y tienda en camino.",
    back: "Volver al inicio",
    more: "Ver lo que viene",
  },

  home: {
    rawEyebrow: "Miel cruda y todos los productos de la colmena",
    rawHeading: "Todo lo que da la colmena,\ny nada más.",
    rawBody: "Miel, polen, pan de abeja y panal — de las mismas colmenas.",
    rawP1t: "Cruda y sin calentar",
    rawP1d: "Nunca pasteurizada. El polen y las enzimas se quedan.",
    rawP2t: "Un solo apicultor",
    rawP2d: "Las mismas colmenas, las mismas manos, cada tarro.",
    rawP3t: "Traída, no enviada",
    rawP3d: "Llevada a Islandia en persona y entregada igual.",

    featEyebrow: "Primero, pruébala",
    featHeading: "Nuestras favoritas",
    featBody: "Los tarros por los que la gente vuelve.",
    featAll: "Ver todos los productos",

    s1Eyebrow: "Que la felicidad estalle como un volcán",
    s1Heading: "Una cucharada nunca basta",
    s1Body: "Comparte un tarro y mira qué pasa en la mesa.",

    s2Eyebrow: "De mano a mano",
    s2Heading: "De las manos del apicultor\ndirectamente a las tuyas",
    s2Body: "",

    s3Eyebrow: "La mañana, mejorada",
    s3Heading: "Buena en el pan.\nMejor a cucharadas.",
    s3Body: "Espesa, lenta, bien dorada. Miel como era antes.",

    ucHeading: "Se está construyendo algo dulce",
    ucBody: "Una tienda en línea, recetas y más productos de la colmena están en camino.",
  },

  trust: {
    heading: "Origen fiable.\nNegocio de fiar.",
    authorized: "Autorizados en",
    body: "Registrados y conformes con la seguridad alimentaria en ambos países.",
  },

  values: {
    eyebrow: "Miel de verdad, nada escondido",
    heading: "Sepa exactamente\nqué hay en el tarro.",
    lead: "Uno de los alimentos más falsificados del mundo. Este no.",
    t1: "Directo de las abejas",
    d1: "Sin intermediarios innecesarios: de las manos del apicultor directamente a tu casa.",
    t2: "Natural y auténtico",
    d2: "Creado por la naturaleza. Recogido por las abejas. Preparado con cuidado humano.",
    t3: "Precio justo y accesible",
    d3: "Los productos de la colmena de calidad no deberían ser un lujo.",
    t4: "Toda la gama de productos de la colmena",
    d4: "De la miel al polen, el pan de abeja y otros tesoros de la colmena.",
    vision: "Nuestra promesa: si no notas la diferencia, no es Honey Volcano.",
  },

  letter: {
    eyebrow: "Una nota desde la colmena",
    heading: "Nosotros no hacemos miel.\nLa hacen las abejas.",
    p1: "Seguimos a las abejas y dejamos decidir a la temporada.",
    p2: "Lo que pruebas es un verano lituano. Nada añadido.",
    p3: "Envasamos solo lo que dan las colmenas.",
    signature: "— Jordanas, Honey Volcano",
  },

  product: {
    heading: "Miel cruda",
    f1t: "100 % cruda",
    f2t: "Que la felicidad estalle como un volcán",
    f3t: "Natural y auténtica",
  },

  products: {
    badge: "Llama y prueba",
    call: "Llama y prueba",
    title: "Todo lo que hacen las abejas",
    subtitle: "Siete productos, un apicultor, sin intermediarios.",
    skanestaiLabel: "MEDAUS SKANĖSTAI",
    skanestaiHeading: "Miel con los colores de Lituania",
    skanestaiBody: "Tres capas, atadas con la cinta lituana.",
    tasteEyebrow: "Prueba antes de comprar",
    tasteHeading: "Pide una prueba",
    tasteBody: "Pide probarla y juzga por ti mismo.",
    tasteNote: "Pedir una prueba nunca te sube el precio.",
    placeholder: "Tu correo electrónico",
    button: "Pedir una prueba",
    success: "Gracias: te escribiremos para la prueba.",
    invalid: "Introduce un correo electrónico válido.",
    back: "Volver al inicio",
    flavours: "Elige un sabor",
    close: "Cerrar",
    tba: "Precio por anunciar",
  },

  /** One short line per product, shown when a card is opened. */
  /** The name on the jar, in each language. */
  productName: {
    "raw-honey-500": "Miel cruda 500 g",
    "raw-honey-1kg": "Miel cruda 1 kg",
    "honeycomb-300": "Panal 300 g",
    "delicacies-220": "Delicias de miel 220 g",
    "multicoloured-220": "Miel multicolor 220 g",
    "pollen-100": "Polen 100 g",
    "bee-bread-100": "Pan de abeja 100 g",
    "raspberry": "Delicia de miel con frambuesas",
    "buckthorn": "Delicia de miel con espino amarillo",
    "quince-pumpkin": "Delicia de miel con membrillo y calabaza",
    "cannabis": "Honeyvolcano con bloques de cannabis y cacao",
  },
  productDesc: {
    "raw-honey-500": "Cruda, sin calentar, directa de colmenas lituanas. El tarro diario.",
    "raw-honey-1kg": "La misma miel cruda, en el tarro que dura.",
    "honeycomb-300": "Panal cortado del cuadro. Mastícalo, cera incluida.",
    "delicacies-220": "Miel cruda batida con fruta real. Cuatro sabores.",
    "multicoloured-220": "Una caja de tarros pequeños. Todos nuestros sabores juntos.",
    "pollen-100": "Polen que las abejas recogieron. Espolvoréalo sobre cualquier cosa.",
    "bee-bread-100": "Pan de abeja: polen fermentado. Más profundo que el polen.",
  },


  /**
   * The owner's own words, used exactly as he supplied them. Each language
   * keeps its own shape — its own number of paragraphs, its own order of
   * values, and descriptions only where he wrote them. Nothing here is
   * translated, shortened or added to.
   */
  about: {
    eyebrow: "SOBRE NOSOTROS",
    title: "HONEY VOLCANO",
    tagline: "¡Que la felicidad estalle como un volcán! 🍯🌋",
    intro: [
      "Soy lituano y desde hace ya 9 años mi hogar está en la tierra del hielo y el fuego: Islandia.",
      "Nuestra historia comienza de forma sencilla, entre trabajo, naturaleza y tradición, en las verdes tierras de Lituania.",
      "Pero ahora, aquí en el Norte, una nueva explosión de dulzura está a punto de entrar en erupción como un auténtico volcán islandés: ¡MIEL LITUANA, PURA Y NATURAL! 🍯🌋",
      "Los productos de la colmena son una de esas cosas que nos unen desde lo más profundo del corazón: el deseo de volver a lo sencillo, descubrir sabores auténticos y disfrutar de esos pequeños placeres que hacen la vida un poquito más dulce.",
      "Quien haya probado alguna vez la auténtica MIEL LITUANA sabe de lo que hablamos… ¡y seguro que querrá repetir! 😊",
      "¿Y cómo podemos endulzarte la vida?",
      "¡Tenemos mucho que ofrecerte!",
      "Descubre nuestros productos y todo lo que nace de la colmena. Nosotros nos encargamos de hacerte llegar lo mejor de nuestra tierra, con toda su autenticidad y calidad.",
    ],
    cta: "",
    outro: [
    ],
    valuesHeading: "NUESTROS VALORES",
    values: [
      {
        title: "🐝 DIRECTAMENTE DE LAS ABEJAS",
        body: "",
      },
      {
        title: "⚖️ PRECIOS JUSTOS Y ACCESIBLES",
        body: "",
      },
      {
        title: "🌿 NATURAL Y AUTÉNTICO",
        body: "",
      },
      {
        title: "🍯 TODOS LOS PRODUCTOS DE LA COLMENA",
        body: "",
      },
      {
        title: "🇱🇹 🇮🇸 CERTIFICADO EN LITUANIA E ISLANDIA",
        body: "",
      },
      {
        title: "🤝 DE MANO EN MANO\n❤️ Y DE CORAZÓN A CORAZÓN",
        body: "",
      },
    ],
    close1: "",
    close2: "",
  },

  contact: {
    title: "Información de contacto",
    lead: "Dos formas de contactarnos. Llamar es lo más rápido.",
    writeHeading: "Escríbenos",
    writeBody: "Déjanos un mensaje y te respondemos.",
    callHeading: "Llama directamente",
    callBody: "Respondemos en islandés, inglés, lituano, polaco y ruso.",
    name: "Tu nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    message: "Mensaje",
    optional: "opcional",
    send: "Enviar mensaje",
    sending: "Enviando…",
    success: "Gracias: tu mensaje está con nosotros. Te escribiremos pronto.",
    error: "No se ha enviado. Inténtalo otra vez o llámanos.",
    errName: "Dinos tu nombre.",
    errContact: "Déjanos un correo electrónico o un teléfono.",
    errEmail: "Ese correo electrónico no parece correcto.",
    detailsHeading: "Datos del negocio",
    vat: "N.º de IVA",
    addressLabel: "Dirección",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
  },

  stores: {
    title: "Dónde comprar",
    intro: "Encuentra la miel Honey Volcano en tiendas de toda Islandia.",
    priceNote: "Nuestras tiendas asociadas venden al mismo precio de venta al público que nosotros.",
    tasteNote: "¿Quieres probar antes de comprar? Solo tienes que llamar.",
    listHeading: "Todas las tiendas",
    hours: "Horario",
    hoursUnknown: "Horario no indicado — pregunta en la tienda",
    address: "Dirección",
    flyTo: "Ver en el mapa",
    stockistHeading: "Tu tienda también podría estar aquí",
    stockistBody: "Ponte en contacto y buscamos las mejores condiciones para endulzar la vida.",
    stockistContact: "Ponte en contacto",
    count: "tiendas",
    mapLabel: "Mapa de tiendas que venden miel Honey Volcano en Islandia",
  },

  terms: {
    title: "Términos y condiciones",
    updated: "Última actualización",
    intro: "Las condiciones que se aplican al usar este sitio o al pedirnos algo.",
    s1h: "Con quién tratas",
    s1b: "Jordanas Golovinas, NIF 161171, Miðholt 1, 270 Mosfellsbær, Islandia. Correo golovinasjordanas@gmail.com, teléfono +354 834 0999.",
    s2h: "Qué es este sitio",
    s2b: "Un catálogo de nuestra miel y productos de la colmena. Aquí no hay carrito. Se pide por teléfono, y nada de este sitio es una oferta vinculante hasta que lo confirmemos contigo por teléfono.",
    s3h: "Precios",
    s3b: "Los precios se muestran en coronas islandesas e incluyen IVA. Pueden cambiar. El precio que confirmamos por teléfono es el que pagas.",
    s4h: "Pedido y entrega",
    s4b: "Acordamos por teléfono los productos, la cantidad y la entrega. Entonces te decimos qué hay disponible y cuándo puedes recogerlo.",
    s5h: "Pago",
    s5b: "El pago se hace directamente con nosotros al recoger o recibir el pedido. En este sitio no se cobra nada.",
    s6h: "Seguridad alimentaria y alergias",
    s6b: "Vendemos miel cruda y productos de la colmena. No des miel a menores de 12 meses. Los productos de la colmena pueden provocar reacciones en personas alérgicas al polen o a las picaduras de abeja. Pregúntanos si tienes dudas.",
    s7h: "Si algo va mal",
    s7b: "Dínoslo cuanto antes y lo arreglamos, con un cambio o con la devolución del dinero. Tus derechos como consumidor en Islandia no se ven afectados.",
    s8h: "Los textos y las fotos",
    s8b: "Los textos, las fotografías y el nombre y la marca Honey Volcano son nuestros. Por favor, no los reutilices sin preguntar.",
    s9h: "Ley y cambios en estas condiciones",
    s9b: "Se aplica la ley islandesa y son competentes los tribunales de Islandia. Si cambiamos estas condiciones, actualizaremos esta página y la fecha de arriba.",
    note: "Estas condiciones son una plantilla inicial para que el propietario la revise. No son asesoramiento legal.",
  },
  privacy: {
    title: "Política de privacidad",
    updated: "Última actualización",
    intro: "Qué pasa con tus datos en este sitio. Recogemos muy poco.",
    s1h: "Quién es el responsable",
    s1b: "Jordanas Golovinas, n.º de IVA 161171, Miðholt 1, 270 Mosfellsbær, Islandia. Correo golovinasjordanas@gmail.com, teléfono +354 834 0999.",
    s2h: "Qué recogemos",
    s2b: "Solo lo que escribes en el formulario de contacto: tu nombre, tu correo electrónico, tu teléfono si lo das y tu mensaje. El sitio no usa cookies de publicidad ni de seguimiento, y no usamos ningún servicio de analítica externo. El sitio cuenta visitas y pulsaciones de botón en un recuento anónimo que no contiene datos personales y no puede identificarte.",
    s3h: "Por qué y con qué base legal",
    s3b: "Usamos tus datos por un motivo: responderte. La base legal es nuestro interés legítimo en contestar a una consulta que tú decidiste enviarnos y, cuando el mensaje trata de un pedido, la aplicación de medidas precontractuales a petición tuya.",
    s4h: "Cuánto tiempo los guardamos",
    s4b: "Las consultas se guardan hasta 24 meses para poder retomar un pedido o una pregunta repetida, y después se borran. Puedes pedirnos que borremos la tuya antes en cualquier momento.",
    s5h: "Quién más lo ve",
    s5b: "El sitio está alojado en Netlify, en cuyos servidores se guarda el mensaje para que el propietario pueda leerlo. Netlify actúa como encargado del tratamiento y no usa tus datos para sus propios fines. Nunca vendemos tus datos ni se los pasamos a nadie con fines de marketing.",
    s6h: "Tus derechos",
    s6b: "Puedes pedir una copia de lo que guardamos sobre ti, pedir que lo corrijamos, que lo borremos, que limitemos su uso u oponerte a ese uso. Escribe a golovinasjordanas@gmail.com y responderemos en el plazo de un mes.",
    s7h: "Reclamaciones",
    s7b: "Si crees que hemos tratado mal tus datos, dínoslo primero para que podamos arreglarlo. También tienes derecho a reclamar ante Persónuvernd, la autoridad islandesa de protección de datos, en personuvernd.is.",
    s8h: "Cambios en esta política",
    s8b: "Si cambiamos la forma de tratar los datos, actualizaremos esta página y cambiaremos la fecha de arriba.",
    note: "Esta política es una plantilla inicial para que la revise el propietario. No es asesoramiento jurídico.",
  },

  cta: {
    heading: "Que la felicidad estalle como un volcán.",
    subtitle: "Llama y te llevamos una prueba.",
    placeholder: "Tu correo electrónico",
    button: "Apuntarme",
    success: "Gracias: ya estás en la lista.",
    invalid: "Introduce un correo electrónico válido.",
    call: "Llama y prueba",
    callNow: "Llamar ahora",
    copy: "Copiar",
    copied: "Copiado",
  },

  footer: {
    tagline: "Miel cruda y todos los productos de la colmena",
    made: "Traída de Lituania. Entregada en Islandia.",
    rights: "Todos los derechos reservados.",
    privacy: "Política de privacidad",
    terms: "Términos y condiciones",
    pages: "Páginas",
    contact: "Contacto",
  },

  video: {
    button: "Llama y prueba",
  },

  story: {
    eyebrow: "Donde empieza",
    heading: "Nacida en las llanuras\nde Lituania",
    body1: "Prados de trébol, tilo y flores silvestres, trabajados por abejas sin prisa.",
    body2: "Lotes pequeños, cruda, sin filtrar. Al norte, a mano.",
    stat1: "Cruda",
    stat2: "Lote pequeño",
    stat3: "Sin filtrar",
  },
};

export default es;

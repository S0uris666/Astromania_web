import albumuniverso from "../assets/Images/Software/albumuniverso.webp";
import blackhole from "../assets/Images/Software/blackhole.webp";
import cartes from "../assets/Images/Software/cartes.webp";
import celestia from "../assets/Images/Software/celestia.webp";
import discooro from "../assets/Images/Software/discooro.webp";
import dragon2 from "../assets/Images/Software/dragon2.webp";
import DSO from "../assets/Images/Software/DSO.webp";
import exploremars from "../assets/Images/Software/exploremars.webp";
import gaia from "../assets/Images/Software/gaia.webp";
import googleearth from "../assets/Images/Software/googleearth.webp";
import googlespaceweb from "../assets/Images/Software/googlespaceweb.webp";
import helioviewer from "../assets/Images/Software/helioviewer.webp";
import impact from "../assets/Images/Software/impact.webp";
import kerbal from "../assets/Images/Software/kerbal.webp";
import kstars from "../assets/Images/Software/kstars.webp";
import masticaastros from "../assets/Images/Software/masticaastros.webp";
import nasaseyes from "../assets/Images/Software/nasaseyes.webp";
import neal from "../assets/Images/Software/neal.webp";
import openspace from "../assets/Images/Software/openspace.webp";
import ourgalaxy from "../assets/Images/Software/ourgalaxy.webp";
import phet from "../assets/Images/Software/phet.webp";
import sandbox from "../assets/Images/Software/sandbox.webp";
import scale from "../assets/Images/Software/scale.webp";
import sciencekombat from "../assets/Images/Software/sciencekombat.webp";
import spaceengine from "../assets/Images/Software/spaceengine.webp";
import starbox from "../assets/Images/Software/starbox.webp";
import stellarium from "../assets/Images/Software/stellarium.webp";
import stellariumwweb from "../assets/Images/Software/stellariumweb.webp";
import vecindario from "../assets/Images/Software/vecindario.webp";
import virtual_moon_atlas from "../assets/Images/Software/virtual_moon_atlas.webp";

export const SOFTWARE_ITEMS = [
  {
    id: "stellarium-web",
    category: "online",
    title: "Stellarium Web",
    desc:
      "Planetario en línea que muestra un cielo realista. Ideal para educación y observación casual. Permite ubicar constelaciones, planetas y objetos Messier rápidamente.",
    cover:
      stellariumwweb,
    link: "https://stellarium-web.org/",
    platforms: ["web"],
    tags: ["planetario", "educación", "cielo en vivo"],
  },
  {
    id: "acomplamiento-dragon2",
    category: "online",
    title: "Simulador de acoplamiento del Dragon2 de SpaceX",
    desc:
      "Este simulador te familiarizará con los controles reales utilizados por los astronautas de la NASA para pilotar manualmente el vehículo SpaceX Dragon 2 hacia la Estación Espacial Internacional en mayo de 2020.",
    cover:
      dragon2,
    link: "https://iss-sim.spacex.com/",
    platforms: ["web"],
    tags: ["simulador", "spacex", "dragon2", "educación"],
  },
  {
    id: "nasa-eyes",
    category: "online",
    title: "NASA´s Eyes.",
    desc:
      "Se trata de un conjunto de aplicaciones de libre acceso, creado por el Equipo de desarrollo y Aplicaciones de Tecnología de Visualización del JPL de la NASA, que ofrece vistas e información precisa de la Tierra, el Sistema Solar y Exoplanetas.",
    cover:
      nasaseyes,
    link: "https://eyes.nasa.gov/",
    platforms: ["web"],
    tags: ["simulador", "Sistema Solar", "exoplanetas", "educación"],
  },
  {
    id: "google-space",
    category: "online",
    title: "Google Space (Sistema Solar).",
    desc:
      "Viaja por inpresionantes mundos del Sistema Solar y estudia de cerca sus superficies y mapas topográficos.",
    cover:
      googlespaceweb,
    link: "https://www.google.com/maps/space/",
    platforms: ["web"],
    tags: ["simulador", "Sistema Solar", "space", "educación"],
  },
  {
    id: "disco-oro-voyager",
    category: "online",
    title: "Disco de Oro de las sondas Voyager.",
    desc:
      "El disco de oro de las Voyager son dos discos fonográficos de cobre bañado en oro, de 30 cm de diámetro​, que acompañan a las sondas espaciales Voyager, lanzadas en 1977 y que tardarán unos 40 000 años en alcanzar las proximidades de la estrella más cercana a nuestro Sistema Solar.",
    cover:
      discooro,
    link: "https://goldenrecord.org/",
    platforms: ["web"],
    tags: ["sonidos", "disco de oro", "voyager", "educación"],
  },
  {
    id: "vecindario-estelar",
    category: "online",
    title: "Vecindario estelar 3D interactivo.",
    desc:
      "Una visualización 3D interactiva de nuestro vecindario estelar. incluyendo a más de 100.000 estrellas cercanas. Creado para la navegación de Google Chrome.",
    cover:
      vecindario,
    link: "https://stars.chromeexperiments.com/",
    platforms: ["web"],
    tags: ["simulacion", "mapa estelar", "sol", "educación"],
  },
  {
    id: "PhET-Simulación",
    category: "online",
    title: "PhET: simulaciones interactivas de física en Java.",
    desc:
      "Excelente colección de actividades interactivas para el aprendizaje y refuerzo de conceptos de física, química y astronomía, incluyendo fuerzas, energía, mecánica cuántica, termodinámica y electromagnetismo.",
    cover:
      phet,
    link: "http://phet.colorado.edu/es/",
    platforms: ["web"],
    tags: ["simulacion", "fisica", "educación"],
  },
  {
    id: "helioviewer",
    category: "online",
    title: "Helioviewer.",
    desc:
      "Visor de imágenes solares tomadas por las misiones espaciales SOHO y SDO con sus múltiples cámaras. Seleccionando rangos e intervalos de tiempo, es posible generar animaciones de la actividad solar.",
    cover:
      helioviewer,
    link: "http://www.helioviewer.org/",
    platforms: ["web"],
    tags: ["simulacion", "sol", "educación"],
  },
  {
    id: "DSO-Browser",
    category: "online",
    title: "DSO Browser.",
    desc:
      "DSO Browser es un buscador que muestra los objetos que estarán disponibles para observación o fotografía según coordenadas, con reseñas incluidas de los objetos. Configurable para español e inglés.",
    cover:
      DSO,
    link: "https://dso-browser.com/",
    platforms: ["web"],
    tags: ["buscador", "observación", "educación"],
  },
  {
    id: "impact-earth",
    category: "online",
    title: "Impact Earth.",
    desc:
      "Simulación de los múltiples efectos del impacto de un cuerpo de características variables sobre nuestro planeta.",
    cover:
      impact,
    link: "http://www.purdue.edu/impactearth",
    platforms: ["web"],
    tags: ["impacto", "meteorito", "educación", "tierra"],
  },
  {
    id: "scale-universe",
    category: "online",
    title: "The scale of the universe.",
    desc:
      "Comparación del tamaño de las cosas, desde lo subatómico hasta lo cosmológico.",
    cover:
      scale,
    link: "https://htwins.net/scale2/",
    platforms: ["web"],
    tags: ["interactivo", "escala del universo", "educación"],
  },
  {
    id: "neal.fun",
    category: "online",
    title: "Neal.fun",
    desc:
      "Neal.fun es un sitio web creado por el desarrollador estadounidense Neal Agarwal. Este sitio ofrece una variedad de juegos interactivos, visualizaciones y experiencias educativas diseñadas para entretener e informar a los usuarios.",
    cover:
      neal,
    link: "https://neal.fun/",
    platforms: ["web"],
    tags: ["juegos", "educación", "interactivo", "educación"],
  },
  {
    id: "star-box",
    category: "online",
    title: "Star in a box.",
    desc:
      "Ahora eres dueño de una Estrella en la Caja, y dentro de esta caja puedes animar las diferentes fases de la vida de una estrella y ver cómo cambian su luminosidad, tamaño y masa con el tiempo.",
    cover:
      starbox,
    link: "http://starinabox.lco.global/",
    platforms: ["web"],
    tags: ["star", "evolucion", "interactivo", "educación"],
  },
  {
    id: "space-engine",
    category: "simulacion",
    title: "Space Engine.",
    desc:
      "Programa de simulación intergaláctica en 3D desarrollado por el astrónomo y programador ruso Vladimir Romanyuk. Usando catálogos astronómicos reales, crea un planetario en tres dimensiones que representa al Universo completo. Los usuarios pueden viajar a través del espacio en cualquier dirección o velocidad, y hacia adelante o atrás en el tiempo.",
    cover:
      spaceengine,
    link: "http://spaceengine.org/",
    platforms: ["windows", "Steam"],
    tags: ["simulación", "física", "gravedad", "intergaláctica"],
  },
  {
    id: "gaia-sky",
    category: "simulacion",
    title: "Gaia Sky",
    desc:
      "Programa de realidad virtual y escritorio de visualización astronómica de código abierto. Está creado y desarrollado por Toni Sagristà Sellés en el marco de la misión Gaia de la ESA para crear un mapa multidimensional de mil millones de estrellas de nuestra Vía Láctea, en el grupo Gaia del Astronomisches Rechen-Institut (ZAH, Universität Heidelberg).",
    cover:
      gaia,
    link: "https://zah.uni-heidelberg.de/gaia/outreach/gaiasky",
    platforms: ["windows", "mac", "linux"],
    tags: ["simulación", "física", "gravedad", "gaia"],
  },
  {
    id: "celestia",
    category: "simulacion",
    title: "Celestia",
    desc:
      "Programa gratuito de visualización del Sistema Solar, sistemas exoplanetarios, y otros objetos espaciales. Permite visitar planetas y sus satélites, visualizar visitas de naves espaciales a asteroides, viajar junto a un cometa durante órbitas de cientos años, y muchas otras actividades opcionales guiadas.",
    cover:
      celestia,
    link: "https://celestiaproject.space/download.html",
    platforms: ["windows", "mac", "linux"],
    tags: ["simulación", "física", "gravedad", "celestia", "sistema solar"],
  },
  {
    id: "open-space",
    category: "simulacion",
    title: "Open Space",
    desc:
      "OpenSpace pone al alcance del público general las técnicas más avanzadas de la investigación en visualización de datos. Permite la presentación interactiva de datos dinámicos procedentes de observaciones, simulaciones y la planificación y operación de misiones espaciales.",
    cover:
    openspace,
    link: "https://www.openspaceproject.com/",
    platforms: ["windows", "mac", "linux"],
    tags: ["simulación", "física", "gravedad"],
  },
  {
    id: "universe-sandbox",
    category: "simulacion",
    title: "Universe Sandbox",
    desc:
      "Simulador de dinámica de sistemas planetarios, estrellas y galaxias. Permite crear con total libertad sistemas múltiples planetas y estrellas, observar su evolución, desestabilizar órbitas y hacer colisionar galaxias. También permite opciones avanzadas de visualización mediante codificación de magnitudes físicas con colores, construcción de diagramas de Hertzprung-Russel de estrellas, comparación de tamaños de estrellas, planetas y cúmulos galácticos.",
    cover:
      sandbox,
    link: "https://universesandbox.com/",
    platforms: ["windows", "mac"],
    tags: ["simulación", "física", "gravedad"],
  },
  {
    id: "our-galaxy",
    category: "simulacion",
    title: "Our Galaxy. Atlas tridimensional de nuestra Galaxia.",
    desc:
      "Excelente recurso para poner en perspectiva la estructura de la Vía Láctea, la ubicación, distancias y contexto astrofísico de las zonas de formación estelar y cúmulos globulares, y su posición aparente en el cielo.",
    cover:
      ourgalaxy,
    link: "https://www.otherwise.com/",
    platforms: ["windows", "mac"],
    tags: ["simulación", "física", "gravedad", "galaxia"],
  },
  {
    id: "stellarium",
    category: "planetario",
    title: "Stellarium",
    desc:
      "Planetario gratuito de gran calidad que permite visualizar el ciclo diurno de los astros, examinar las constelaciones y su interpretación visual según varias culturas del mundo, visualizar eclipses solares y lunares, lluvias de meteoros, nebulosas, galaxias, etc. Permite además agregar escenarios personalizados y programar visualizaciones especiales.",
    cover:
      stellarium,
    link: "http://www.stellarium.org/es/",
    platforms: ["windows", "mac", "linux"],
    tags: ["cielo", "exploración", "planetario"],
  },
  {
    id: "google-earth-pro",
    category: "planetario",
    title: "Google Earth Pro",
    desc:
      "Google Earth Pro para ordenadores está pensado para usuarios que necesiten funciones avanzadas, como importar y exportar datos GIS o usar imágenes históricas para hacer retrospectivas.Incluye mapas del cielo, de la Luna y Marte.",
    cover:
      googleearth,
    link: "https://www.google.com/earth/about/versions/#earth-pro",
    platforms: ["windows", "mac", "linux"],
    tags: ["simulación", "planetario", "cielo", "marte", "luna"],
  },
  {
    id: "cartes-du-ciel",
    category: "planetario",
    title: "Cartes du Ciel",
    desc:
      "Planetario 2D gratuito con múltiples bases de datos disponibles. Control de telescopios, predicción de eventos astronómicos, base de datos de estrellas variables con conexión a base de datos de AAVSO.",
    cover:
      cartes,
    link: "http://www.ap-i.net/skychart/es/start",
    platforms: ["windows", "mac", "linux"],
    tags: ["simulación", "planetario", "cielo", "exploracion"],
  },
  {
    id: "kstars",
    category: "planetario",
    title: "Kstars",
    desc:
      "Planetario 2D que permite agregar fácilmente bases de datos, imágenes de objetos celestes, elementos orbitales de planetas menores, asteroides y cometas, satélites y supernovas recientes. Las reglas de horarios de invierno y verano internacional pueden ser actualizadas automáticamente via internet.",
    cover:
      kstars,
    link: "http://edu.kde.org/kstars/?site_locale=es",
    platforms: ["windows", "mac"],
    tags: ["simulación", "planetario", "cielo", "exploracion"],
  },
  {
    id: "virtual-moon-atlas",
    category: "planetario",
    title: "Virtual Moon Atlas",
    desc:
      "Completo atlas virtual gratuito de la Luna, con imágenes satelitales, mapas esquemáticos, geológicos, contenido de hidrógeno, torio, etc. También muestra imágenes tomadas desde las misiones Apollo de cráteres y otras estructuras lunares. Permite visualizar las fases y libraciones lunares.",
    cover:
      virtual_moon_atlas,
    link: "http://www.ap-i.net/avl/en/start",
    platforms: ["windows", "mac"],
    tags: ["simulación", "atlas", "luna", "exploracion"],
  },
  {
    id: "album-universo",
    category: "juegos",
    title: "Álbum virtual MAS Universo",
    desc:
      "El Instituto Milenio de Astrofísica MAS (Chile), a través de su programa de divulgación ObservaMAS, crea este álbum virtual, «Universo. Juega, Pega y Aprende», que invita a un recorrido por el cosmos desde nuestra Tierra hasta el universo profundo. Son más de 200 láminas para coleccionar, divididos en 20 temas astronómicos.",
    cover:
      albumuniverso,
    link: "https://www.astrofisicamas.cl/lanzan_album_universo/",
    platforms: ["Android", "iOS"],
    tags: ["juego", "álbum", "universo", "coleccionable"],
  },
  {
    id: "kerbal-space-program",
    category: "juegos",
    title: "Kerbal Space Program (KSP)",
    desc:
      "Videojuego de simulación espacial que permite administrar un programa espacial. Consiste en construir cohetes, naves espaciales, astromóviles y estaciones espaciales para después lanzarlos al espacio y llevarlos a otro planeta o a una de sus lunas, dentro de un sistema planetario ficticio similar al sistema solar.",
    cover:
    kerbal,
    link: "https://www.kerbalspaceprogram.com/", /* "https://youtu.be/2Sj0XZsjCr0" *//* , */
    platforms: ["windows", "mac", "xbox", "playstation"],
    tags: ["juego", "mecánica orbital", "programa espacial", "astronáutica", "STEM"],
  },
  {
    id: "mastica-astros",
    category: "juegos",
    title: "Mastica Astros.",
    desc:
      "Durante una noche de observación astronómica en un observatorio chileno, un curioso astrónomo se encuentra con una  sorpresa: ¡Una enorme invasión de asteroides se cierne sobre la Tierra y el resto el Sistema Solar! Oportunamente, otro científico del observatorio, se encuentra experimentando con un pez capaz de comer todo tipo de objetos, y esto les da una gran idea: ¡Enviar a la criatura a enfrentarse a los asteroides y salvar el planeta!",
    cover:
      masticaastros,
    link: "http://astrofisicamas.cl/juegomasticaastros/",
    platforms: ["windows", "mac", "online"],
    tags: ["juego", "gravedad", "asteroides", "online"],
  },
  {
    id: "explore-mars",
    category: "juegos",
    title: "Explore Mars. NASA.",
    desc:
      "En Explore Mars, conducirás un rover en Marte y recopilarás información sobre las rocas marcianas. Primero elige una roca para investigar. Luego escoge una secuencia de comandos para indicarle al rover cómo llegar. ¡No olvides incluir el comando para analizar la roca! Ganarás puntos cada vez que analices con éxito una nueva roca marciana.",
    cover:
      exploremars,
    link: "https://spaceplace.nasa.gov/explore-mars/",
    platforms: ["windows", "mac", "online"],
    tags: ["juego", "marte", "rover", "online"],
  },
  {
    id: "sciencie-kombat",
    category: "juegos",
    title: "Sciencie Kombat.",
    desc:
      "Descubre el inusual minijuego pixel art donde las mentes más brillantes de la historia se enfrentan en un torneo épico. ¿Quién ganará entre Nikola Tesla, Albert Einstein, Marie Curie y Charles Darwin? ¡Descubre el poder de la ciencia en el campo de batalla y juega gratis en tu navegador!",
    cover:
      sciencekombat,
    link: "https://astromania.cl/sciencekombat/",
    platforms: ["windows", "mac", "online"],
    tags: ["juego", "kombat", "científicos", "online"],
  },
  {
    id: "black-hole",
    category: "juegos",
    title: "Black Hole. (agujero negro)",
    desc:
      "Si siempre tienes hambre y te gusta comer ilimitadamente, entonces estás en el lugar correcto. Ingresa a la arena y enfréntate a otros agujeros negros en una batalla épica. ¡Come todo lo que puedas con tu agujero negro y expándelo para hacerlo mas grande, y comer más!",
    cover:
      blackhole,
    link: "https://hole-io.com/",
    platforms: ["windows", "mac", "online"],
    tags: ["juego", "gravedad", "agujero negro", "online"],
  },
];

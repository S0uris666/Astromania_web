import MateriaOscuraRotacionImg from "../assets/Images/Community/materiaOscuraRotacion.svg";
import MateriaOscuraLentesImg from "../assets/Images/Community/materiaOscuraLentes.svg";
import LluviaPlanificacionImg from "../assets/Images/Community/lluviaPlanificacion.svg";
import TelescopioBinocularesImg from "../assets/Images/Community/telescopioBinoculares.svg";

export const respuestasComunidad = [
  {
    id: "materia-oscura",
    pregunta: "Que es la materia oscura y por que sabemos que existe?",
    categoria: "CamiCategoria",
    publicadoEl: "2024-08-12",
    autor: "Equipo Astromania",
    videos: [
      { titulo: "Video explicativo", url: "https://youtu.be/yYMdrilDqtQ" },
      { titulo: "Panel con investigadoras", url: "https://www.youtube.com/watch?v=4a0FbQKdkpQ" },
    ],
    resumen:
      "Observaciones de galaxias y lentes gravitacionales muestran que hay mas masa de la que podemos ver. Esa masa invisible es lo que llamamos materia oscura.",
    secciones: [
      {
        titulo: "Evidencia en la rotacion de galaxias",
        contenido:
          "Cuando medimos la velocidad de las estrellas en el borde de una galaxia esperamos que disminuya, pero se mantiene alta. La unica manera de explicarlo es asumir que existe un halo de materia no visible que aporta gravedad adicional.",
        imagen: MateriaOscuraRotacionImg,
      },
      {
        titulo: "Mapas de lentes gravitacionales",
        contenido:
          "Los cumulos de galaxias desvian la luz de objetos que estan detras de ellos. Esa desviacion nos permite calcular cuanta masa hay realmente en los cumulos y los resultados vuelven a indicar que falta materia luminosa para justificar el efecto observado.",
        imagen: MateriaOscuraLentesImg,
      },
      {
        titulo: "Lo que aun no sabemos",
        contenido:
          "La materia oscura no emite ni refleja luz, por eso todavia no la detectamos de manera directa. Experimentos en laboratorios subterraneos buscan detectar particulas candidatas como los WIMPs, mientras que telescopios espaciales exploran senales indirectas.",
      },
    ],
    recursos: [
      { etiqueta: "Articulo recomendado", url: "https://astromania.cl/que-es-la-materia-oscura" },
    ],
  },
  {
    id: "lluvia-meteoros",
    pregunta: "Como puedo observar una lluvia de meteoros desde la ciudad?",
    categoria: "Observacion del cielo",
    publicadoEl: "2024-07-22",
    autor: "Red de Divulgadores",
    videos: [
     
    ],
    resumen:
      "Busca fechas donde la Luna este en fase nueva, alejate de luces directas y permite que tus ojos se adapten a la oscuridad durante 20 minutos.",
    secciones: [
      {
        titulo: "Planifica la observacion",
        contenido:
          "Identifica el maximo de la lluvia de meteoros en un calendario astronomico. Para las Perseidas, por ejemplo, el pico suele caer entre el 11 y 13 de agosto. Revisa la fase lunar y, si es posible, trasladate a un lugar con horizonte despejado.",
        imagen: LluviaPlanificacionImg,
      },
      {
        titulo: "Equipo recomendado",
        contenido:
          "No necesitas telescopio. Usa una silla reclinable o manta, lleva abrigo y agua. Un puntero laser verde o una brujula pueden ayudarte a ubicar la constelacion de origen (el radiante).",
      },
      {
        titulo: "Tips para la ciudad",
        contenido:
          "Apaga luces cercanas y elige plazas o azoteas donde puedas bloquear parte de la contaminacion luminica. Permite que tus ojos se adapten a la oscuridad y evita mirar pantallas durante al menos 15 minutos.",
      },
    ],
    recursos: [
      { etiqueta: "Calendario de lluvias", url: "https://www.imo.net/viewing-the-sky/meteor-shower-calendar/" },
      { etiqueta: "Carta celeste interactiva", url: "https://stellarium-web.org/" },
    ],
  },
  {
    id: "primer-telescopio",
    pregunta: "Que debo considerar antes de comprar mi primer telescopio?",
    categoria: "Instrumentos",
    publicadoEl: "2024-06-05",
    autor: "Club de Astronomia Santiago Centro",
    resumen:
      "Define tu presupuesto, lo que quieres observar y el tiempo que dedicaras a la practica. Muchas personas comienzan con binoculares antes de dar el salto.",
    secciones: [
      {
        titulo: "Empieza con objetivos claros",
        contenido:
          "Si te interesa la Luna y los planetas, un telescopio reflector de 130 mm en montura Dobson es una gran opcion. Para espacio profundo necesitaras mas apertura, pero considera tambien el peso y la transportabilidad del equipo.",
      },
      {
        titulo: "Alternativa con binoculares",
        contenido:
          "Unos binoculares 10x50 permiten observar cumulos abiertos, la Luna y la Via Lactea. Son mas economicos, versatiles y ayudan a aprender a ubicar objetos antes de invertir en un telescopio.",
        imagen: TelescopioBinocularesImg,
      },
      {
        titulo: "Accesorios y mantenimiento",
        contenido:
          "Presupuesta oculares adicionales, un filtro lunar y una funda protectora. Manten los espejos y lentes limpios con aire comprimido y guardas el equipo en un lugar seco para evitar hongos.",
      },
    ],
    recursos: [
      { etiqueta: "Guia de telescopios", url: "https://skyandtelescope.org/astronomy-equipment/" },
      { etiqueta: "Taller introductorio", url: "https://astromania.cl/talleres" },
    ],
  },
];

export default respuestasComunidad;

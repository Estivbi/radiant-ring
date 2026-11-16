/**
 * Catálogo. Para actualizar un precio o un enlace edita SOLO este archivo.
 *
 * - `asin`: identificador de Amazon.es. El enlace limpio se genera solo
 *   (https://www.amazon.es/dp/ASIN), sin parámetros de rastreo ni de búsqueda.
 * - `price`: precio en € del formato principal, o `null` si no está confirmado
 *   (entonces la web muestra "Ver precio en Amazon" en vez de un número).
 * - `priceCheckedAt`: fecha (AAAA-MM-DD) de la última comprobación del precio.
 */
export interface Book {
  id: string;
  title: string;
  /** Título corto para tarjetas */
  short: string;
  subtitle?: string;
  cover: string;
  description: string;
  tagline: string;
  asin: string;
  format: 'Kindle' | 'Tapa blanda' | 'Kindle y tapa blanda';
  price: number | null;
  priceCheckedAt?: string;
  /** Orden dentro de la saga Andalucía negra (undefined = fuera de la saga) */
  saga?: number;
  coverFit?: 'cover' | 'contain';
}

export const amazonUrl = (asin: string) => `https://www.amazon.es/dp/${asin}`;

export const books: Book[] = [
  {
    id: 'granada-oscura',
    title: 'Granada oscura',
    short: 'Granada oscura',
    subtitle: 'Andalucía negra · I',
    cover: '/granada-oscura.png',
    tagline: 'Un thriller de sangre fría, rock y pasión en las calles de Granada.',
    description: `Granada oculta más de lo que puedes imaginar...
Desde los oscuros corredores de la justicia en Galicia hasta las misteriosas y laberínticas calles de Granada, Juan, un perspicaz detective, se halla inmerso en una ola de crímenes escalofriantes.
Junto a su compañero, la sangre se despliega en un enigma de muertes cuya resolución se convierte en su única obsesión.
Pero en Granada hay mucho más que sangre fría y misterio. Hay magia, encanto... y Alba.
Su acento melódico de Sevilla y la belleza del atardecer andaluz cautivarán a Juan. En medio de la sombra del crimen surge un rayo de luz, una pasión inesperada... ¿Puede florecer el amor en un jardín manchado de rojo?
Lo que Juan no sabe es que Granada esconde una trama más oscura de lo que pudo imaginar. Y Alba puede ser la clave de todo.
Entre acordes de rock clásico y metal, en una danza de sexo, suspense y muerte, Juan se adentra en una investigación que pondrá a prueba no solo su ingenio, sino también su corazón.
No hay pausas en este thriller. Solo hay una regla: sigue el ritmo... si puedes.`,
    asin: 'B0CWHG9KZZ',
    format: 'Kindle y tapa blanda',
    price: null,
    saga: 1,
  },
  {
    id: 'mitos-y-leyendas',
    title: 'Mitos y leyendas del mar de olivos',
    short: 'Mitos y leyendas del mar de olivos',
    subtitle: 'Andalucía negra · II',
    cover: '/mitos-y-leyendas.png',
    tagline: 'Crímenes paranormales en Jaén y un inspector que no cree en fantasmas.',
    description: `Una serie de crímenes paranormales están sucediendo en la provincia de Jaén. El recién ascendido a inspector de homicidios Javi tendrá que lidiar con ellos con la ayuda de Silvia, una guardia civil que lo volverá loco en todos los sentidos.
¿Qué oscuros mitos y leyendas esconde Jaén? Descúbrelo con nuestros detectives entre acordes de metal, heavy y pop, y adéntrate en este universo de asesinatos, sexo, erotismo, romance y misterio.`,
    asin: 'B0CK85GV4F',
    format: 'Kindle',
    price: null,
    saga: 2,
  },
  {
    id: 'triangulo-del-sur',
    title: 'El triángulo del sur',
    short: 'El triángulo del sur',
    subtitle: 'Andalucía negra · III',
    cover: '/triangulo-del-sur.png',
    tagline: 'El desenlace: la venganza es un plato que se sirve frío.',
    description: `Las acciones cometidas jamás podrán ser borradas. Sucesos macabros en puntos clave de desolación llevan consigo el ajuste de cuentas de un pasado persistente y atormentador, que lanza sus hilos como una tela de araña en el presente.
Ahora, los extraños sucesos que acontecen en el llamado Triángulo del Sur envuelven a sus protagonistas en una investigación cruenta en donde ellos mismos son las víctimas, sin saber que el desencadenante principal se encuentra en el núcleo de sus vidas.
Al fin y al cabo, ¿no es la venganza un plato que se sirve frío?`,
    asin: 'B0DKKXSQL7',
    format: 'Kindle',
    price: null,
    saga: 3,
  },
  {
    id: 'andalucia-negra',
    title: 'Andalucía negra: trilogía completa',
    short: 'Andalucía negra',
    subtitle: 'La trilogía en un solo volumen',
    cover: '/andalucia-negra.png',
    coverFit: 'contain',
    tagline: 'Los tres casos, de Granada oscura al desenlace, en un solo libro.',
    description: `En el corazón de Andalucía, donde las sombras del pasado nunca descansan, un grupo de investigadores (los inspectores Juan Gutiérrez y Javi Gómez, junto con la agente de la Guardia Civil Silvia y Alba) se adentra en una serie de crímenes tan oscuros como las raíces que los engendran.
Desde Granada oscura, pasando por El mar de los olivos, hasta el desenlace en El triángulo del sur, la trilogía entrelaza asesinatos rituales, bebés robados, conspiraciones familiares y heridas abiertas desde la Guerra Civil. Cada caso revela una verdad más profunda, una amenaza más personal y un enemigo más cercano.
Entre leyendas locales que se vuelven reales, venganzas ocultas bajo siglos de silencio y una tierra que reclama justicia, los protagonistas deberán enfrentarse no solo al crimen, sino también a sí mismos.
Una saga implacable en la que cada sombra es un secreto y cada calle una traición.`,
    asin: 'B0FZWLMVPM',
    format: 'Kindle',
    price: null,
  },
  {
    id: 'unas-navidades-diferentes',
    title: 'Unas navidades diferentes',
    short: 'Unas navidades diferentes',
    subtitle: 'Relato a dos voces',
    cover: '/unas-navidades-diferentes.jpg',
    tagline: 'Lo que se esconde tras el espumillón, el champán y las guirnaldas.',
    description: `En esta obra dos escritores han buceado, desde sus particulares miradas, en las señaladas fechas de las entrañables Navidades para encontrar lo que se esconde tras el espumillón, el champán y las guirnaldas.
Un esmerado trabajo que va más allá de la pátina que cubre las vivencias, las emociones y el paso del tiempo, en busca de lo que oculta la realidad de lo que sucede en el corazón de una familia.
Encontrarás la añoranza por quienes ya no están, aunque permanecen en el recuerdo de quienes los han querido. La sorpresa y la inocencia de una niña que disfruta por primera vez de estas fiestas despertará en ti la emoción y la ternura.
Recorrerás los silencios provocados por comportamientos erróneos, el daño que causa la negligencia y la decepción de vivir fingiendo ser quien no eres. La sombra de una relación inapropiada sobrevuela la paz de esta familia, y hay conductas del pasado que dejan una huella indeleble.
Todo el relato está aderezado por los símbolos habituales de estos días: las luces, la música, los escaparates rojos y dorados, las comidas suculentas, el tiempo compartido y, por supuesto, la llegada de los Reyes Magos.`,
    asin: 'B0DPJ1RV16',
    format: 'Kindle',
    price: null,
  },
];

export const sagaBooks = books.filter((b) => b.saga).sort((a, b) => a.saga! - b.saga!);
export const otherBooks = books.filter((b) => !b.saga && b.id !== 'andalucia-negra');

export const formatPrice = (p: number | null) =>
  p == null ? null : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);

export default books;

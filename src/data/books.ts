export interface Book {
  id: string;
  title: string;
  cover: string;
  description: string;
  price: number;
  buyLink: string;
  amazonUrl?: string;
}

export const books: Book[] = [
  {
    id: 'granada-oscura',
    title: 'Granada Oscura',
    cover: '/granada-oscura.png',
  description: `Granada oculta más de lo que puedes imaginar...

Desde los oscuros corredores de la justicia en Galicia hasta las misteriosas y laberínticas calles de Granada, Juan, un perspicaz detective, se halla inmerso en una ola de crimenes escalofriantes.

Junto a su compañero, la sangre se despliega en un enigma de muertes cuya resolución se convierte en su única obsesión.

Pero en Granada hay mucho más que sangre fría y misterio.

Hay magia, encanto... y Alba.

Su acento melódico de Sevilla y la belleza del atardecer andaluz, cautivará a Juan. En medio de la sombra del crimen, surge un rayo de luz, una pasión inesperada... ¿Pero, puede florecer el amor en un jardin manchado de rojo?

Lo que Juan no sabe, es que Granada esconde una trama más oscura de lo que pudo imaginar. Y Alba, puede ser la clave de todo.

Entre acordes de rock clásico y metal, en una danza de sexo, suspense y muerte, Juan se adentra en una investigación que pondrá a prueba no solo su ingenio, sino también su corazón.

¿Estás preparado para perder el aliento y el corazón en las calles de Granada?

Siente la magia de esta ciudad. No hay pausas en este thriller. Solo hay una regla: sigue el ritmo... si puedes.`,
    price: 13.9,
    buyLink:
      'https://www.amazon.es/granada-oscura-segunda-edici%C3%B3n-revisada/dp/B0CWHG9KZZ/ref=monarch_sidesheet_title',
  },
  {
    id: 'mitos-y-leyendas',
    title: 'Mitos y leyendas del mar de olivos',
    cover: '/mitos-y-leyendas.png',
    description:
      'Una serie de crímenes paranormales están sucediendo en la provincia de Jaén. El recién ascendido a inspector de homicidios Javi, tendrá que lidiar con ellos con la ayuda de Silvia, una guardia civil que lo volverá loco en todos los sentidos. ¿Qué oscuros mitos y leyendas esconde Jaén? Descúbrelo con nuestros detectives entre acordes de metal, heavy y pop, y adéntrate en este universo de asesinatos, sexo, erotismo, romance y misterio.',
    price: 14.87,
    buyLink:
      'https://www.amazon.es/Mitos-leyendas-olivos-Andaluc%C3%ADa-negra-ebook/dp/B0CK85GV4F/ref=sr_1_5?dib=eyJ2IjoiMSJ9.zS9sagHTLzydssoOngqAvJ8MSHKJkUEVoyWB38aQefVs9o_H9N1c1pw5GH3iZgpuHkehejMjAGiuD8OkWbgHexC5mebIRyfqziHgbQmy0zY.9QvJ5mYRPmbZ17QxRoxZ2Dt24-zAzypSvo7pRK0nlCU&dib_tag=se&qid=1760971788&refinements=p_27%3ACustodio+Jos%C3%A9+P%C3%A9rez+P%C3%A9rez+s=books&sr=1-5',
  },
  {
    id: 'triangulo-del-sur',
    title: 'El Triángulo del Sur',
    cover: '/triangulo-del-sur.png',
    description:
      'Las acciones cometidas jamás podrán ser borradas. Sucesos macabros en puntos claves de desolación llevan consigo el ajuste de cuentas de un pasado persistente, atormentador, que lanza sus hilos como una tela de araña en el presente. Ahora, los extraños sucesos que acontecen en el llamado Triángulo del Sur envuelven a sus protagonistas en una investigación cruenta en donde ellos mismos son las víctimas, sin saber que el desencadenante principal se encuentra en el núcleo de sus vidas. Al fin y al cabo, ¿no es la venganza un plato que se sirve frío?',
    price: 15.0,
    buyLink:
      'https://www.amazon.es/tri%C3%A1ngulo-del-sur-Andaluc%C3%ADa-negra-ebook/dp/B0DKKXSQL7?ref_=saga_dp_ss_dsk_dp&qid=1760971788&sr=1-5',
  },
  {
    id: 'unas-navidades-diferentes',
    title: 'Unas navidades diferentes',
    cover: '/unas-navidades-diferentes.jpg',
    description:
      'Una historia entrañable y diferente para disfrutar la Navidad desde otra perspectiva. Custodio J. Pérez nos invita a vivir unas fiestas llenas de emociones, sorpresas y reflexión.',
    price: 12.5,
    buyLink:
      'https://www.amazon.es/Unas-navidades-diferentes-Custodio-P%C3%A9rez-ebook/dp/B0DPJ1RV16?ref_=ast_author_dp&th=1&psc=1',
  },
];

export default books;

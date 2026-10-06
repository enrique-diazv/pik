import {createDefaultOpeningHours} from '@/lib/opening-hours';
import type {Business} from '@/types/business';

/** Fictional data, separate from the real app and its users. */
export const mockBusiness: Business = {
  id: 'salon-demo',
  name: 'Ale\'s Spa',
  categories: ['salon'],
  phone: '5500000000',
  city: 'Monterrey',
  address: 'Calle Ejemplo 123, Monterrey, Nuevo León',
  description: 'Un espacio para cuidar de ti, a tu ritmo.',
  coverImage: {
    src: '/images/business-cover.png',
    alt: 'Interior de una sauna con bancas y paredes de madera',
  },
  gallery: [
    {
      src: '/images/business-cover.png',
      alt: 'Sauna con bancas de madera',
    },
    {
      src: '/images/service-corte.png',
      alt: 'Corte de cabello estilo bob',
    },
    {
      src: '/images/service-manicure.png',
      alt: 'Manicure con puntas azul claro',
    },
    {
      src: '/images/service-tratamiento.png',
      alt: 'Aplicación de un tratamiento capilar',
    },
  ],
  openingHours: createDefaultOpeningHours(),
  services: [
    {
      id: 'corte',
      name: 'Corte de cabello',
      image: {
        src: '/images/service-corte.png',
        alt: 'Corte de cabello corto estilo bob',
      },
      description:
          'Un corte personalizado para renovar tu estilo y resaltar tus facciones.',
      durationMinutes: 45,
      priceMxn: 350,
    },
    {
      id: 'manicure',
      name: 'Manicure',
      image: {
        src: '/images/service-manicure.png',
        alt: 'Manicure con puntas azul claro',
      },
      description:
          'Cuidado de uñas y manos con un acabado limpio y una apariencia natural.',
      durationMinutes: 60,
      priceMxn: 450,
    },
    {
      id: 'tratamiento',
      name: 'Tratamiento capilar',
      image: {
        src: '/images/service-tratamiento.png',
        alt: 'Aplicación de un tratamiento capilar',
      },
      description:
          'Un tratamiento para hidratar tu cabello y recuperar su suavidad y brillo.',
      durationMinutes: 30,
      priceMxn: 280,
    },
  ],
  staff: [
    {id: 'ana', name: 'Ana', serviceIds: ['corte', 'tratamiento']},
    {id: 'sofia', name: 'Sofía', serviceIds: ['manicure', 'tratamiento']},
  ],
};

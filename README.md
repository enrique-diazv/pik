# PIK — Prueba técnica

Demo realizada por Enrique Díaz Vera con Next.js, App Router y TypeScript. Implementa dos flujos completos con datos simulados:

1. **Alta de un negocio:** datos de contacto, categorías, ubicación, horarios, servicios, staff, resumen y confirmación.
2. **Agendamiento de una cita:** perfil del negocio, selección de servicio y staff, fecha y horario, resumen y confirmación.

El landing permite acceder a ambas vistas. No se requiere base de datos, autenticación, pagos, claves de API ni servicios externos en ejecución. Se necesita conexión a Internet para clonar e instalar las dependencias.

## Cómo ejecutar

Entorno utilizado: **Node.js 24.18.0 y npm 11.16.0**. Se recomienda Node.js 24 para reproducir ese entorno.

Desde PowerShell:

```powershell
git clone https://github.com/enrique-diazv/pik.git
cd pik
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

`npm ci` instala las versiones registradas en `package-lock.json`. No es necesario crear un archivo `.env`.

Para producción, detén primero el servidor de desarrollo:

```powershell
npm run build
npm start
```

`npm start` requiere una compilación de producción exitosa.

### Rutas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Presentación de la prueba y acceso a las dos vistas |
| `/business/onboarding` | Alta de un negocio |
| `/booking` | Perfil del negocio y flujo de reserva |

### Comprobaciones disponibles

```powershell
npm run lint
npm run typecheck
npm run build
```

No se incluyeron pruebas automatizadas: el reto indica que no se evalúan y se priorizó completar los flujos y comprobarlos manualmente. Estos comandos revisan lint, tipos y compilación; no sustituyen las pruebas de interacción.

## Organización de carpetas y por qué

```text
public/images/          Imágenes locales de la demo
src/
  app/                  Rutas del App Router, layout, metadata y estilos globales
    business/onboarding/
    booking/
  components/
    business/           Formularios y componentes del alta de negocio
    booking/            Perfil, galería, panel de reserva y selectores
    ui/                 Componentes compartidos entre vistas
  data/mocks/           Negocio, citas y operaciones simuladas
  lib/                  Validación y cálculo de horarios y disponibilidad
  types/                Modelos de negocio y reserva
```

Las rutas componen las pantallas; los componentes gestionan la presentación y la interacción; `lib` concentra reglas reutilizables; `types` define los contratos; y `data/mocks` separa los datos ficticios y las operaciones simuladas.

Los componentes se agrupan por funcionalidad para mantener cerca los archivos que cambian juntos. Los CSS Modules viven junto a sus componentes y evitan colisiones de nombres. Los estilos globales contienen los colores y las bases visuales compartidas.

### Uso de Next.js

- El layout raíz y las páginas sin estado interactivo son Server Components.
- Los formularios, selectores, galería y flujo de reserva son Client Components porque necesitan estado, eventos o APIs del navegador.
- `Link` permite navegar entre el landing y las vistas. Las imágenes locales se muestran mediante `next/image`.
- El alta mantiene sus pasos en estado local. La reserva utiliza un panel modal dentro del perfil. No se crea una ruta por cada paso porque forman una interacción temporal y comparten datos.
- No se añadieron Route Handlers: los mocks locales cubren el alcance sin introducir una capa HTTP para esta demo.

## Decisiones principales de UI/UX

### Diseño para celular

Se priorizaron formularios en una columna, controles táctiles, tarjetas legibles y navegación inferior. El perfil conserva el contexto del negocio mientras el panel de reserva aparece desde abajo sobre un fondo oscurecido. El landing adapta sus tarjetas a una o dos columnas según el ancho disponible.

### Alta de un negocio

- Se separaron datos, categorías, ubicación, servicios y staff para reducir las decisiones por pantalla.
- Los valores confirmados se conservan al retroceder dentro del flujo. La edición de horarios utiliza un borrador que se aplica al guardar.
- Se valida el teléfono de diez dígitos, los campos obligatorios, la duración y el precio de los servicios, y las asignaciones de staff.
- Los horarios requieren un cierre posterior a la apertura y no permiten solapamientos. Los rangos nuevos deben confirmarse antes de guardar.
- Los servicios y el staff tienen acciones de edición y eliminación desde los tres puntos; también admiten un gesto lateral.
- Se requiere al menos un servicio y una persona con asignaciones válidas para completar el registro. El resumen permite revisar la información antes de confirmar.
- La confirmación muestra un estado de éxito desde la parte superior de la página y permite volver al landing.

### Reserva de una cita

- Cada servicio muestra imagen, descripción, duración, precio y una acción para agendar.
- Solo se ofrecen personas que atienden el servicio elegido. “Cualquier persona disponible” reúne su disponibilidad y asigna una persona real al confirmar.
- Los horarios se calculan en intervalos de quince minutos considerando la duración completa del servicio, el horario del negocio y las citas ocupadas de cada persona.
- Los días sin disponibilidad y los horarios ocupados o pasados se deshabilitan. Cambiar de fecha elimina la selección de hora anterior.
- La disponibilidad se vuelve a comprobar al confirmar para evitar aceptar una selección que ya no sea válida.
- Durante la confirmación se indica la carga y se bloquean nuevas confirmaciones. Los errores permiten volver a elegir horario; el éxito muestra servicio, persona asignada, fecha, horario y folio.
- La galería permite ampliar imágenes y cerrar al tocar fuera de la imagen o pulsar Escape.

### Alcance y límites de los mocks

Las dos vistas son demos independientes: registrar un negocio no reemplaza el negocio ficticio del perfil de reservas. Los formularios no persisten tras recargar o abandonar el registro.

Las reservas confirmadas se guardan en memoria del navegador y bloquean los horarios correspondientes durante esa ejecución. Se pierden al recargar; no existe sincronización entre pestañas o usuarios. El registro devuelve una confirmación simulada, sin guardar el negocio en un servidor.

El selector muestra los próximos nueve días. Los horarios son compartidos por el negocio; no se modelan turnos individuales del staff. Las confirmaciones incluyen una demora simulada para representar el estado de carga.

## Qué hice con IA

Utilicé Codex como mentor y compañero de programación para descomponer el reto en pasos pequeños, proponer componentes y estilos, explicar conceptos de React y Next.js, revisar código y analizar errores de TypeScript, JSX y comportamiento.

La IA también ayudó a plantear las reglas de disponibilidad, la validación de horarios, las interacciones del panel y la documentación. Incorporé las propuestas, ejecuté los comandos y comprobé manualmente los flujos, ajustando el resultado con capturas y pruebas en celular.

La IA fue una herramienta de apoyo durante la implementación; la responsabilidad de comprender, revisar y defender el código entregado es mía.

## Qué dejaría para una segunda versión

- Pruebas automatizadas de solapamientos, duración, asignación de staff y recorridos completos de ambos flujos.
- Persistencia y conexión entre el negocio registrado y su perfil de reservas, empezando por una solución local si se mantiene el alcance de demo.
- Navegación del calendario por semanas o meses y horarios individuales por persona.
- Una política explícita de zona horaria del negocio y actualización de disponibilidad si la pantalla permanece abierta mucho tiempo.
- Más comprobaciones de accesibilidad, navegación con teclado y estados vacíos, además de refinar los casos límite del editor de horarios.
- Separar el coordinador de la reserva de las pestañas del perfil y consolidar estilos y lógica compartida entre formularios.

Una API, almacenamiento compartido y control de reservas concurrentes solo se incorporarían si el proyecto evoluciona a un producto real. No forman parte de los requisitos de esta prueba.

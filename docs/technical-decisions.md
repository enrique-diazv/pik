# Technical Decisions

## Alcance y fuentes

El PDF del reto tiene prioridad por indicación del usuario. El Markdown aporta sugerencias de trabajo y las capturas aportan referencias visuales; no amplían automáticamente el alcance.

El PDF exige dos flujos completos, Next.js con App Router y TypeScript, mocks locales, prioridad a celular, estados de UI y repositorio público con commits de avance. Vercel es opcional. El parecido con la aplicación real y las pruebas automatizadas no se evalúan.

## Project structure

### Decision

Usar `src/app` para rutas y layout, `src/components/ui` para UI compartida, `src/types` para modelos y `src/data/mocks` para datos ficticios. La documentación vive en `docs`.

### Why

Cada responsabilidad queda fácil de localizar y la estructura es suficiente para dos flujos. Los componentes específicos de alta y reserva se agregarán al implementar cada flujo.

### Alternatives considered

Carpetas en la raíz o una arquitectura por features. Para el tamaño actual, `src` separa el código de configuración y documentación sin introducir capas adicionales.

## UI/UX

### Decision

Tomar de las capturas el acento naranja, superficies claras, tarjetas redondeadas y jerarquía de texto. La portada es una base visual; todavía no ofrece los flujos interactivos.

### Why

Mantener coherencia visual sin convertir la reproducción de la app real en un requisito. Las referencias incluyen servicios, personal, fecha y hora, resumen y un día sin disponibilidad.

La confirmación final y la gestión de servicios, horarios y staff se diseñarán según el PDF. El usuario no tiene acceso a la gestión y no hará una reserva real para obtener referencias adicionales.

## Mobile-first approach

### Decision

La portada usa una columna como base y dos columnas a partir de 720 px. Tipografía fluida, espaciado flexible y foco visible.

### Why

El PDF prioriza celular. Las decisiones de formularios y navegación se documentarán cuando existan en el código.

## Next.js

### Server Components

El layout raíz, la portada y `Brand` son Server Components. No requieren estado, efectos ni APIs del navegador.

### Client Components

Todavía no existen. Se usarán en los formularios y selectores interactivos al implementar los flujos.

### Routing

Existe `/`. Se prevén `/business/onboarding` y `/booking`, aún no implementadas.

### Data fetching / mocks

`src/data/mocks/business.ts` exporta un negocio ficticio tipado con servicios, staff y horarios. No está conectado a la portada y no llama servicios externos. No se copiaron datos personales de las capturas.

## State management

### Decision

No hay estado interactivo en esta etapa. El estado de los flujos y las reglas de disponibilidad se decidirán y documentarán durante su implementación.

### Why

Evitar elegir una librería global antes de tener una necesidad concreta.

## Estilos

CSS Modules para componentes y CSS global para tokens y normalización. Se eligió frente a Tailwind o una librería de componentes por su alcance explícito y para reducir dependencias. Las fuentes del sistema evitan descargas externas durante el build.

## AI usage

### What AI was used for

Comparar instrucciones, revisar capturas, inicializar Next.js y proponer portada, modelos, mocks y documentación.

### What I reviewed or changed myself

Pendiente de revisión por el candidato. El usuario fijó la prioridad del PDF, la ubicación del repositorio y las referencias disponibles. Las comprobaciones del agente no equivalen a una revisión manual del candidato.

## Trade-offs

### What I intentionally did not implement

Backend, autenticación, pagos reales, integración con el entorno real de PIK o aprobación administrativa de negocios.

### Why

El reto usa mocks y prioriza dos flujos completos dentro de 48 horas. Esta etapa solo inicializa el repositorio; los flujos y validaciones siguen pendientes.

## What I would improve in a second version

API real, persistencia, autenticación y control concurrente de disponibilidad. Los horarios requerirían validación en servidor para evitar dobles reservas.

## Pendientes de implementación y sustentación

- CRUD de servicios y asignación al staff.
- Estado y navegación de ambos flujos.
- Disponibilidad y bloqueo de horarios ocupados según duración.
- Validaciones y estados loading, empty, error y success.
- Verificación de los flujos en celular y escritorio.
- Publicación del repositorio en GitHub; Vercel opcional.

Las respuestas de entrevista se agregarán cuando exista una implementación concreta que explicar.

## Verificación de la base

- ESLint y comprobación de TypeScript completados correctamente.
- Build de producción completado correctamente.
- `npm audit --omit=dev`: cero vulnerabilidades en dependencias de producción.
- `npm audit`: cinco avisos de severidad alta en una cadena de herramientas de desarrollo (`braces`, `micromatch`, `fast-glob` y configuración de ESLint de Next.js). No se ejecutó `audit fix --force`, que propone bajar la configuración a Next.js 14. No hay una corrección compatible reportada por npm en esta instalación.

La verificación visual en navegador y los recorridos completos de alta/reserva quedan pendientes de las siguientes etapas.

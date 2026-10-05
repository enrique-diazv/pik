# PIK — Reto técnico

Aplicación de reservas para belleza y bienestar. La fuente principal de alcance es el PDF del reto; el Markdown y las capturas son referencias complementarias.

## Estado actual

Base inicializada: Next.js con App Router, TypeScript, estilos, portada adaptable, tipos de negocio y mocks locales. Los flujos de alta y reserva están pendientes de implementación.

## Ejecutar

Requiere Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`npm start` requiere ejecutar `npm run build` primero.

Las comprobaciones de lint, TypeScript y build pasan. La auditoría de producción no reporta vulnerabilidades; hay avisos en dependencias de desarrollo documentados en las decisiones técnicas.

## Stack y estructura

Next.js con App Router y TypeScript. CSS Modules para componentes y variables globales para colores y estilos base. Datos ficticios locales, sin base de datos, autenticación ni pagos.

```text
src/
  app/                 # Rutas, layout y estilos base
  components/ui/       # Componentes compartidos
  data/mocks/          # Datos ficticios locales
  types/               # Modelos de negocio, servicios y staff
docs/
  technical-decisions.md
```

Rutas previstas: `/business/onboarding` y `/booking`; se agregarán con sus flujos.

## Prioridades del reto

1. Alta completa: datos, ubicación y horarios, CRUD de servicios, staff con asignaciones, resumen y confirmación.
2. Reserva completa: perfil, servicio, personal, fecha y hora, resumen y confirmación.
3. Funcionamiento en celular; validaciones y estados vacío, carga, error y éxito.
4. Horarios ocupados no seleccionables y días sin disponibilidad.
5. Código organizado y decisiones explicables en entrevista.

La adaptación a escritorio acompañará el diseño para celular. Vercel es opcional según el PDF; no se ha publicado todavía.

## Decisiones y uso de IA

Consulta [las decisiones técnicas](docs/technical-decisions.md) para conocer la estructura, la UI y los límites de esta etapa. La IA asistió en la inicialización y documentación. La revisión manual por el candidato sigue pendiente.

## Segunda versión

API real, persistencia, autenticación, disponibilidad concurrente y pruebas automatizadas de reglas de negocio. Estos puntos no forman parte de la base actual.

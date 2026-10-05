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

Las comprobaciones de lint, TypeScript y build pasan. La auditoría de producción no reporta vulnerabilidades; hay cinco avisos de severidad alta en dependencias de desarrollo de ESLint. No se aplicó la corrección forzada que propone bajar la configuración a Next.js 14.

## Stack y estructura

Next.js con App Router y TypeScript. CSS Modules para componentes y variables globales para colores y estilos base. Datos ficticios locales, sin base de datos, autenticación ni pagos.

```text
src/
  app/                 # Rutas, layout y estilos base
  components/ui/       # Componentes compartidos
  data/mocks/          # Datos ficticios locales
  types/               # Modelos de negocio, servicios y staff
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

Las carpetas separan rutas, componentes, modelos y mocks para localizar cada responsabilidad con facilidad. CSS Modules mantiene los estilos de cada componente separados; las variables globales unifican colores y estilos base. La portada y el layout son Server Components porque no necesitan interacción. Los formularios usarán Client Components al implementar los flujos.

El documento de trabajo de decisiones se mantiene fuera del repositorio, en `D:\Code\Projects\Pik\technical-decisions.md`. El README concentra la documentación del proyecto que se entregará en GitHub.

La IA asistió en la inicialización y documentación. La revisión manual por el candidato sigue pendiente.

## Segunda versión

API real, persistencia, autenticación, disponibilidad concurrente y pruebas automatizadas de reglas de negocio. Estos puntos no forman parte de la base actual.

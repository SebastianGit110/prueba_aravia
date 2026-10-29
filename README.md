# Arranque de la prueba técnica full-stack

Backend y frontend listos para correr, ya conectados entre sí. Es el punto de partida de la prueba, para que no gastes tiempo en instalar y configurar.

| Carpeta | Qué hay | Puerto |
|---------|---------|:------:|
| `api/` | NestJS con TypeScript, con CORS habilitado hacia el front | 3000 |
| `web/` | React con Vite y TypeScript | 5173 |

Trae **solo lo que generan los CLI de Nest y de Vite**. No hay estructura de capas, ni entidades, ni interfaces de repositorio, ni librería de componentes, ni manejo de estado. Esas decisiones son tuyas y son parte de lo que se evalúa, así que cuéntanos en voz alta por qué las tomas. Si quieres reorganizar las carpetas, hazlo y explica por qué.

## Requisitos

- **Node 22** (está en `.nvmrc`, con `nvm use` queda listo).
- **npm 10 o superior.** Con npm 9.2 la instalación falla. Revisa con `npm -v` antes de empezar.

## Cómo correrlo

```bash
npm install     # instala la raíz, api/ y web/
npm run dev     # levanta los dos a la vez
```

Abre http://localhost:5173. Si ves *La API respondió: Hello World!*, el frontend está hablando con el backend y puedes empezar.

Esa pantalla existe solo para comprobar la conexión. Bórrala y construye lo tuyo.

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Levanta la API y el front juntos, en modo watch |
| `npm run dev:api` | Solo la API |
| `npm run dev:web` | Solo el front |
| `npm run build` | Compila los dos |
| `npm test` | Corre las pruebas de la API con Vitest |
| `npm run lint` | Revisa los dos con oxlint |

## Configuración

El front lee la URL de la API de `VITE_API_URL`. Si no defines la variable, usa `http://localhost:3000`, así que no tienes que configurar nada para empezar. El ejemplo está en [`web/.env.example`](./web/.env.example).

La API acepta peticiones del origen que diga `WEB_ORIGIN`, y por defecto `http://localhost:5173`. Si cambias el puerto del front, cambia esa variable.

## Antes de entregar

Reemplaza este archivo por tu propio `README.md`, con cómo se corre tu proyecto, qué decisiones tomaste, qué dejaste afuera y qué harías con más tiempo.

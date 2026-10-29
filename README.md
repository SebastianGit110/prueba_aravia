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

## Dependencias adicionales

### Backend (`api/`)

No hay nada que instalar aparte. Con `npm i` (o el `npm install` de la raíz) queda listo.

### Frontend (`web/`)

El front necesita **Tailwind CSS**, **shadcn/ui** y **axios**. Ejecuta todo desde la carpeta `web/`.

**1. Tailwind CSS**

```bash
cd web
npm install tailwindcss @tailwindcss/vite
```

Reemplaza todo el contenido de `src/index.css` por:

```css
@import "tailwindcss";
```

**2. Alias `@/` (shadcn lo exige)**

```bash
npm install -D @types/node
```

Agrega esto en `compilerOptions` de **`tsconfig.json` y de `tsconfig.app.json`** (en los dos):

```json
"paths": { "@/*": ["./src/*"] }
```

Y en `vite.config.ts` registra el plugin de Tailwind y el alias (conserva el plugin de React que ya tengas):

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

**3. shadcn/ui**

```bash
npx shadcn@latest init
npx shadcn@latest add button input label select card alert alert-dialog badge skeleton
```

**4. axios (y los íconos que usan los componentes)**

```bash
npm install axios lucide-react
```

**Resumen**

```bash
cd web
npm install tailwindcss @tailwindcss/vite axios lucide-react
npm install -D @types/node
# editar index.css, tsconfig.json, tsconfig.app.json y vite.config.ts (pasos 1 y 2)
npx shadcn@latest init
npx shadcn@latest add button input label select card alert alert-dialog badge skeleton
```

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

## Decisiones, alcance y próximos pasos

### Qué decisiones tomé

1. **Entender el problema.** Leí el enunciado completo antes de escribir código: un catálogo de cuentas jerárquico (clase, grupo, cuenta y subcuenta) con reglas propias del dominio contable.
2. **Definir los requerimientos que no pueden fallar.** Armé una lista con el núcleo del sistema y la usé como criterio de aceptación:
   - El código es numérico, de 1, 2, 4 o 6 dígitos, y único en todo el catálogo.
   - No se crea una cuenta si su padre no existe.
   - No se elimina una cuenta que tenga hijas.
   - Solo las cuentas sin hijas admiten movimientos contables.
   - Cada clase define su naturaleza (débito o crédito) y sus descendientes la heredan.
3. **Elegir las librerías de interfaz.** Instalé Tailwind CSS y shadcn/ui en el frontend para construir una interfaz consistente sin escribir estilos desde cero.
4. **Generar la base con IA, a partir de un prompt.** Redacté un prompt con el enunciado y los requerimientos para generar el punto de partida del frontend y del backend sobre las plantillas de este repositorio.
5. **Validar lo que generó la IA.** Revisé el código y lo contrasté con la lista de requerimientos con peticiones reales a la API.
6. **Conectar el frontend con el backend usando axios.** Centralicé las peticiones en una sola instancia de axios, con funciones simples por operación y un único punto para traducir los errores de la API. Después volví a verificar el flujo completo: crear, consultar el árbol y eliminar.

### Qué dejé afuera

- **Persistencia en base de datos.** Por ahora las cuentas viven en memoria dentro del backend, así que se pierden al reiniciar el servidor.
- **La tabla SQL para PostgreSQL.** Quedó pendiente el script de creación, con su llave primaria sobre el código y su relación con la cuenta padre.

### Qué haría con más tiempo

- **Reorganizar el frontend por módulos o funcionalidades.** La estructura actual funciona, pero en un proyecto que crece conviene agrupar por funcionalidad, con sus componentes, hooks, servicios y tipos juntos. Eso facilita entender y mantener el código.
- **Persistir los datos en PostgreSQL.** Así la información sobreviviría a los reinicios. El repositorio en memoria ya está detrás de una interfaz definida por el dominio, por lo que cambiarlo no afectaría las reglas de negocio ni los casos de uso.
- **Agregar campos de trazabilidad y descripción a cada cuenta:** fecha y hora de creación, usuario que la creó y una descripción libre.

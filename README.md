# DolarFinanciero

Sitio informativo para consultar cotizaciones del dólar, otras monedas y el índice UVA en Argentina. La interfaz conserva el tablero oscuro de la versión vanilla y ahora corre con Next.js App Router, TypeScript e ISR.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`. La home consulta `dolarapi.com` con revalidación de 5 minutos. `/uva` consulta la serie diaria de ArgentinaDatos con revalidación de 24 horas. La fuente oficial primaria del índice UVA es el BCRA; ArgentinaDatos republica esa serie.

## Estructura

- `src/app/page.tsx`: cotizaciones, ledgers y conversor.
- `src/app/uva/page.tsx`: calculadora UVA histórica e indexada.
- `src/app/lib/api.ts`: fetchers tipados con estados de error.
- `src/app/components/`: piezas visuales separadas por responsabilidad.

## Deploy

Vercel es la opción más directa para Next.js: soporta Server Components, ISR y despliegues por commit sin configuración adicional. Render también puede ejecutar Next.js como Web Service con `npm run build` y `npm run start`, pero ya no debe publicarse como Static Site si se quieren conservar SSR/ISR; requiere configurar el puerto y el proceso persistente. Un export estático perdería el comportamiento de revalidación del servidor.

Las URLs públicas pueden documentarse o sobreescribirse mediante `.env.local` a partir de `.env.local.example` cuando se centralice esa configuración.

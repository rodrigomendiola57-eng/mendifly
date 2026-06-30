# Mendifly

Landing page de Mendifly — Next.js, TypeScript y Tailwind CSS.

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
cd mendifly
npm install
```

## Desarrollo (puerto 3000)

```bash
cd c:\mendifly\mendifly
npm run dev -- -p 3000
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Para acceder desde otro dispositivo en la misma red (móvil, tablet):

```bash
cd mendifly; npm run dev -- -p 3000
```

Luego entra con la IP de tu PC, por ejemplo: `http://192.168.10.247:3000`

## Producción

```bash
npm run build
npm run start -- -p 3000
```

La app quedará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts


| Comando                    | Descripción                           |
| -------------------------- | ------------------------------------- |
| `npm run dev -- -p 3000`   | Servidor de desarrollo en puerto 3000 |
| `npm run build`            | Compila para producción               |
| `npm run start -- -p 3000` | Sirve la build en puerto 3000         |
| `npm run lint`             | Ejecuta ESLint                        |



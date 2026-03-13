# Restaurante Frontend
Proyecto final de Cliente de Desarrollo de Aplicaciones Web.

## Funcionalidad
- Consumo de datos de API externa: https://github.com/juanda99/restaurante-backend
- Listado de restaurantes.
- Al seleccionar uno: platos, pedidos y datos de clientes.
- Peticiones asíncronas con fetch (async/await o promesas).
- Hooks: useEffect y useState.
- React Router si hay varias páginas.

## Interfaz de usuario
- Diseño responsive para móvil y escritorio.
- Actualización dinámica sin recargar (useState).
- React Router si hay varias URL.
- Recomendado: framework CSS y componentes de terceros.

## Despliegue
- Bundler: Vite.
- Frontend en GitHub Pages:
  https://luna-francisco.github.io/restaurante-frontend/
- Backend remoto configurado en `.env.production` con `VITE_API_URL`.

## Levantar en local
Backend (Docker):
1. Clonar: `git clone https://github.com/luna-francisco/restaurante-backend.git`
2. Ejecutar: `docker compose up -d`
3. API: `http://localhost:4000`

Frontend:
1. `npm install`
2. `npm run dev`
3. URL local: `http://localhost:5173/restaurante-frontend/`

## Control de versiones
- Mínimo 5 commits con mensajes claros.
- Una sola rama es suficiente.

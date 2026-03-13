# Restaurante Frontend


## Funcionalidad
- Consume datos de una API externa
- Muestra un conjunto de restaurantes.
- Al elegir uno, muestra sus platos, sus pedidos y los datos de los clientes.
- Peticiones asíncronas (fetch con async/await o promesas).
- Uso de hooks: useEffect y useState.
- Uso de React Router si hay varias páginas.

## Interfaz de usuario
- Diseño responsive para móvil y escritorio.
- Actualización dinámica sin recargar (useState).
- React Router si hay varias URL.
- Recomendado: framework CSS y componentes de terceros para tablas.

## Despliegue
- Bundler: Vite.
- URL pública: https://luna-francisco.github.io/restaurante-frontend/

## Levantar en local
Backend:
1. Clonar: `git clone` https://github.com/juanda99/restaurante-backend
2. Ejecutar contenedores: `docker compose up -d`
3. API: `http://localhost:4000`

Frontend:
1. `npm install`
2. `npm run dev`
3. URL local: `http://localhost:5173/restaurante-frontend/`


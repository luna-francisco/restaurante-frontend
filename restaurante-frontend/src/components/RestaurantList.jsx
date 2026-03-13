import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const getRestaurantName = (restaurant, index) =>
  restaurant?.name ||
  restaurant?.restaurante ||
  `Restaurante ${restaurant?.id ?? restaurant?.restauranteID ?? index + 1}`;

function RestaurantList({ restaurants, loading, error }) {
  const [query, setQuery] = useState("");
  const list = Array.isArray(restaurants) ? restaurants : [];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return list;
    return list.filter((restaurant) => {
      const name = restaurant?.restaurante?.toLowerCase() || "";
      const barrio = restaurant?.barrio?.toLowerCase() || "";
      return name.includes(normalized) || barrio.includes(normalized);
    });
  }, [query, restaurants]);

  if (loading) return <p className="state">Cargando restaurantes...</p>;
  if (error) return <p className="state state--error">{error}</p>;
  if (!list.length)
    return <p className="state">No hay restaurantes disponibles.</p>;

  return (
    <section className="page__section">
      <div className="restaurant-toolbar">
        <div>
          <h2 className="restaurant-toolbar__title">Explora el catálogo</h2>
          <p className="restaurant-toolbar__subtitle">
            Accede rápido a cada restaurante y consulta su detalle.
          </p>
        </div>
        <div className="restaurant-toolbar__badge">
          {filtered.length} disponibles
        </div>
      </div>
      <div className="search-bar">
        <div className="search-bar__field">
          <span className="search-bar__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o barrio"
            aria-label="Buscar restaurante"
          />
        </div>
        <div className="search-bar__hint">
          {filtered.length === list.length
            ? "Mostrando todo el catálogo."
            : `Filtrado activo: ${filtered.length} resultados.`}
        </div>
      </div>
      <div className="grid grid--restaurants">
        {filtered.map((restaurant, index) => (
          <article
            key={restaurant?.id ?? restaurant?.restauranteID ?? index}
            className="card card--link card--restaurant"
          >
            <div>
              <h3>{getRestaurantName(restaurant, index)}</h3>
              {restaurant?.barrio && <p>{restaurant.barrio}</p>}
            </div>
            <Link
              to={`/restaurant/${
                restaurant?.id ?? restaurant?.restauranteID ?? index
              }`}
            >
              Ver detalles
            </Link>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <p className="state">No hay resultados para esa búsqueda.</p>
      )}
    </section>
  );
}

export default RestaurantList;

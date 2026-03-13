import { Link } from "react-router-dom";

const getRestaurantName = (restaurant, index) =>
  restaurant?.name ||
  restaurant?.nombre ||
  restaurant?.restaurante ||
  restaurant?.title ||
  `Restaurante ${restaurant?.id ?? index + 1}`;

function RestaurantList({ restaurants, loading, error }) {
  if (loading) return <p className="state">Cargando restaurantes...</p>;
  if (error) return <p className="state state--error">{error}</p>;
  if (!restaurants?.length)
    return <p className="state">No hay restaurantes disponibles.</p>;

  return (
    <section className="page__section">
      <div className="grid grid--restaurants">
        {restaurants.map((restaurant, index) => (
          <article
            key={restaurant?.id ?? restaurant?.restauranteID ?? index}
            className="card card--link card--restaurant"
          >
            <div>
              <h3>{getRestaurantName(restaurant, index)}</h3>
              {restaurant?.address && <p>{restaurant.address}</p>}
              {restaurant?.direccion && <p>{restaurant.direccion}</p>}
              {restaurant?.barrio && <p>{restaurant.barrio}</p>}
              {restaurant?.cuisine && <p>{restaurant.cuisine}</p>}
              {restaurant?.tipo && <p>{restaurant.tipo}</p>}
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
    </section>
  );
}

export default RestaurantList;

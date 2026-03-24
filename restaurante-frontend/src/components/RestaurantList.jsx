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
      <div className="card table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Restaurante</th>
                <th>Barrio</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant, index) => (
                <tr
                  key={restaurant?.id ?? restaurant?.restauranteID ?? index}
                >
                  <td>{restaurant?.id ?? restaurant?.restauranteID ?? "-"}</td>
                  <td>{getRestaurantName(restaurant, index)}</td>
                  <td>{restaurant?.barrio ?? "-"}</td>
                  <td>
                    <Link
                      to={`/restaurant/${
                        restaurant?.id ?? restaurant?.restauranteID ?? index
                      }`}
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default RestaurantList;

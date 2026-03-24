import { useEffect, useState } from "react";
import { getDishes } from "../services/api";

const getDishName = (dish, index) =>
  dish?.name ||
  dish?.nombre ||
  dish?.plato ||
  dish?.title ||
  `Plato ${index + 1}`;

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

function DishList({ items, loading: loadingProp, error: errorProp }) {
  const [dishes, setDishes] = useState(items ?? []);
  const [loading, setLoading] = useState(items ? false : true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items !== undefined) {
      setDishes(items);
      setLoading(false);
      setError("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    getDishes()
      .then((data) => {
        if (!isMounted) return;
        setDishes(normalizeList(data));
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "No se pudieron cargar los platos.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [items]);

  const isLoading = loadingProp ?? loading;
  const messageError = errorProp ?? error;

  if (isLoading) return <p className="state">Cargando platos...</p>;
  if (messageError) return <p className="state state--error">{messageError}</p>;
  if (!dishes?.length) return <p className="state">No hay platos.</p>;

  return (
    <div className="card table-card">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Plato</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Restaurante</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish, index) => (
              <tr key={dish?.id ?? dish?.platoID ?? index}>
                <td>{dish?.id ?? dish?.platoID ?? "-"}</td>
                <td>{getDishName(dish, index)}</td>
                <td>{dish?.descripcion ?? "-"}</td>
                <td>{dish?.price ?? dish?.precio ?? "-"}</td>
                <td>{dish?.categoriaID ?? dish?.categoriaId ?? "-"}</td>
                <td>
                  {dish?.restaurantId ??
                    dish?.restauranteID ??
                    dish?.restauranteId ??
                    "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DishList;

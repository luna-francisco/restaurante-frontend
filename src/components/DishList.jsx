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
    <div className="grid grid--compact">
      {dishes.map((dish, index) => (
        <article key={dish?.id ?? index} className="card">
          <h3>{getDishName(dish, index)}</h3>
          {(dish?.price ?? dish?.precio) && (
            <p>Precio: {dish?.price ?? dish?.precio}</p>
          )}
        </article>
      ))}
    </div>
  );
}

export default DishList;

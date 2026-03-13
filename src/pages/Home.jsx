import { useEffect, useState } from "react";
import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "../services/api";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getRestaurants()
      .then((data) => {
        if (!isMounted) return;
        setRestaurants(Array.isArray(data) ? data : data?.data || []);
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "No se pudo cargar la lista de restaurantes.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page">
      <header className="page__header">
        <h1>Restaurantes</h1>
        <p>Selecciona un restaurante para ver sus datos.</p>
      </header>

      <RestaurantList
        restaurants={restaurants}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Home;

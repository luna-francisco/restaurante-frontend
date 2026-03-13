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
      <header className="hero hero--home">
        <div className="hero__meta">
          <span className="hero__chip">Edición 2026</span>
          <span className="hero__tag">Directorio gastronómico</span>
        </div>
        <h1 className="hero__title">Restaurantes</h1>
        <p className="hero__subtitle">
          Selecciona un restaurante para explorar sus platos, pedidos y clientes.
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-label">Restaurantes</span>
            <span className="hero__stat-value">
              {loading ? "…" : restaurants.length}
            </span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-label">Acceso</span>
            <span className="hero__stat-value">Directo</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-label">Estado</span>
            <span className="hero__stat-value">
              {error ? "Revisar API" : "Sincronizado"}
            </span>
          </div>
        </div>
        <div className="hero__glow" aria-hidden="true" />
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

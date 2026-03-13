import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DishList from "../components/DishList";
import OrderList from "../components/OrderList";
import CustomerList from "../components/CustomerList";
import { getCustomers, getDishes, getOrders, getRestaurant } from "../services/api";

const getRestaurantName = (restaurant) =>
  restaurant?.name ||
  restaurant?.restaurante ||
  `Restaurante ${restaurant?.id ?? restaurant?.restauranteID ?? ""}`.trim();

const getDishRestaurantId = (dish) =>
  dish?.restaurantId ?? dish?.restauranteID ?? dish?.restauranteId;

const getOrderRestaurantId = (order) =>
  order?.restaurantId ?? order?.restauranteID ?? order?.restauranteId;

const getOrderCustomerId = (order) =>
  order?.customerId ?? order?.clienteID ?? order?.clienteId;

const getCustomerId = (customer) => customer?.id ?? customer?.clienteID;

function RestaurantDetail() {
  const { id } = useParams();
  const restaurantId = useMemo(() => String(id), [id]);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const restaurantData = await getRestaurant(id);

        const [dishesData, ordersData, customersData] = await Promise.all([
          getDishes(),
          getOrders(),
          getCustomers(),
        ]);

        if (!isMounted) return;
        const allDishes = Array.isArray(dishesData) ? dishesData : [];
        const allOrders = Array.isArray(ordersData) ? ordersData : [];
        const allCustomers = Array.isArray(customersData) ? customersData : [];

        const filteredDishes = allDishes.filter(
          (dish) => String(getDishRestaurantId(dish)) === restaurantId
        );

        const filteredOrders = allOrders.filter(
          (order) => String(getOrderRestaurantId(order)) === restaurantId
        );

        const customersById = new Map(
          allCustomers.map((customer) => [String(getCustomerId(customer)), customer])
        );

        const ordersWithCustomer = filteredOrders.map((order) => ({
          ...order,
          customer: customersById.get(String(getOrderCustomerId(order))) || null,
        }));

        const customerMap = new Map();
        ordersWithCustomer.forEach((order) => {
          const customer = order.customer;
          const customerId = getCustomerId(customer);
          if (customerId !== undefined) {
            customerMap.set(String(customerId), customer);
          }
        });

        setRestaurant(restaurantData);
        setDishes(filteredDishes);
        setOrders(ordersWithCustomer);
        setCustomers(Array.from(customerMap.values()));
        setError("");
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.message || "No se pudo cargar el restaurante."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="page">
      <header className="hero hero--compact">
        <div className="hero__meta">
          <span className="hero__chip">Edición 2026</span>
          <span className="hero__tag">Ficha de restaurante</span>
        </div>
        <h1 className="hero__title">
          {loading ? "Cargando..." : getRestaurantName(restaurant)}
        </h1>
        <p className="hero__subtitle">
          Resumen completo de platos, pedidos y clientes asociados.
        </p>
        <div className="hero__actions">
          <Link className="hero__back" to="/">
            Volver al listado
          </Link>
        </div>
        <div className="hero__glow" aria-hidden="true" />
      </header>

      {loading && <p className="state">Cargando restaurante...</p>}
      {error && !loading && <p className="state state--error">{error}</p>}

      {!loading && !error && restaurant && (
        <>
          <section className="summary">
            <div className="summary__card">
              <p className="summary__label">Platos</p>
              <p className="summary__value">{dishes.length}</p>
            </div>
            <div className="summary__card">
              <p className="summary__label">Pedidos</p>
              <p className="summary__value">{orders.length}</p>
            </div>
            <div className="summary__card">
              <p className="summary__label">Clientes</p>
              <p className="summary__value">{customers.length}</p>
            </div>
          </section>

          <div className="card info-card">
            <div className="card__row">
              <span className="card__label">ID</span>
              <span>{restaurant.id ?? restaurant.restauranteID ?? id}</span>
            </div>
            {restaurant.address && (
              <div className="card__row">
                <span className="card__label">Dirección</span>
                <span>{restaurant.address}</span>
              </div>
            )}
            {restaurant.barrio && (
              <div className="card__row">
                <span className="card__label">Barrio</span>
                <span>{restaurant.barrio}</span>
              </div>
            )}
          </div>
        </>
      )}

      <section className="page__section">
        <h2>Platos</h2>
        <DishList items={dishes} loading={loading} error={error} />
      </section>

      <section className="page__section">
        <h2>Pedidos</h2>
        <OrderList items={orders} loading={loading} error={error} />
      </section>

      <section className="page__section">
        <h2>Clientes</h2>
        <CustomerList
          items={customers}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  );
}

export default RestaurantDetail;

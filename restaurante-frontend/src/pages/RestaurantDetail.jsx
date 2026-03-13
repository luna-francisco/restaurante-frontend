import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DishList from "../components/DishList";
import OrderList from "../components/OrderList";
import CustomerList from "../components/CustomerList";
import {
  getCustomers,
  getDishes,
  getOrders,
  getRestaurant,
  getRestaurants,
} from "../services/api";

const getRestaurantName = (restaurant) =>
  restaurant?.name ||
  restaurant?.nombre ||
  restaurant?.restaurante ||
  restaurant?.title ||
  `Restaurante ${restaurant?.id ?? ""}`.trim();

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

const getRestaurantId = (restaurant, fallback) =>
  restaurant?.id ??
  restaurant?.restauranteID ??
  restaurant?.restauranteId ??
  restaurant?.restaurantId ??
  fallback;

const getRelatedRestaurantId = (item) =>
  item?.restaurantId ??
  item?.restauranteId ??
  item?.restauranteID ??
  item?.restaurant_id;

const getOrderCustomerId = (order) =>
  order?.customerId ??
  order?.clienteID ??
  order?.clienteId ??
  order?.customer_id ??
  order?.cliente_id ??
  order?.customer?.id ??
  order?.cliente?.id;

function RestaurantDetail() {
  const { id } = useParams();
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
        let restaurantData = null;
        try {
          restaurantData = await getRestaurant(id);
        } catch (err) {
          const listData = await getRestaurants();
          const list = normalizeList(listData);
          restaurantData =
            list.find(
              (item) =>
                String(item?.id ?? item?.restaurantId) === String(id)
            ) || null;
        }

        const [dishesData, ordersData, customersData] = await Promise.all([
          getDishes(),
          getOrders(),
          getCustomers(),
        ]);

        if (!isMounted) return;
        const restaurantIdValue = getRestaurantId(restaurantData, id);
        const allDishes = normalizeList(dishesData);
        const allOrders = normalizeList(ordersData);
        const allCustomers = normalizeList(customersData);

        const filteredDishes = restaurantIdValue
          ? allDishes.filter(
              (dish) =>
                String(getRelatedRestaurantId(dish)) ===
                String(restaurantIdValue)
            )
          : [];

        const filteredOrders = restaurantIdValue
          ? allOrders.filter(
              (order) =>
                String(getRelatedRestaurantId(order)) ===
                String(restaurantIdValue)
            )
          : [];

        const customersById = new Map(
          allCustomers.map((customer) => [String(customer?.id), customer])
        );
        const customerMap = new Map();

        filteredOrders.forEach((order) => {
          const orderCustomer = order?.customer || order?.cliente;
          if (orderCustomer?.id) {
            customerMap.set(String(orderCustomer.id), orderCustomer);
          }
          const customerId = getOrderCustomerId(order);
          if (customerId !== undefined) {
            const fromList = customersById.get(String(customerId));
            if (fromList) customerMap.set(String(customerId), fromList);
          }
        });

        setRestaurant(restaurantData);
        setDishes(filteredDishes);
        setOrders(filteredOrders);
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
      <header className="page__header">
        <div className="page__nav">
          <Link to="/">Volver</Link>
        </div>
        <h1>{loading ? "Cargando..." : getRestaurantName(restaurant)}</h1>
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
            <span>{restaurant.id ?? id}</span>
          </div>
          {restaurant.address && (
            <div className="card__row">
              <span className="card__label">Dirección</span>
              <span>{restaurant.address}</span>
            </div>
          )}
          {restaurant.direccion && (
            <div className="card__row">
              <span className="card__label">Dirección</span>
              <span>{restaurant.direccion}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="card__row">
              <span className="card__label">Teléfono</span>
              <span>{restaurant.phone}</span>
            </div>
          )}
          {restaurant.telefono && (
            <div className="card__row">
              <span className="card__label">Teléfono</span>
              <span>{restaurant.telefono}</span>
            </div>
          )}
          {restaurant.cuisine && (
            <div className="card__row">
              <span className="card__label">Tipo</span>
              <span>{restaurant.cuisine}</span>
            </div>
          )}
          {restaurant.tipo && (
            <div className="card__row">
              <span className="card__label">Tipo</span>
              <span>{restaurant.tipo}</span>
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

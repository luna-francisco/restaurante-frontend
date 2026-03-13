import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

const getOrderLabel = (order, index) =>
  order?.code ||
  order?.codigo ||
  order?.reference ||
  `Pedido ${order?.id ?? index + 1}`;

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

function OrderList({ items, loading: loadingProp, error: errorProp }) {
  const [orders, setOrders] = useState(items ?? []);
  const [loading, setLoading] = useState(items ? false : true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items !== undefined) {
      setOrders(items);
      setLoading(false);
      setError("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    getOrders()
      .then((data) => {
        if (!isMounted) return;
        setOrders(normalizeList(data));
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "No se pudieron cargar los pedidos.");
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

  if (isLoading) return <p className="state">Cargando pedidos...</p>;
  if (messageError) return <p className="state state--error">{messageError}</p>;
  if (!orders?.length) return <p className="state">No hay pedidos.</p>;

  return (
    <div className="grid grid--compact">
      {orders.map((order, index) => (
        <article
          key={order?.id ?? order?.pedidoID ?? index}
          className="card"
        >
          <h3>{getOrderLabel(order, index)}</h3>
          {order?.date && <p>Fecha: {order.date}</p>}
          {order?.fecha && <p>Fecha: {order.fecha}</p>}
          {order?.status && <p>Estado: {order.status}</p>}
          {order?.estado && <p>Estado: {order.estado}</p>}
          {order?.total && <p>Total: {order.total}</p>}
          {order?.monto && <p>Total: {order.monto}</p>}
        </article>
      ))}
    </div>
  );
}

export default OrderList;

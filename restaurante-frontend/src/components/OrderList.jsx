import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

const getOrderLabel = (order, index) =>
  order?.code ||
  order?.codigo ||
  order?.reference ||
  `Pedido ${order?.id ?? index + 1}`;

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

const parseLocalDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const raw = String(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const date = parseLocalDate(value);
  if (!date) return value;
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
    <div className="card table-card">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Restaurante</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order?.id ?? order?.pedidoID ?? index}>
                <td>{order?.id ?? order?.pedidoID ?? "-"}</td>
                <td>{order?.customerId ?? order?.clienteID ?? "-"}</td>
                <td>
                  {order?.restaurantId ??
                    order?.restauranteID ??
                    "-"}
                </td>
                <td>
                  {(order?.date ?? order?.fecha)
                    ? formatDate(order?.date ?? order?.fecha)
                    : "-"}
                </td>
                <td>{order?.status ?? order?.estado ?? "-"}</td>
                <td>{order?.total ?? order?.monto ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;

import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

const getOrderLabel = (order, index) =>
  `Pedido ${order?.pedidoID ?? index + 1}`;

const getCustomerName = (customer) => {
  if (!customer) return "";
  const fullName = [customer.nombre, customer.apellido1, customer.apellido2]
    .filter(Boolean)
    .join(" ");
  return fullName || `Cliente ${customer?.clienteID ?? ""}`.trim();
};

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
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order?.pedidoID ?? index}>
              <td>{getOrderLabel(order, index)}</td>
              <td>{order?.fecha || "—"}</td>
              <td>
                {order?.customer
                  ? getCustomerName(order.customer)
                  : order?.clienteID
                  ? `Cliente ${order.clienteID}`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;

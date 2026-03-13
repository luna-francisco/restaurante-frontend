import { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

const getCustomerName = (customer, index) => {
  const fullName = [customer?.nombre, customer?.apellido1, customer?.apellido2]
    .filter(Boolean)
    .join(" ");
  return fullName || `Cliente ${customer?.clienteID ?? index + 1}`;
};

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

function CustomerList({ items, loading: loadingProp, error: errorProp }) {
  const [customers, setCustomers] = useState(items ?? []);
  const [loading, setLoading] = useState(items ? false : true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items !== undefined) {
      setCustomers(items);
      setLoading(false);
      setError("");
      return;
    }

    let isMounted = true;
    setLoading(true);
    getCustomers()
      .then((data) => {
        if (!isMounted) return;
        setCustomers(normalizeList(data));
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "No se pudieron cargar los clientes.");
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

  if (isLoading) return <p className="state">Cargando clientes...</p>;
  if (messageError)
    return <p className="state state--error">{messageError}</p>;
  if (!customers?.length) return <p className="state">No hay clientes.</p>;

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Sexo</th>
            <th>Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer?.clienteID ?? index}>
              <td>{getCustomerName(customer, index)}</td>
              <td>{customer?.sexo || "—"}</td>
              <td>{customer?.poblacion || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;

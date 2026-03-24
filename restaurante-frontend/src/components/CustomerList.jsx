import { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

const getCustomerName = (customer, index) =>
  customer?.name ||
  customer?.nombre ||
  customer?.fullName ||
  `Cliente ${customer?.id ?? index + 1}`;

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
    <div className="card table-card">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido 1</th>
              <th>Apellido 2</th>
              <th>Sexo</th>
              <th>Población</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer?.id ?? customer?.clienteID ?? index}
              >
                <td>{customer?.id ?? customer?.clienteID ?? "-"}</td>
                <td>{customer?.nombre ?? customer?.name ?? "-"}</td>
                <td>{customer?.apellido1 ?? "-"}</td>
                <td>{customer?.apellido2 ?? "-"}</td>
                <td>{customer?.sexo ?? "-"}</td>
                <td>{customer?.poblacion ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerList;

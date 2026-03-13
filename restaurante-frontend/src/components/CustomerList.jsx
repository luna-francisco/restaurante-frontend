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
    <div className="grid grid--compact">
      {customers.map((customer, index) => (
        <article
          key={customer?.id ?? customer?.clienteID ?? index}
          className="card"
        >
          <h3>{getCustomerName(customer, index)}</h3>
          {customer?.email && <p>{customer.email}</p>}
          {customer?.correo && <p>{customer.correo}</p>}
          {customer?.phone && <p>{customer.phone}</p>}
          {customer?.telefono && <p>{customer.telefono}</p>}
        </article>
      ))}
    </div>
  );
}

export default CustomerList;

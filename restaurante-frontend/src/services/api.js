const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const buildUrl = (path) => {
  if (!path.startsWith("/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}${path}`;
};

const normalizeList = (data) =>
  Array.isArray(data) ? data : data?.data ? data.data : [];

const normalizeBarrio = (barrio) => {
  if (!barrio) return barrio;
  if (typeof barrio === "string" && barrio.toLowerCase() === "torrero") {
    return "Torrero";
  }
  return barrio;
};

const normalizeRestaurant = (restaurant = {}) => {
  const id =
    restaurant.id ??
    restaurant.restauranteID ??
    restaurant.restauranteId ??
    restaurant.restaurantId;
  const name =
    restaurant.name ??
    restaurant.nombre ??
    restaurant.restaurante ??
    restaurant.title;
  const address =
    restaurant.address ??
    restaurant.direccion ??
    normalizeBarrio(restaurant.barrio);
  return {
    ...restaurant,
    id,
    name,
    address,
    barrio: normalizeBarrio(restaurant.barrio),
  };
};

const normalizeDish = (dish = {}) => {
  const id = dish.id ?? dish.platoID ?? dish.platoId;
  const name = dish.name ?? dish.nombre ?? dish.plato ?? dish.title;
  const price = dish.price ?? dish.precio;
  const restaurantId =
    dish.restaurantId ?? dish.restauranteId ?? dish.restauranteID;
  return {
    ...dish,
    id,
    name,
    price,
    restaurantId,
  };
};

const normalizeCustomer = (customer = {}) => {
  const id = customer.id ?? customer.clienteID ?? customer.clienteId;
  const fullName =
    customer.fullName ??
    [customer.nombre, customer.apellido1, customer.apellido2]
      .filter(Boolean)
      .join(" ");
  const name = customer.name ?? customer.nombre ?? fullName;
  return {
    ...customer,
    id,
    name,
    fullName,
  };
};

const normalizeOrder = (order = {}) => {
  const id = order.id ?? order.pedidoID ?? order.pedidoId;
  const customerId = order.customerId ?? order.clienteID ?? order.clienteId;
  const restaurantId =
    order.restaurantId ?? order.restauranteID ?? order.restauranteId;
  const date = order.date ?? order.fecha;
  return {
    ...order,
    id,
    customerId,
    restaurantId,
    date,
  };
};

const parseErrorMessage = async (response) => {
  try {
    const data = await response.json();
    if (data?.message) return data.message;
    if (typeof data === "string") return data;
  } catch (error) {
    // Ignore JSON parsing failures.
  }
  return "";
};

const fetchJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const details = await parseErrorMessage(response);
    const suffix = details ? `: ${details}` : "";
    throw new Error(`${response.status} ${response.statusText}${suffix}`);
  }

  return response.json();
};

export const getRestaurants = async () => {
  const data = await fetchJson("/restaurants");
  return normalizeList(data).map(normalizeRestaurant);
};
export const getRestaurant = async (id) => {
  const data = await fetchJson(`/restaurants/${id}`);
  return normalizeRestaurant(data);
};
export const getDishes = async () => {
  const data = await fetchJson("/dishes");
  return normalizeList(data).map(normalizeDish);
};
export const getOrders = async () => {
  const data = await fetchJson("/orders");
  return normalizeList(data).map(normalizeOrder);
};
export const getCustomers = async () => {
  const data = await fetchJson("/customers");
  return normalizeList(data).map(normalizeCustomer);
};

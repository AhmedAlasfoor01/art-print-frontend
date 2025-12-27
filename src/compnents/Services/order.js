

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/Order`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getAllOrders = async () => {
  const res = await fetch(BASE_URL, {
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || "Failed to fetch orders");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

// ✅ backend: POST /Order/:productId with JSON { Quantity, Status }
const createOrder = async (productId, orderData) => {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || "Failed to create order");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

export { getAllOrders, createOrder };

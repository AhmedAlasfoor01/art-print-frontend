

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/Order`;

const getAllOrders = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch orders");
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

// ✅ backend: POST /Order/:productId
// usage: createOrder(productId, { Quantity: 1, Status: true })
const createOrder = async (productId, OrderData) => {
  try {
    if (!productId) {
      throw new Error("productId is required (POST /Order/:productId)");
    }

    const res = await fetch(`${BASE_URL}/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(OrderData), // { Quantity, Status }
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create order");
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};


const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("orderId is required (GET /Order/:orderId)");
    }

    const res = await fetch(`${BASE_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch order");
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching order:", err);
    throw err;
  }
};

export { getAllOrders, createOrder, getOrderById };



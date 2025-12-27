
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/product`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getAllProducts = async () => {
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
      throw new Error(data.error || data.message || "Failed to fetch products");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

const createProduct = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      ...authHeader(),
      Accept: "application/json",
      
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || "Failed to create Product");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

const updateProduct = async (productId, formData) => {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || "Failed to update Product");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

const deleteProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || "Failed to delete Product");
    } catch {
      throw new Error(text || `Server error: ${res.status} ${res.statusText}`);
    }
  }

  return await res.json();
};

export { getAllProducts, createProduct, updateProduct, deleteProduct };

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/Products`;

const getAllProducts = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch Products');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching Products:', err);
    throw err;
  }
};

const createProduct = async (ProductData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ProductData)
    });

    if (!res.ok) {
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create Product');
      } else {
        // If not JSON, it might be HTML error page
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error creating Product:', err);
    throw err;
  }
};
const updateProduct = async (ProductId, ProductData) => {
  try {
    const res = await fetch(`${BASE_URL}/${ProductId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ProductData)
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update Product');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error updating Product:', err);
    throw err;
  }
};
const deleteProduct = async (ProductId) => {
  try {
    const res = await fetch(`${BASE_URL}/${ProductId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete Product');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    // DELETE requests may return 204 No Content with no body
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return { success: true };
    }

    return await res.json();
  } catch (err) {
    console.error('Error deleting Product:', err);
    throw err;
  }
};

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
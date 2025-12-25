const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/Orders`;

const getAllOrders = async () => {
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
        throw new Error(errData.message || 'Failed to fetch Orders');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching Orders:', err);
    throw err;
  }
};

const createOrder = async (OrderData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(OrderData)
    });

    if (!res.ok) {
      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create Order');
      } else {
        // If not JSON, it might be HTML error page
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error creating Order:', err);
    throw err;
  }
};
const updateOrder = async (OrderId, OrderData) => {
  try {
    const res = await fetch(`${BASE_URL}/${OrderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(OrderData)
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update Order');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    return await res.json();
  } catch (err) {
    console.error('Error updating Order:', err);
    throw err;
  }
};
const deleteOrder = async (OrderId) => {
  try {
    const res = await fetch(`${BASE_URL}/${OrderId}`, {
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
        throw new Error(errData.message || 'Failed to delete Order');
      } else {
        const text = await res.text();
        console.error('Received non-JSON response:', text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }
    }

    // DELETE requests may return 204 No Content with no body
    if (res.status === 204) {
      return { success: true };
    }

    // Check if response has content before parsing
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error deleting Order:', err);
    throw err;
  }
};

export {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
};
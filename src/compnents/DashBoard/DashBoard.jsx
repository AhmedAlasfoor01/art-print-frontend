import { useState, useEffect } from 'react';

const DashBoard = () => {
  // useState creates a state variable to store our orders
  // The empty array [] is the initial value
  const [orders, setOrders] = useState([]);

  // Another state to track if we're loading data
  const [loading, setLoading] = useState(true);

  // useEffect runs when the component first loads
  // The empty array [] means it only runs once (on mount)
  useEffect(() => {
    // Simulate fetching data (like from an API)
    // In a real app, you would fetch from your backend here
    
    // Sample order data for art prints
    const sampleOrders = [
      {
        id: 1,
        orderNumber: 'PRINT-001',
        date: 'January 15, 2024',
        total: 89.97,
        items: 'Abstract Landscape Print (2x)',
        status: 'pending' // can be: pending, processing, shipped, completed
      },
      {
        id: 2,
        orderNumber: 'PRINT-002',
        date: 'January 10, 2024',
        total: 49.99,
        items: 'Modern Cityscape Art Print',
        status: 'processing'
      },
      {
        id: 3,
        orderNumber: 'PRINT-003',
        date: 'January 5, 2024',
        total: 149.97,
        items: 'Nature Photography Collection (3x)',
        status: 'completed'
      }
    ];

    // Simulate a delay (like waiting for an API response)
    setTimeout(() => {
      setOrders(sampleOrders); // Update the orders state
      setLoading(false); // Stop showing loading
    }, 500);
  }, []); // Empty array = run only once when component loads

  // Helper function to get status color based on order status
  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'processing') return 'bg-blue-100 text-blue-800';
    if (status === 'shipped') return 'bg-purple-100 text-purple-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Show loading message while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading orders...</p>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Your Art Print Orders</h1>
          <p className="text-slate-600 mt-2">Track your orders from The Print Gallery</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          // If no orders, show this message
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-600">You don't have any art print orders yet.</p>
            <p className="text-slate-500 text-sm mt-2">Start shopping to see your orders here!</p>
          </div>
        ) : (
          // If we have orders, show them in a list
          <div className="space-y-4">
            {/* .map() loops through each order and creates a card for it */}
            {orders.map((order) => (
              <div
                key={order.id} // React needs a unique key for each item in a list
                className="bg-white rounded-lg shadow border border-slate-200 p-6"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{order.date}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Art Print Items */}
                <div className="mb-4">
                  <p className="text-slate-700">{order.items}</p>
                </div>

                {/* Order Total */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-lg font-bold text-slate-900">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;

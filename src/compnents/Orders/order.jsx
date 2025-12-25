import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { UserContext } from '../contexts/Contexts';
import { createOrder } from '../Services/order';
import { getAllProducts } from '../Services/product';

const Order = () => {
  // Get the current user from context (we need this to create the order)
  const { user } = useContext(UserContext);
  
  // allows us to redirect to other pages
  const navigate = useNavigate();
  
 
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId'); // Get product ID from URL
  
  // State to store the product we're ordering
  const [product, setProduct] = useState(null);
  
  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // State for order form (quantity the user wants to order)
  const [orderQuantity, setOrderQuantity] = useState(1);

  // useEffect runs when component loads or when productId changes
  // This fetches the product details from the API
  useEffect(() => {
    // If no productId in url, redirect back to products page
    if (!productId) {
      navigate('/products');
      return;
    }

    // Function to fetch product details
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Get all products and find the one we need
        const products = await getAllProducts();
        const foundProduct = products.find(p => p._id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // handles checkout - this creates the order
  const handleCheckout = async (e) => {
    e.preventDefault(); // prevent form from refreshing page
    
    // Check if user is logged in
    if (!user) {
      setError('Please sign in to place an order');
      navigate('/sign-in');
      return;
    }

    // check if quantity is valid
    if (orderQuantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate total price
      const totalPrice = product.price * orderQuantity;

      // Prepare order data to send to the backend
      const orderData = {
        product: productId, 
        quantity: orderQuantity, 
        totalPrice: totalPrice, 
        status: 'pending' 
      };

      // Create the order using the service function
      await createOrder(orderData);
      
      // Show success message
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000);
      
    } catch (err) {
      // If something goes wrong, show error message
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If still loading product, show loading message
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // If product not found, show error
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Get product image (use first image if available)
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/400x400?text=No+Image';
  
  const productName = product.ProductName || product.name || 'Untitled';
  const productPrice = product.price || 0;
  const productCurrency = product.currency || 'BHD';
  const totalPrice = productPrice * orderQuantity;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order for {productName}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Order placed successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Product Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Product Details</h2>
            
            {/* Product Image */}
            <div className="mb-4">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            </div>

            {/* Product Name */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{productName}</h3>
            
            {/* Product Description */}
            {product.description && (
              <p className="text-slate-600 mb-4">{product.description}</p>
            )}

            {/* Price Display */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Price per item:</span>
                <span className="font-semibold text-slate-900">
                  {productPrice} {productCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Order Form */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order Information</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold"
                    disabled={orderQuantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border border-slate-300 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="text-slate-900">
                    {productPrice} {productCurrency} × {orderQuantity}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-blue-600">
                    {totalPrice} {productCurrency}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : success ? 'Order Placed!' : 'Place Order'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Back to Products
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

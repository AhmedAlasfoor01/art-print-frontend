import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { UserContext } from '../contexts/Contexts';
import { createOrder } from '../Services/order';
import { getAllProducts } from '../Services/product';

const Order = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      navigate('/products');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const products = await getAllProducts();
        const foundProduct = products.find(p => p._id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
          // If product has limited stock, keep quantity within stock
          const maxQty = Number(foundProduct.Quantity ?? foundProduct.quantity ?? 0);
          if (maxQty > 0) setOrderQuantity(1);
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

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please sign in to place an order');
      navigate('/sign-in');
      return;
    }

    const qty = Number(orderQuantity);
    if (!qty || qty < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    // Check stock if available in product
    const stock = Number(product?.Quantity ?? product?.quantity ?? 0);
    if (stock && qty > stock) {
      setError(`Not enough stock. Available: ${stock}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Backend expects { Quantity, Status } and productId in URL
      const orderData = {
        Quantity: qty,
        Status: 'pending', // can be string; backend only checks it's not undefined
      };

      await createOrder(productId, orderData);

      setSuccess(true);

      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  // ✅ Product image handling (your model: image.url and images[].url)
  const productImage =
    (product?.image?.url) ||
    (product?.images?.length > 0 ? product.images[0]?.url : null) ||
    'https://via.placeholder.com/400x400?text=No+Image';

  const productName = product.ProductName || product.name || 'Untitled';

  // ✅ Your model uses Price (capital P)
  const productPrice = Number(product.Price ?? product.price ?? 0);

  // Your model doesn't have currency in schema; use constant or fallback
  const productCurrency = product.currency || 'BHD';

  const totalPrice = productPrice * Number(orderQuantity || 1);

  const stock = Number(product?.Quantity ?? product?.quantity ?? 0);

  return (
    <div className="container" style={{ minHeight: '100vh', maxWidth: '900px' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
        <p className="text-slate-600">Complete your order for {productName}</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Order placed successfully! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Product Details</h2>

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

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{productName}</h3>

          {product.description && (
            <p className="text-slate-600 mb-4">{product.description}</p>
          )}

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Price per item:</span>
              <span className="font-semibold text-slate-900">
                {productPrice} {productCurrency}
              </span>
            </div>

            {Number.isFinite(stock) && stock > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">In stock:</span>
                <span className="font-semibold text-slate-900">{stock}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Order Information</h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOrderQuantity(Math.max(1, Number(orderQuantity) - 1))}
                  className="btn"
                  style={{ width: '40px', height: '40px', padding: 0 }}
                  disabled={Number(orderQuantity) <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  min="1"
                  max={stock > 0 ? stock : undefined}
                  value={orderQuantity}
                  onChange={(e) => {
                    const v = Math.max(1, parseInt(e.target.value, 10) || 1);
                    if (stock > 0) setOrderQuantity(Math.min(v, stock));
                    else setOrderQuantity(v);
                  }}
                  className="input"
                  style={{ width: '80px', textAlign: 'center' }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = Number(orderQuantity) + 1;
                    if (stock > 0) setOrderQuantity(Math.min(next, stock));
                    else setOrderQuantity(next);
                  }}
                  className="btn"
                  style={{ width: '40px', height: '40px', padding: 0 }}
                  disabled={stock > 0 ? Number(orderQuantity) >= stock : false}
                >
                  +
                </button>
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading || success}
              className="btn btnPrimary"
              style={{
                width: '100%',
                opacity: (loading || success) ? 0.5 : 1,
                cursor: (loading || success) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : success ? 'Order Placed!' : 'Place Order'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn"
              style={{ width: '100%' }}
            >
              Back to Products
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;


import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { UserContext } from "../contexts/Contexts";
import { createOrder } from "../Services/order";
import { getAllProducts } from "../Services/product";

const Order = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      navigate("/products");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const products = await getAllProducts();
        const found = products.find((p) => p._id === productId);
        if (!found) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(found);
          setOrderQuantity(1);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please sign in to place an order");
      navigate("/sign-in");
      return;
    }

    const qty = Number(orderQuantity);
    if (!qty || qty < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    // Stock check
    const stock = Number(product?.Quantity ?? 0);
    if (stock && qty > stock) {
      setError(`Not enough stock. Available: ${stock}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      await createOrder(productId, {
        Quantity: qty,
        Status: 0, // pending
      });

      setSuccess(true);
      setTimeout(() => navigate("/Dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <button onClick={() => navigate("/products")} className="btn btnPrimary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImage =
    product?.image?.url ||
    (product?.images?.length > 0 ? product.images[0]?.url : null) ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const productName = product.ProductName || "Untitled";
  const productPrice = Number(product.Price ?? 0);
  const total = productPrice * Number(orderQuantity || 1);

  return (
    <div className="container" style={{ minHeight: "100vh", maxWidth: "900px" }}>
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {success && <div className="bg-green-50 border p-3 rounded mb-4">Order placed successfully!</div>}
      {error && <div className="bg-red-50 border p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded border p-6">
          <img src={productImage} alt={productName} className="w-full h-64 object-cover rounded mb-4" />
          <h2 className="text-xl font-bold">{productName}</h2>
          <p className="mt-2 font-semibold">{productPrice} BHD</p>
          <p className="text-sm text-slate-600 mt-1">Stock: {product.Quantity}</p>
        </div>

        <div className="bg-white rounded border p-6">
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.Quantity}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="input"
                style={{ width: "100%" }}
              />
            </div>

            <div className="border-t pt-4">
              <p className="font-bold">Total: {total} BHD</p>
            </div>

            <button type="submit" disabled={loading || success} className="btn btnPrimary" style={{ width: "100%" }}>
              {loading ? "Processing..." : "Place Order"}
            </button>

            <button type="button" onClick={() => navigate("/products")} className="btn" style={{ width: "100%" }}>
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;

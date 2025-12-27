import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../contexts/Contexts";
import { getAllProducts, deleteProduct, createProduct, updateProduct } from "../Services/product";

const Product = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [product, setproduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

 
  const [newProduct, setNewProduct] = useState({
    ProductName: "",
    Category: "Art",
    Price: "",
    Size: 1,
    Quantity: "",
  });

  const [editId, setEditId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);


 

  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    getAllProducts()
      .then((data) => setproduct(data))
      .catch(() => setError("Failed to fetch products"))
      .finally(() => setLoading(false));
  }, [user]);

  


const handleInputChange = (e) => {
  const { name, value } = e.target;

  setNewProduct((prev) => ({
    ...prev,
    [name]:
      name === "Price" || name === "Size" || name === "Quantity"
        ? value === ""
          ? ""
          : Number(value)
        : value,
  }));
};


const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageFile(file);

  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result);
  reader.readAsDataURL(file);
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user?._id) return;

  
  if (!editId && !imageFile) {
    setError("Please select an image from your device");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("ProductName", newProduct.ProductName);
  formData.append("Category", newProduct.Category);
  formData.append("Price", newProduct.Price);
  formData.append("Size", newProduct.Size);
  formData.append("Quantity", newProduct.Quantity);

  
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    let saved;

    if (editId) {
      saved = await updateProduct(editId, formData);
      setproduct((prev) => prev.map((p) => (p._id === editId ? saved : p)));
      setEditId(null);
    } else {
      saved = await createProduct(formData);
      setproduct((prev) => [...prev, saved]);
    }

    setSelectedProductId(saved._id);

    
    setNewProduct({
      ProductName: "",
      Category: "Art",
      Price: "",
      Size: 1,
      Quantity: "",
    });
    setImageFile(null);
    setImagePreview(null);
  } catch (err) {
    setError(err.message || "Failed to save Product");
  } finally {
    setLoading(false);
  }
};

const handleEdit = (p) => {
  setNewProduct({
    ProductName: p.ProductName || "",
    Category: p.Category || "Art",
    Price: p.Price ?? "",
    Size: p.Size ?? 1,
    Quantity: p.Quantity ?? "",
  });

  setEditId(p._id);

  
  const currentUrl =
    p?.image?.url || (p?.images?.length > 0 ? p.images[0]?.url : null);

  setImagePreview(currentUrl);
  setImageFile(null); 
};

const handleCancel = () => {
  setEditId(null);
  setNewProduct({
    ProductName: "",
    Category: "Art",
    Price: "",
    Size: 1,
    Quantity: "",
  });
  setImageFile(null);
  setImagePreview(null);
};

const getMainImageUrl = (p) => {
  return (
    p?.image?.url ||
    (p?.images?.length > 0 ? p.images[0]?.url : null) ||
    "https://via.placeholder.com/400x400?text=No+Image"
  );
};

  return (
    <div className="container" style={{ minHeight: "100vh", paddingTop: "24px" }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Art Gallery</h1>
        <p className="text-slate-600">Manage your art collection</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editId ? "Edit Product" : "Create Product"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input
                    name="ProductName"
                    value={newProduct.ProductName}
                    onChange={handleInputChange}
                    required
                    className="input"
                    style={{ width: "100%" }}
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    name="Category"
                    value={newProduct.Category}
                    onChange={handleInputChange}
                    required
                    className="input"
                    style={{ width: "100%" }}
                    placeholder="Art"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="Price"
                      value={newProduct.Price}
                      onChange={handleInputChange}
                      required
                      className="input"
                      style={{ width: "100%" }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                    <input
                      type="number"
                      name="Size"
                      value={newProduct.Size}
                      onChange={handleInputChange}
                      required
                      className="input"
                      style={{ width: "100%" }}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="Quantity"
                    value={newProduct.Quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="input"
                    style={{ width: "100%" }}
                  />
                </div>

                
                <div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Image File {!editId && <span className="text-red-500">*</span>}
  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editId}
                    className="input"
                    style={{ width: "100%", padding: "8px" }}
                  />

                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "180px",     
                          objectFit: "cover",     
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                </div>


                <div className="cardActions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btnPrimary"
                    style={{ flex: 1, opacity: loading ? 0.5 : 1 }}
                  >
                    {loading ? "Saving..." : editId ? "Update" : "Create"}
                  </button>

                  {editId && (
                    <button type="button" onClick={handleCancel} className="btn" style={{ flex: 1 }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Products</h3>

            {loading && !editId && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-slate-500">Loading...</p>
              </div>
            )}

            {!loading && product.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No products yet!</p>
              </div>
            )}

            {!loading && product.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.map((p) => {
                  const mainImageUrl = getMainImageUrl(p);
                  const productName = p.ProductName || "Untitled";

                  return (
                    <div
                      key={p._id}
                      className={`group border rounded-lg overflow-hidden transition-all cursor-pointer bg-white shadow-sm hover:shadow-lg ${
                        selectedProductId === p._id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedProductId(p._id)}
                    >
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={mainImageUrl}
                          alt={productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{productName}</h4>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-slate-900">{p.Price} BHD</span>
                        </div>

                        <div className="mb-3">
                          <span className="text-sm text-slate-600">
                            Quantity: <span className="font-semibold text-slate-900">{p.Quantity}</span>
                          </span>
                        </div>

                        <div className="cardActions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orders?productId=${p._id}`);
                            }}
                            className="btn btnPrimary"
                            style={{ flex: 1, background: "#16a34a", borderColor: "#16a34a" }}
                          >
                            Buy Now
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(p);
                            }}
                            disabled={loading}
                            className="btn"
                            style={{ flex: 1, opacity: loading ? 0.5 : 1 }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p._id);
                            }}
                            disabled={loading}
                            className="btn"
                            style={{ flex: 1, color: "#dc2626", opacity: loading ? 0.5 : 1 }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

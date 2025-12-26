import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/Contexts';
import { getAllProducts,deleteProduct,createProduct,updateProduct} from '../Services/product';
const Product = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Hook to navigate to other pages

  const [product, setproduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
const [newProduct, setNewProduct] = useState({
  ProductName: "",
  Category: "",
  Price: "",
  Size: "",
  Quantity: "",
});

  const [editId, setEditId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);

    getAllProducts()
      .then(data => setproduct(data))
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    if (!user?._id) return;
  
    if (!editId && !imageFile) {
      setError('Please select an image file');
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


formData.append("userId", user._id);

if (imageFile) {
  formData.append("image", imageFile);
}          

    
  
   
    
    try {
      let saved;
      if (editId) {
        saved = await updateProduct(editId, formData);
        setproduct(product.map(b => (b._id === editId ? saved : b)));
        setEditId(null);
      } else {
        saved = await createProduct(formData);
        setproduct([...product, saved]);
      }
      setSelectedProductId(saved._id);
      setNewProduct({
          ProductName: "",
          Category: "",
          Price: "",
          Size: "",
          Quantity: "",
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to save Product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (Product) => {
    setNewProduct({
      ProductName: Product.ProductName || Product.name || '',
      description: Product.description || '',
      Price: Product.Price || '',
      currency: Product.currency || 'BHD',
      quantity: Product.quantity || '',
    });
    setEditId(Product._id);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (ProductId) => {
    if (!window.confirm('Are you sure you want to delete this Product?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(ProductId);
      setproduct(product.filter(b => b._id !== ProductId));
      if (selectedProductId === ProductId) {
        setSelectedProductId(null);
      }
    } catch {
      setError('Failed to delete Product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setNewProduct({
      ProductName: '',
  description: '',
  Category: 'Art',  
  Size: 1,           
  Price: '',
  currency: 'BHD',
  quantity: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      // Store the actual File object 
      setImageFile(file);
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
      
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '24px' }}>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Art Gallery</h1>
          <p className="text-slate-600">Manage your art collection and prints</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {editId ? 'Edit Product' : 'Create Product'}
              </h3>
              
             
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Artwork Title
                    </label>
                    <input 
                      name='ProductName'  
                      value={newProduct.ProductName} 
                      onChange={handleInputChange} 
                      required
                      className="input"
                      style={{ width: '100%' }}
                      placeholder="Enter artwork title"
                    />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Artist Name
                  </label>
                  <input 
                    name='artist' 
                    value={newProduct.artist} 
                    onChange={handleInputChange}
                    className="input"
                    style={{ width: '100%' }}
                    placeholder="Artist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    name='description' 
                    value={newProduct.description} 
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    style={{ width: '100%', borderRadius: 'var(--radius)', resize: 'none' }}
                    placeholder="Describe the artwork..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price
                    </label>
                    <input 
                      type='number' 
                      name='Price' 
                      value={newProduct.Price} 
                      onChange={handleInputChange}
                      className="input"
                      style={{ width: '100%' }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Currency
                    </label>
                    <input 
                      name='currency' 
                      maxLength={3} 
                      value={newProduct.currency} 
                      onChange={handleInputChange} 
                      placeholder="BHD"
                      className="input"
                      style={{ width: '100%', textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input 
                    type='number' 
                    name='quantity' 
                    value={newProduct.quantity} 
                    onChange={handleInputChange}
                    min="0"
                    className="input"
                    style={{ width: '100%' }}
                    placeholder="Enter quantity"
                  />
                </div>

               
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Image File {!editId && <span className="text-red-500">*</span>}
                    </label>
                    <input 
                      type='file'           
                      accept='image/*'      
                      onChange={handleImageChange} 
                      required={!editId}    
                      className="input"
                      style={{ width: '100%', padding: '8px' }}
                    />
                    
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-slate-200" 
                        />
                      </div>
                    )}
                   
                    {editId && !imagePreview && (
                      <p className="text-xs text-slate-500 mt-1">
                        Leave empty to keep current image, or select a new image to replace it
                      </p>
                    )}
                  </div>

                  <div className="cardActions">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="btn btnPrimary"
                      style={{ flex: 1, opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ? 'Saving...' : (editId ? 'Update' : 'Create')}
                    </button>
                    {editId && (
                      <button 
                        type="button"
                        onClick={handleCancel}
                        className="btn"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Art Collection</h3>
              
              {loading && !editId && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-slate-500">Loading artworks...</p>
                </div>
              )}

              {!loading && product.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No artworks yet!</p>
                  <p className="text-slate-400 text-sm mt-1">Add your first artwork to start building your gallery</p>
                </div>
              )}

              {!loading && product.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.map(Product => {
                    const productImages = Product.images || [];
                    const mainImage = productImages.length > 0 ? productImages[0] : null;
                    const productName = Product.ProductName || Product.name || 'Untitled';
                    
                    return (
                      <div 
                        key={Product._id}
                        className={`group border rounded-lg overflow-hidden transition-all cursor-pointer bg-white shadow-sm hover:shadow-lg ${
                          selectedProductId === Product._id 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedProductId(Product._id)}
                      >
                        {/* Image Section */}
                        <div className="relative aspect-square bg-slate-100 overflow-hidden">
                          {mainImage ? (
                            <img 
                              src={mainImage} 
                              alt={productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                              <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {productImages.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                              +{productImages.length - 1} more
                            </div>
                          )}
                          {selectedProductId === Product._id && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Selected
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{productName}</h4>
                          {Product.artist && (
                            <p className="text-sm text-slate-600 mb-2">By {Product.artist}</p>
                          )}
                          {Product.description && (
                            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{Product.description}</p>
                          )}
                          
                          {Product.Price && (
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-slate-900">
                                {Product.Price} {Product.currency || 'BHD'}
                              </span>
                            </div>
                          )}

                          {Product.quantity !== undefined && Product.quantity !== '' && (
                            <div className="mb-3">
                              <span className="text-sm text-slate-600">
                                Quantity: <span className="font-semibold text-slate-900">{Product.quantity}</span>
                              </span>
                            </div>
                          )}

                          <div className="cardActions">
                            
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                
                                navigate(`/orders?productId=${Product._id}`);
                              }} 
                              className="btn btnPrimary"
                              style={{ flex: 1, background: '#16a34a', borderColor: '#16a34a' }}
                            >
                              Buy Now
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(Product); }} 
                              disabled={loading}
                              className="btn"
                              style={{ flex: 1, opacity: loading ? 0.5 : 1 }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(Product._id); }} 
                              disabled={loading}
                              className="btn"
                              style={{ flex: 1, color: '#dc2626', opacity: loading ? 0.5 : 1 }}
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

            {selectedProductId && product.find(p => p._id === selectedProductId) && (() => {
              const selectedProduct = product.find(p => p._id === selectedProductId);
              const productImages = selectedProduct.images || [];
              const productName = selectedProduct.ProductName || selectedProduct.name || 'Untitled';
              
              return (
                <div className="bg-white rounded-lg border border-slate-200 p-6 mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Artwork Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Gallery */}
                    <div>
                      {productImages.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
                            <img 
                              src={productImages[0]} 
                              alt={productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                              }}
                            />
                          </div>
                          {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                              {productImages.slice(1, 5).map((img, idx) => (
                                <div key={idx} className="relative aspect-square bg-slate-100 rounded overflow-hidden">
                                  <img 
                                    src={img} 
                                    alt={`${productName} ${idx + 2}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                          <svg className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">{productName}</h4>
                        {selectedProduct.artist && (
                          <p className="text-lg text-slate-600 mb-4">By {selectedProduct.artist}</p>
                        )}
                      </div>

                      {selectedProduct.description && (
                        <div>
                          <h5 className="font-semibold text-slate-900 mb-2">Description</h5>
                          <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        {selectedProduct.Price && (
                          <div>
                            <h5 className="text-sm font-semibold text-slate-500 mb-1">Price</h5>
                            <p className="text-xl font-bold text-slate-900">
                              {selectedProduct.Price} {selectedProduct.currency || 'BHD'}
                            </p>
                          </div>
                        )}
                        {selectedProduct.quantity !== undefined && selectedProduct.quantity !== '' && (
                          <div>
                            <h5 className="text-sm font-semibold text-slate-500 mb-1">Quantity</h5>
                            <p className="text-slate-900 text-lg font-semibold">{selectedProduct.quantity}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
    </div>
  );
}

export default Product;
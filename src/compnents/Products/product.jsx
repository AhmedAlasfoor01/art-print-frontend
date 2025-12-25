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
    ProductName: '',
    description: '',
    price: '',
    currency: 'BHD',
    images: [],
    quantity: '',
   
  });

  const [editId, setEditId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleSubmit = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    const payload = { ...newProduct, owner: user._id };
    try {
      let saved;
      if (editId) {
        saved = await updateProduct(editId, payload);
        setproduct(product.map(b => (b._id === editId ? saved : b)));
        setEditId(null);
      } else {
        saved = await createProduct(payload);
        setproduct([...product, saved]);
      }
      setSelectedProductId(saved._id);
      setNewProduct({
        ProductName: '',
        description: '',
        price: '',
        currency: 'BHD',
        images: [],
        quantity: '',
        
      
      });
      setImageUrl('');
    } catch {
      setError('Failed to save Product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (Product) => {
    setNewProduct({
      ProductName: Product.ProductName || Product.name || '',
      description: Product.description || '',
      price: Product.price || '',
      currency: Product.currency || 'BHD',
      images: Product.images || [],
      quantity: Product.quantity|| '',
     
    });
    setEditId(Product._id);
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
      price: '',
      currency: 'BHD',
      images: [],
      quantity: '',
     
    });
    setImageUrl('');
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
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
                      name='price' 
                      value={newProduct.price} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Image URLs
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type='url' 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter image URL"
                    />
                    <button 
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {newProduct.images.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {newProduct.images.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-10 h-10 object-cover rounded" />
                          <span className="flex-1 text-xs text-slate-600 truncate">{img}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {loading ? 'Saving...' : (editId ? 'Update' : 'Create')}
                  </button>
                  {editId && (
                    <button 
                      onClick={handleCancel}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
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
                          
                          {Product.price && (
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-slate-900">
                                {Product.price} {Product.currency || 'BHD'}
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

                          <div className="flex gap-2 pt-2 border-t border-slate-100">
                            {/* Buy Now Button - redirects to order page with product ID */}
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                // Navigate to order page with product ID in URL
                                navigate(`/orders?productId=${Product._id}`);
                              }} 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                              Buy Now
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(Product); }} 
                              disabled={loading}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(Product._id); }} 
                              disabled={loading}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
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
                        {selectedProduct.price && (
                          <div>
                            <h5 className="text-sm font-semibold text-slate-500 mb-1">Price</h5>
                            <p className="text-xl font-bold text-slate-900">
                              {selectedProduct.price} {selectedProduct.currency || 'BHD'}
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
    </div>
  );
}

export default Product;
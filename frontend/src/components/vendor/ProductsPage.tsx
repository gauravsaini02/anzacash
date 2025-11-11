import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  commission: number;
  status: string;
  date: string;
  location?: string;
  country?: string;
  images?: Array<{
    id: number;
    path: string;
  }>;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const vendorProducts = await productService.getVendorProducts();
      setProducts(vendorProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        loadProducts(); // Reload products after deletion
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:3000${product.images[0].path}`;
    }
    return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg";
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/vendor')}
              >
                ANZACASH
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/vendor')}
                >
                  Dashboard
                </span>
                <span className="text-primary font-medium cursor-pointer">Products</span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/orders')}
                >
                  Orders
                </span>
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/analytics')}
                >
                  Analytics
                </span>
              </nav>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your product listings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{products.length} products</span>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-box text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to your store</p>
            <button
              onClick={handleAddProduct}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 mx-auto"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => handleViewProduct(product.id)}>
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          {productService.formatPrice(product.price)} TZS
                        </p>
                        <p className="text-xs text-gray-500">Commission: {product.commission}%</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.category}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                      >
                        <i className="fa-solid fa-eye mr-1"></i>
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                      >
                        <i className="fa-solid fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
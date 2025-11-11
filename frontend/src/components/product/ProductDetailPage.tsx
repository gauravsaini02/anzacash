import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { safeRating, formatRating, formatRatingWithText, formatReviewText, createStarElements } from '../../utils/ratingUtils';

interface Seller {
  id: number;
  username: string;
  fullName: string;
  country: string;
  photo: string;
  businessName?: string;
  verificationStatus: string;
  rating: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  commission: number;
  location: string;
  country: string;
  date: string;
  image: string | null;
  seller: Seller;
}

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();

  // Local renderStars function using the utility helper
  const renderStars = (rating: any, className: string = "text-sm") => {
    const starElements = createStarElements(rating, className);
    return (
      <div className="flex text-yellow-400">
        {starElements.map((star) => (
          <i key={star.key} className={star.className}></i>
        ))}
      </div>
    );
  };
  const { productId } = useParams<{ productId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add Font Awesome script to the document
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    fontAwesomeScript.onload = () => {
      // Configure FontAwesome after loading
      if (window.FontAwesome) {
        window.FontAwesome.config = { autoReplaceSvg: 'nest' };
      }
    };
    document.head.appendChild(fontAwesomeScript);

    // Add Tailwind config
    const tailwindScript = document.createElement('script');
    tailwindScript.textContent = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#4169E1',
              secondary: '#7C3AED',
              success: '#00C853',
              background: '#F5F5F5'
            }
          }
        }
      }
    `;
    document.head.appendChild(tailwindScript);

    // Add Font Awesome config
    const fontAwesomeConfig = document.createElement('script');
    fontAwesomeConfig.textContent = `
      window.FontAwesomeConfig = { autoReplaceSvg: 'nest'};
    `;
    document.head.appendChild(fontAwesomeConfig);

    return () => {
      // Clean up scripts
      if (document.head.contains(fontAwesomeScript)) {
        document.head.removeChild(fontAwesomeScript);
      }
      if (document.head.contains(tailwindScript)) {
        document.head.removeChild(tailwindScript);
      }
      if (document.head.contains(fontAwesomeConfig)) {
        document.head.removeChild(fontAwesomeConfig);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch product data from API
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/products/public/details/${productId}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
        } else {
          throw new Error(data.error || 'Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product?.name, 'Quantity:', quantity);
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('Buy now:', product?.name, 'Quantity:', quantity);
  };

  const handleVisitStore = () => {
    if (product) {
      navigate(`/vendor/${product.seller.id}`);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-sm border border-gray-100">
          <i className="fa-solid fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate('/categories')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Products</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-primary transition">
                <i className="fa-solid fa-heart text-xl"></i>
              </button>
              <button className="text-gray-600 hover:text-primary transition">
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                {product.image ? (
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-image text-gray-400 text-4xl"></i>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {product.image ? (
                      <img
                        src={`http://localhost:3000${product.image}`}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <i className="fa-solid fa-image text-gray-400 text-sm"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {product.commission}% MLM
                </span>
                <span className="text-gray-500 text-sm">SKU: PROD-{product.id}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-green-600 ml-2">
                    (${((product.price * product.commission) / 100).toFixed(2)} commission)
                  </span>
                </div>
                <div className="flex items-center">
                  {renderStars(Number(product.seller.rating || 0))}
                  <span className="text-sm text-gray-500 ml-2">
                    ({Number(product.seller.rating || 0).toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  <i className="fa-solid fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
                >
                  <i className="fa-solid fa-bolt mr-2"></i>
                  Buy Now
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-tag"></i>
                  <span>Category: {product.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <span>Location: {product.location}, {product.country}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-truck"></i>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-shield-alt"></i>
                  <span>Verified seller</span>
                </div>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {product.seller.photo && product.seller.photo !== 'N/A' ? (
                    product.seller.photo.startsWith('http') ? (
                      <img
                        src={product.seller.photo}
                        alt={product.seller.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={`http://localhost:3000${product.seller.photo}`}
                        alt={product.seller.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="fa-solid fa-user text-gray-400 text-xl"></i>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.seller.businessName || product.seller.fullName || product.seller.username}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400 text-sm">
                        {renderStars(product.seller.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatRatingWithText(product.seller.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {product.seller.country} • Verified seller
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleVisitStore}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Visit Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('description')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  selectedTab === 'description'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setSelectedTab('shipping')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  selectedTab === 'shipping'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  selectedTab === 'reviews'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>

          <div className="p-6">
            {selectedTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>High-quality product from verified seller</li>
                    <li>{product.commission}% MLM commission available</li>
                    <li>Fast shipping available</li>
                    <li>Customer satisfaction guaranteed</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Free shipping on orders over $50</li>
                      <li>Standard shipping: 5-7 business days</li>
                      <li>Express shipping: 2-3 business days</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>30-day return policy</li>
                      <li>Items must be in original condition</li>
                      <li>Customer covers return shipping</li>
                      <li>Refunds processed within 5 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400 mr-2">
                    {renderStars(product.seller.rating)}
                  </div>
                  <span className="text-gray-600">
                    {formatReviewText(product.seller.rating)}
                  </span>
                </div>
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
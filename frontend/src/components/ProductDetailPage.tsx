import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProductData {
  id: string;
  name: string;
  vendor: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  commission: string;
  commissionAmount: string;
  rating: number;
  reviews: number;
  image: string;
  sku: string;
  stock: number;
  description?: string;
  features?: string[];
}

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [product, setProduct] = useState<ProductData | null>(null);

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
    // Load product data based on productId
    const products: Record<string, ProductData> = {
      '1': {
        id: '1',
        name: 'Premium Wireless Headphones',
        vendor: 'TechStore Pro',
        price: 89.99,
        originalPrice: 129.99,
        discount: 30,
        commission: '12%',
        commissionAmount: '10.80',
        rating: 5,
        reviews: 245,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/714d0225c5-0b639c7375fd9648f21f.png',
        sku: 'HP-WL-001',
        stock: 23
      },
      '2': {
        id: '2',
        name: 'Fitness Smart Watch Pro',
        vendor: 'SmartTech',
        price: 199.99,
        commission: '15%',
        commissionAmount: '30.00',
        rating: 4.5,
        reviews: 89,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4b6e5aa4f3-818344d273083ae53233.png',
        sku: 'SW-FT-002',
        stock: 45
      },
      '3': {
        id: '3',
        name: 'Gaming Laptop Ultra Pro',
        vendor: 'CompuWorld',
        price: 1299.99,
        commission: '8%',
        commissionAmount: '104.00',
        rating: 5,
        reviews: 156,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/db85eaa0c2-0bfd73510a097e66e332.png',
        sku: 'LP-GM-003',
        stock: 12
      },
      '4': {
        id: '4',
        name: 'Latest Smartphone Pro Max',
        vendor: 'MobileHub',
        price: 699.99,
        commission: '10%',
        commissionAmount: '70.00',
        rating: 5,
        reviews: 423,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/de4a6b8f58-31b72c9f9f944e3d635e.png',
        sku: 'SP-LT-004',
        stock: 67
      },
      '5': {
        id: '5',
        name: 'Premium Wireless Earbuds',
        vendor: 'AudioTech',
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        commission: '14%',
        commissionAmount: '21.00',
        rating: 4.5,
        reviews: 178,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7ed769be79-94926f0f7957fe5f9f93.png',
        sku: 'EB-PR-005',
        stock: 34
      },
      '6': {
        id: '6',
        name: 'Professional Tablet 12.9"',
        vendor: 'TabletPro',
        price: 799.99,
        commission: '9%',
        commissionAmount: '72.00',
        rating: 5,
        reviews: 267,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/a3c28fca87-136f0e073b5230c5f610.png',
        sku: 'TB-PR-006',
        stock: 19
      }
    };

    const productData = products[productId || '1'];
    if (productData) {
      setProduct(productData);
    } else {
      // Redirect to categories if product not found
      navigate('/categories');
    }
  }, [productId, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Handle add to cart logic here
    console.log(`Adding ${quantity} of ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    // Handle buy now logic here
    console.log(`Buying ${quantity} of ${product.name}`);
  };

  const handleAddToWishlist = () => {
    // Handle add to wishlist logic here
    console.log(`Adding ${product.name} to wishlist`);
  };

  const handleShare = () => {
    // Handle share logic here
    console.log(`Sharing ${product.name}`);
  };

  const handleCompare = () => {
    // Handle compare logic here
    console.log(`Adding ${product.name} to compare`);
  };

  const handleVisitStore = () => {
    // Navigate to vendor store
    console.log(`Visiting ${product.vendor} store`);
  };

  const images = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star${i < Math.floor(rating) ? '' : i < rating ? '-half-stroke' : '-regular'}`}
      ></i>
    ));
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                ANZACASH
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <span
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  Home
                </span>
                <span
                  className="text-primary font-medium cursor-pointer border-b-2 border-primary pb-1"
                  onClick={() => navigate('/categories')}
                >
                  Categories
                </span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Vendors</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">MLM Program</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Support</span>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              <div className="relative">
                <i className="fa-regular fa-heart text-xl text-gray-600 cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => navigate('/cart')}
              >
                <i className="fa-solid fa-shopping-cart text-xl text-gray-600 hover:text-primary"></i>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">7</span>
              </div>
              <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition font-medium">Login</button>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium">Register</button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                Electronics
              </span>
              <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
              <span
                className="hover:text-primary cursor-pointer"
                onClick={() => navigate('/categories')}
              >
                Headphones
              </span>
              <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="relative group">
                  <img
                    className="w-full h-96 object-cover rounded-xl"
                    src={images[selectedImage]}
                    alt={`${product.name} main view`}
                  />
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
                    <i className="fa-solid fa-expand text-gray-600"></i>
                  </button>
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                      Sale -{product.discount}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <img
                    key={index}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer hover:border-primary transition ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-primary font-medium hover:underline cursor-pointer">{product.vendor}</span>
                  <i className="fa-solid fa-badge-check text-blue-500"></i>
                  <span className="text-sm text-gray-500">Verified Vendor</span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">Save {product.discount}%</span>
                  )}
                </div>
                <div className="bg-gradient-to-r from-success to-green-400 text-white p-4 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">MLM Commission Available</p>
                      <p className="text-sm opacity-90">Earn ${product.commissionAmount} when you refer this product</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{product.commission}</p>
                      <p className="text-sm opacity-90">Commission</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      max={product.stock}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-none focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">{product.stock} in stock</span>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
                  >
                    <i className="fa-solid fa-shopping-cart mr-2"></i>
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-6 text-gray-600">
                  <button
                    onClick={handleAddToWishlist}
                    className="flex items-center space-x-2 hover:text-primary"
                  >
                    <i className="fa-regular fa-heart"></i>
                    <span>Add to Wishlist</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 hover:text-primary"
                  >
                    <i className="fa-solid fa-share"></i>
                    <span>Share</span>
                  </button>
                  <button
                    onClick={handleCompare}
                    className="flex items-center space-x-2 hover:text-primary"
                  >
                    <i className="fa-solid fa-balance-scale"></i>
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`py-4 font-semibold ${
                    selectedTab === 'description'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setSelectedTab('specifications')}
                  className={`py-4 font-medium ${
                    selectedTab === 'specifications'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setSelectedTab('reviews')}
                  className={`py-4 font-medium ${
                    selectedTab === 'reviews'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Reviews ({product.reviews})
                </button>
                <button
                  onClick={() => setSelectedTab('shipping')}
                  className={`py-4 font-medium ${
                    selectedTab === 'shipping'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Shipping Info
                </button>
              </nav>
            </div>
            <div className="p-6">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Experience premium audio quality with our state-of-the-art wireless headphones.
                    Featuring advanced noise cancellation technology, these headphones deliver crystal-clear sound
                    whether you're commuting, working, or relaxing at home.
                  </p>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-success mr-2"></i>
                      Active Noise Cancellation
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-success mr-2"></i>
                      30-hour battery life
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-success mr-2"></i>
                      Quick charge: 5 minutes = 3 hours playback
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-success mr-2"></i>
                      Premium leather cushions
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-check text-success mr-2"></i>
                      Bluetooth 5.0 connectivity
                    </li>
                  </ul>
                </div>
              )}
              {selectedTab === 'specifications' && (
                <div className="text-gray-700">
                  <p>Technical specifications will be displayed here...</p>
                </div>
              )}
              {selectedTab === 'reviews' && (
                <div className="text-gray-700">
                  <p>Customer reviews will be displayed here...</p>
                </div>
              )}
              {selectedTab === 'shipping' && (
                <div className="text-gray-700">
                  <p>Shipping information will be displayed here...</p>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  className="w-16 h-16 rounded-full"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  alt={product.vendor}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{product.vendor}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400 text-sm">
                      {renderStars(4.9)}
                    </div>
                    <span className="text-sm text-gray-600">4.9 (1,234 reviews)</span>
                  </div>
                  <p className="text-sm text-gray-500">Member since 2019 • 5,678 products</p>
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

          {/* Related Products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[280px] overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4b6e5aa4f3-818344d273083ae53233.png"
                    alt="Related product 1"
                  />
                  <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">15% MLM</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Fitness Smart Watch Pro</h3>
                  <p className="text-sm text-primary mb-2">SmartTech</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">$199.99</span>
                    <div className="flex text-yellow-400 text-sm">
                      {renderStars(4.5)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[280px] overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ed769be79-94926f0f7957fe5f9f93.png"
                    alt="Related product 2"
                  />
                  <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">14% MLM</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Wireless Earbuds</h3>
                  <p className="text-sm text-primary mb-2">AudioTech</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">$149.99</span>
                    <div className="flex text-yellow-400 text-sm">
                      {renderStars(4.5)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[280px] overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/de4a6b8f58-31b72c9f9f944e3d635e.png"
                    alt="Related product 3"
                  />
                  <span className="absolute top-3 right-3 bg-success text-white text-xs px-2 py-1 rounded">10% MLM</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Latest Smartphone Pro Max</h3>
                  <p className="text-sm text-primary mb-2">MobileHub</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">$699.99</span>
                    <div className="flex text-yellow-400 text-sm">
                      {renderStars(5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Cart */}
      <div className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition">
        <i className="fa-solid fa-shopping-cart text-xl"></i>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">7</span>
      </div>
    </div>
  );
};

export default ProductDetailPage;
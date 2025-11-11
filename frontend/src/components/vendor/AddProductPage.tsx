import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [commissionValue, setCommissionValue] = useState('15');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    sku: '',
    stockQuantity: '',
    lowStockAlert: '5',
    weight: '',
    shippingClass: 'Standard Shipping',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    videoUrl: '',
    metaTitle: '',
    metaDescription: '',
    status: 'Draft' as 'Draft' | 'Published' | 'Scheduled'
  });

  // Images state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommissionValue(e.target.value);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested dimensions object
    if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1] as keyof typeof formData.dimensions;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle image selection
  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB per image.');
        return;
      }

      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newImages.length > 0) {
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
      setPreviewImages(prev => [...prev, ...newPreviews].slice(0, 5));
      setError('');
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleImageSelect(target.files);
    };
    input.click();
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke object URL to avoid memory leaks
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return newPreviews;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    handleImageSelect(e.dataTransfer.files);
  };

  const handleSaveDraft = async () => {
    await handleSubmitProduct('Draft');
  };

  const handlePublishProduct = async () => {
    await handleSubmitProduct('Published');
  };

  const handleSubmitProduct = async (status: 'Draft' | 'Published') => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Submitting product with status:', status);

      // Validate required fields
      const validation = productService.validateProductData({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        commission: parseInt(commissionValue)
      });

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        price: parseFloat(formData.price) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        sku: formData.sku.trim(),
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
        lowStockAlert: formData.lowStockAlert ? parseInt(formData.lowStockAlert) : undefined,
        commission: parseInt(commissionValue),
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        shippingClass: formData.shippingClass || undefined,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : 0,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : 0,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : 0
        },
        videoUrl: formData.videoUrl.trim(),
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        status
      };

      console.log('📋 Product data prepared:', productData);
      console.log('📸 Number of images:', selectedImages.length);

      // Submit to API
      const result = await productService.createProduct(productData, selectedImages);

      console.log('✅ Product submitted successfully:', result);

      setSuccess(`Product ${status.toLowerCase()} successfully!`);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          category: '',
          subcategory: '',
          description: '',
          shortDescription: '',
          price: '',
          salePrice: '',
          sku: '',
          stockQuantity: '',
          lowStockAlert: '5',
          weight: '',
          shippingClass: 'Standard Shipping',
          dimensions: {
            length: '',
            width: '',
            height: ''
          },
          videoUrl: '',
          metaTitle: '',
          metaDescription: '',
          status: 'Draft'
        });
        setSelectedImages([]);
        setPreviewImages([]);
        setCommissionValue('15');

        // Navigate to products page if published
        if (status === 'Published') {
          navigate('/products');
        }
      }, 2000);

    } catch (err) {
      console.error('❌ Error submitting product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit product';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-primary">ANZACASH</div>
              <nav className="hidden md:flex items-center space-x-6">
                <span
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-primary font-medium cursor-pointer"
                >
                  Dashboard
                </span>
                <span className="text-primary font-medium cursor-pointer">Products</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Orders</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Analytics</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600 mt-2">Create a new product listing for your store</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-info text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Main Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Sports & Outdoors">Sports & Outdoors</option>
                    </select>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      placeholder="Enter subcategory..."
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-200 rounded text-gray-600">
                        <i className="fa-solid fa-bold"></i>
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded text-gray-600">
                        <i className="fa-solid fa-italic"></i>
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded text-gray-600">
                        <i className="fa-solid fa-underline"></i>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button className="p-2 hover:bg-gray-200 rounded text-gray-600">
                        <i className="fa-solid fa-list-ul"></i>
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded text-gray-600">
                        <i className="fa-solid fa-list-ol"></i>
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Describe your product in detail..."
                      className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief product summary..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-dollar-sign text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pricing & Inventory</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price (TZS)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (Optional)</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Product SKU"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    name="lowStockAlert"
                    value={formData.lowStockAlert}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">MLM Commission %</label>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue-700">This percentage goes to MLM members who refer buyers</span>
                      <span className="text-lg font-bold text-primary">{commissionValue}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={commissionValue}
                      onChange={handleCommissionChange}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-blue-600 mt-2">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-image text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Product Media</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
                  <div>
                  {/* Image Upload Area */}
                  <div
                    onClick={handleImageUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Drag & drop images here</h3>
                    <p className="text-gray-500 mb-4">or click to browse files</p>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700">
                      Choose Files
                    </button>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB each. First image will be primary.</p>
                  </div>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({previewImages.length}/5)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className="fa-solid fa-times text-xs"></i>
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Optional)</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-truck text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Class</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Standard Shipping</option>
                    <option>Express Shipping</option>
                    <option>Heavy Item</option>
                    <option>Fragile Item</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L × W × H cm)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Length"
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Width"
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Height"
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SEO */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-search text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    placeholder="SEO optimized title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">60 characters recommended</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    rows={3}
                    placeholder="SEO meta description..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">160 characters recommended</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Preview Card */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Preview</h3>
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <i className="fa-solid fa-image text-4xl text-gray-400"></i>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Product Name</h4>
                  <p className="text-sm text-gray-600 mb-3">Category &gt; Subcategory</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">0.00 TZS</span>
                    <span className="px-2 py-1 bg-green-100 text-success text-xs font-medium rounded-full">
                      {commissionValue}% MLM
                    </span>
                  </div>
                  <button className="w-full py-2 bg-primary text-white rounded-lg font-medium">
                    Add to Cart
                  </button>
                </div>
              </section>

              {/* Publish Settings */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Publish Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>

                  {/* Success Message */}
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                      {success}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Password Protected</option>
                    </select>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleSaveDraft}
                      disabled={isLoading}
                      className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-save mr-2"></i>Save Draft
                        </>
                      )}
                    </button>
                    <button
                      onClick={handlePublishProduct}
                      disabled={isLoading}
                      className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-rocket mr-2"></i>Publish Product
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 md:hidden">
        <div className="flex items-center justify-around">
          <div
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center space-y-1 cursor-pointer"
          >
            <i className="fa-solid fa-home text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-box text-primary text-xl"></i>
            <span className="text-xs font-medium text-primary">Products</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-shopping-bag text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Orders</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-chart-bar text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Analytics</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <i className="fa-solid fa-user text-gray-400 text-xl"></i>
            <span className="text-xs text-gray-400">Profile</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AddProductPage;
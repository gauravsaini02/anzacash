const API_BASE_URL = 'http://localhost:3000/api';

export interface ProductData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  commission: number;
  category: string;
  subcategory?: string;
  weight?: number;
  shippingClass?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'Draft' | 'Published' | 'Scheduled';
}

export interface ProductResponse {
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

class ProductService {
  private getAuthHeaders() {
    const token = localStorage.getItem('anzacash_token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  async createProduct(productData: ProductData, images?: File[]): Promise<ProductResponse> {
    try {
      console.log('🚀 Creating product with data:', productData);
      console.log('📸 Images selected:', images?.length || 0);

      const formData = new FormData();

      // Add product data as JSON
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('commission', productData.commission.toString());
      formData.append('category', productData.category);
      formData.append('status', productData.status);

      // Add optional fields
      if (productData.shortDescription) {
        formData.append('shortDescription', productData.shortDescription);
      }
      if (productData.salePrice !== undefined) {
        formData.append('salePrice', productData.salePrice.toString());
      }
      if (productData.sku) {
        formData.append('sku', productData.sku);
      }
      if (productData.stockQuantity !== undefined) {
        formData.append('stockQuantity', productData.stockQuantity.toString());
      }
      if (productData.lowStockAlert !== undefined) {
        formData.append('lowStockAlert', productData.lowStockAlert.toString());
      }
      if (productData.subcategory) {
        formData.append('subcategory', productData.subcategory);
      }
      if (productData.weight !== undefined) {
        formData.append('weight', productData.weight.toString());
      }
      if (productData.shippingClass) {
        formData.append('shippingClass', productData.shippingClass);
      }
      if (productData.dimensions) {
        formData.append('dimensions', JSON.stringify(productData.dimensions));
      }
      if (productData.videoUrl) {
        formData.append('videoUrl', productData.videoUrl);
      }
      if (productData.metaTitle) {
        formData.append('metaTitle', productData.metaTitle);
      }
      if (productData.metaDescription) {
        formData.append('metaDescription', productData.metaDescription);
      }

      // Add images if provided
      if (images) {
        images.forEach((image, index) => {
          formData.append('productImages', image);
          console.log(`📎 Adding image ${index + 1}:`, image.name, 'size:', image.size);
        });
      }

      console.log('📡 Sending product creation request to:', `${API_BASE_URL}/products`);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      });

      console.log('📡 Product creation response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Product creation failed, response body:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.message || 'Failed to create product');
        } catch (parseError) {
          throw new Error(`Product creation failed: ${response.status} ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Product created successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }
  }

  async getVendorProducts(): Promise<ProductResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor products: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async updateProduct(id: number, productData: Partial<ProductData>): Promise<ProductResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Format price for display
  formatPrice(price: number): string {
    return price.toLocaleString('en-TZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // Get products for customers (public endpoint)
  async getProductsForCustomers(page: number = 1, limit: number = 20, category?: string, search?: string): Promise<any> {
    try {
      let url = `${API_BASE_URL}/products/public?page=${page}&limit=${limit}`;
      if (category && category !== 'all') {
        url += `&category=${category}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching products for customers:', error);
      throw error;
    }
  }

  // Get product details for customers (public endpoint)
  async getProductDetailsForCustomers(id: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/public/details/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching product details for customers:', error);
      throw error;
    }
  }

  // Validate product data
  validateProductData(data: Partial<ProductData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Product name must be at least 3 characters long');
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Product description must be at least 10 characters long');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Product price must be greater than 0');
    }

    if (!data.category || data.category.trim().length === 0) {
      errors.push('Please select a product category');
    }

    if (data.commission === undefined || data.commission < 0 || data.commission > 50) {
      errors.push('Commission must be between 0 and 50 percent');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new ProductService();
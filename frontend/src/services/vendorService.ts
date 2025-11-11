const API_BASE_URL = 'http://localhost:3000/api';

export interface VendorData {
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    photo: string;
    joinDate: string;
    status: string;
    position: string;
  };
  finances: {
    balance: string;
    profit: string;
    bonus: string;
    totalWithdrawn: string;
  };
  stats: {
    totalProducts: number;
    totalOrders: number;
    monthlySales: string;
    totalRevenue: string;
  };
}

export interface VendorStats {
  products: {
    total: number;
    active: number;
    pending: number;
  };
  orders: {
    total: number;
    completed: number;
  };
  revenue: {
    total: string;
    monthly: string;
  };
}

class VendorService {
  private getAuthHeaders() {
    const token = localStorage.getItem('anzacash_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getVendorProfile(): Promise<VendorData> {
    try {
      console.log('🔍 Fetching seller profile from new API endpoint...');
      const response = await fetch(`${API_BASE_URL}/profile/seller`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Authentication failed: Invalid credentials or session expired (404). Please log in again.');
        } else {
          throw new Error(`Failed to fetch seller profile: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log('✅ Seller profile data received:', result);

      // Transform the data to match the existing VendorData interface
      const transformedData: VendorData = {
        user: result.data.user,
        finances: result.data.finances,
        stats: {
          totalProducts: result.data.stats.totalProducts,
          totalOrders: result.data.stats.totalOrders,
          monthlySales: result.data.stats.monthlySales || '0',
          totalRevenue: result.data.stats.totalRevenue || '0'
        }
      };

      console.log('✅ Transformed seller profile data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching seller profile:', error);
      throw error;
    }
  }

  async getVendorStats(): Promise<VendorStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor stats: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
      throw error;
    }
  }

  async getVendorProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor/products`, {
        method: 'GET',
        headers: this.getAuthHeaders()
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

  async updateVendorProfile(profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
  }) {
    try {
      console.log('🔄 Updating vendor profile with data:', profileData);

      const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      console.log('📡 Profile update response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Profile update failed:', errorData);
        throw new Error(`Failed to update vendor profile: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Profile update successful:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error updating vendor profile:', error);
      throw error;
    }
  }

  async uploadProfilePicture(file: File): Promise<{ photoUrl: string; fileName: string }> {
    try {
      console.log('📤 Starting profile picture upload for file:', file.name, 'size:', file.size);

      const formData = new FormData();
      formData.append('profilePicture', file);

      console.log('📡 Sending upload request to:', `${API_BASE_URL}/vendor/profile-picture`);

      const response = await fetch(`${API_BASE_URL}/vendor/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      });

      console.log('📡 Upload response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed, response body:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to upload profile picture');
        } catch (parseError) {
          throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Profile picture uploaded successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error uploading profile picture:', error);
      throw error;
    }
  }

  private getToken(): string {
    return localStorage.getItem('anzacash_token') || '';
  }

  // Format balance for display
  formatBalance(balance: string): string {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-TZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // Get seller orders (new API integration)
  async getSellerOrders(page: number = 1, limit: number = 10, status?: string): Promise<any> {
    try {
      console.log('📦 Fetching seller orders from new API endpoint...');
      let url = `${API_BASE_URL}/orders/seller?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch seller orders: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Seller orders data received:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching seller orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: number, status: string, deliveryStatus?: string): Promise<any> {
    try {
      console.log(`🔄 Updating order ${orderId} status to ${status}...`);

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, deliveryStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Order status updated successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error;
    }
  }

  // Get status color for display
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Format currency
  formatCurrency(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-TZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}

export default new VendorService();
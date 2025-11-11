const API_BASE_URL = 'http://localhost:3000/api';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderData {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
  product: {
    id: number;
    name: string;
    price: number;
  };
  seller: {
    id: number;
    username: string;
    fullName: string;
  };
  quantity: number;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface CustomerOrderResponse {
  orders: OrderResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasMore: boolean;
  };
}

export interface SellerOrderResponse {
  orders: Array<{
    orderId: number;
    orderNumber: string;
    product: {
      id: number;
      name: string;
      price: number;
      image?: string;
    };
    customer: {
      id: number;
      username: string;
      fullName: string;
      email: string;
      phone?: string;
    };
    quantity: number;
    totalAmount: number;
    status: string;
    deliveryStatus: string;
    orderDate: string;
    orderDateTime: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasMore: boolean;
  };
}

class OrderService {
  private getAuthHeaders() {
    const token = localStorage.getItem('anzacash_token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Create a new order (customer placing order)
  async createOrder(orderData: OrderData): Promise<OrderResponse> {
    try {
      console.log('🛒 Creating order with data:', orderData);

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(orderData)
      });

      console.log('📡 Order creation response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Order creation failed, response body:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.message || 'Failed to create order');
        } catch (parseError) {
          throw new Error(`Order creation failed: ${response.status} ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ Order created successfully:', result);
      return result.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  // Get customer's orders
  async getCustomerOrders(page: number = 1, limit: number = 10, status?: string): Promise<CustomerOrderResponse> {
    try {
      let url = `${API_BASE_URL}/orders/customer?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer orders: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  // Get seller's orders
  async getSellerOrders(page: number = 1, limit: number = 10, status?: string): Promise<SellerOrderResponse> {
    try {
      let url = `${API_BASE_URL}/orders/seller?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch seller orders: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
    }
  }

  // Get order details
  async getOrderDetails(orderId: number): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Update order status (seller only)
  async updateOrderStatus(orderId: number, status: string, deliveryStatus?: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ status, deliveryStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Format price for display
  formatPrice(price: number): string {
    return price.toLocaleString('en-TZ', {
      style: 'currency',
      currency: 'TZS'
    });
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
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Validate order data
  validateOrderData(data: OrderData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.productId || data.productId <= 0) {
      errors.push('Valid product ID is required');
    }

    if (!data.quantity || data.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (data.quantity > 100) {
      errors.push('Quantity cannot exceed 100 items per order');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new OrderService();
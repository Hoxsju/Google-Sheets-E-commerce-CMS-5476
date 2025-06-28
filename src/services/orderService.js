const API_BASE = '/api';

export const orderService = {
  async createOrder(orderData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }
    
    return response.json();
  },

  async getOrders() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getOrder(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  }
};
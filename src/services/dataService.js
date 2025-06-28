const API_BASE = '/api';

export const dataService = {
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async getBlogPosts() {
    const response = await fetch(`${API_BASE}/blog`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return response.json();
  },

  async getBlogPost(slug) {
    const response = await fetch(`${API_BASE}/blog/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },

  async getPages() {
    const response = await fetch(`${API_BASE}/pages`);
    if (!response.ok) throw new Error('Failed to fetch pages');
    return response.json();
  },

  async getPage(slug) {
    const response = await fetch(`${API_BASE}/pages/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch page');
    return response.json();
  },

  async getSiteConfig() {
    const response = await fetch(`${API_BASE}/config`);
    if (!response.ok) throw new Error('Failed to fetch site config');
    return response.json();
  },

  async updateSiteConfig(config) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error('Failed to update site config');
    return response.json();
  },

  async refreshFromSheets() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/sync/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to refresh from sheets');
    return response.json();
  }
};
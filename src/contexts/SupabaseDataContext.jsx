import React, { createContext, useContext, useState, useEffect } from 'react';

const SupabaseDataContext = createContext();

export const useSupabaseData = () => {
  const context = useContext(SupabaseDataContext);
  if (!context) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
};

export const SupabaseDataProvider = ({ children }) => {
  // Mock data for testing
  const [products] = useState([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      rating: 4.8,
      featured: true,
      availability: 'in_stock'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracker with heart rate monitoring',
      price: 199.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      rating: 4.6,
      featured: true,
      availability: 'in_stock'
    }
  ]);

  const [categories] = useState([
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Books' }
  ]);

  const [blogPosts] = useState([
    {
      id: '1',
      title: 'Welcome to Our Platform',
      slug: 'welcome',
      excerpt: 'Welcome to our new e-commerce platform',
      content: 'Full content here...',
      featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      author: { name: 'Admin' },
      published_at: new Date().toISOString()
    }
  ]);

  const [pages] = useState([
    {
      id: '1',
      title: 'About Us',
      slug: 'about',
      content: 'About us content...'
    }
  ]);

  const [siteConfig] = useState({
    site_title: 'Sheets Commerce',
    site_logo: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const value = {
    products,
    categories,
    blogPosts,
    pages,
    siteConfig,
    loading,
    refreshData
  };

  return (
    <SupabaseDataContext.Provider value={value}>
      {children}
    </SupabaseDataContext.Provider>
  );
};
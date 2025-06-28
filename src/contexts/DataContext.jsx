import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [siteConfig, setSiteConfig] = useState({
    title: 'Sheets Commerce',
    logo: '',
    customCSS: '',
    customJS: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, blogData, pagesData, configData] = await Promise.all([
        dataService.getProducts(),
        dataService.getBlogPosts(),
        dataService.getPages(),
        dataService.getSiteConfig()
      ]);
      
      setProducts(productsData);
      setBlogPosts(blogData);
      setPages(pagesData);
      setSiteConfig(configData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <DataContext.Provider value={{
      products,
      blogPosts,
      pages,
      siteConfig,
      loading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};
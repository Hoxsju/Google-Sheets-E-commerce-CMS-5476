import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataService } from '../services/dataService';

const About = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await dataService.getPage('about');
        setPageData(data);
      } catch (error) {
        console.error('Error loading about page:', error);
        // Fallback content
        setPageData({
          title: 'About Us',
          content: 'We are a modern e-commerce company powered by Google Sheets. Our mission is to provide quality products with exceptional service.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {pageData?.title || 'About Us'}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none dark:prose-invert"
        >
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: pageData?.content }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;
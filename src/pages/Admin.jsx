import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { dataService } from '../services/dataService';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from '../components/ui/Toaster';

const { FiSettings, FiRefreshCw, FiDatabase, FiSave } = FiIcons;

const Admin = () => {
  const { siteConfig, refreshData } = useData();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    logo: '',
    googleSheetId: '',
    customCSS: '',
    customJS: ''
  });

  useEffect(() => {
    setFormData({
      title: siteConfig.title || '',
      logo: siteConfig.logo || '',
      googleSheetId: siteConfig.google_sheet_id || '',
      customCSS: siteConfig.custom_css || '',
      customJS: siteConfig.custom_js || ''
    });
  }, [siteConfig]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dataService.updateSiteConfig(formData);
      toast.success('Configuration updated successfully!');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await dataService.refreshFromSheets();
      toast.success('Data synced successfully from Google Sheets!');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your site configuration and sync data from Google Sheets
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Site Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2" />
                Site Configuration
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter site title"
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label htmlFor="googleSheetId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Google Sheet ID
                </label>
                <input
                  type="text"
                  id="googleSheetId"
                  name="googleSheetId"
                  value={formData.googleSheetId}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter Google Sheet ID"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The ID from your Google Sheets URL
                </p>
              </div>

              <div>
                <label htmlFor="customCSS" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom CSS
                </label>
                <textarea
                  id="customCSS"
                  name="customCSS"
                  rows={6}
                  value={formData.customCSS}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter custom CSS..."
                />
              </div>

              <div>
                <label htmlFor="customJS" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Custom JavaScript
                </label>
                <textarea
                  id="customJS"
                  name="customJS"
                  rows={6}
                  value={formData.customJS}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter custom JavaScript..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  )}
                  Save Configuration
                </button>
              </div>
            </form>
          </motion.div>

          {/* Data Sync */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <SafeIcon icon={FiDatabase} className="w-5 h-5 mr-2" />
                Data Management
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Sync from Google Sheets
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Refresh all products, blog posts, and pages from your Google Sheet.
                </p>
                
                <button
                  onClick={handleSync}
                  disabled={syncing || !formData.googleSheetId}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {syncing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                  )}
                  {syncing ? 'Syncing...' : 'Sync Data'}
                </button>
              </div>

              {!formData.googleSheetId && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please configure your Google Sheet ID first to enable data syncing.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
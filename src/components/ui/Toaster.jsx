import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiAlertCircle, FiInfo } = FiIcons;

let toastId = 0;
const toastCallbacks = [];

export const toast = {
  success: (message) => addToast(message, 'success'),
  error: (message) => addToast(message, 'error'),
  warning: (message) => addToast(message, 'warning'),
  info: (message) => addToast(message, 'info'),
};

const addToast = (message, type) => {
  const id = ++toastId;
  const newToast = { id, message, type };
  toastCallbacks.forEach(callback => callback(newToast));
  
  setTimeout(() => {
    toastCallbacks.forEach(callback => callback({ id, remove: true }));
  }, 5000);
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const callback = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    };
    
    toastCallbacks.push(callback);
    
    return () => {
      const index = toastCallbacks.indexOf(callback);
      if (index > -1) {
        toastCallbacks.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return FiCheck;
      case 'error': return FiX;
      case 'warning': return FiAlertCircle;
      case 'info': return FiInfo;
      default: return FiInfo;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-800 border-green-200';
      case 'error': return 'bg-red-50 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getColors(toast.type)}`}
          >
            <SafeIcon icon={getIcon(toast.type)} className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
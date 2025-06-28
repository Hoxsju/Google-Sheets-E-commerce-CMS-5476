import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } = FiIcons;

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SafeIcon icon={FiShoppingBag} className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start adding some items to your cart!
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <SafeIcon icon={FiArrowLeft} className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 shadow rounded-lg"
            >
              <div className="px-4 py-6 sm:px-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="py-6 flex"
                      >
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                          <img
                            src={item.image || 'https://via.placeholder.com/96x96'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                              <h3>
                                <Link to={`/products/${item.id}`} className="hover:text-primary-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              ${item.price} each
                            </p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 dark:text-gray-400">Qty:</span>
                              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <SafeIcon icon={FiMinus} className="h-4 w-4" />
                                </button>
                                <span className="px-3 py-1 text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <SafeIcon icon={FiPlus} className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              >
                                <SafeIcon icon={FiTrash2} className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 flex justify-between">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <SafeIcon icon={FiArrowLeft} className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-6 sm:p-6"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    ${getTotal().toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    Free
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <dt className="text-base font-medium text-gray-900 dark:text-white">Order total</dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    ${getTotal().toFixed(2)}
                  </dd>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
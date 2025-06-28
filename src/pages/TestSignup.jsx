import React from 'react';
import SignupTest from '../components/testing/SignupTest';

const TestSignup = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Signup Testing Page
        </h1>
        <SignupTest />
      </div>
    </div>
  );
};

export default TestSignup;
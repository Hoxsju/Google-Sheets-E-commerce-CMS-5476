import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SignupTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const testCases = [
    {
      name: "Valid Signup - Standard",
      data: {
        name: "John Doe",
        email: `test${Date.now()}@example.com`,
        password: "password123"
      },
      expectedResult: "success"
    },
    {
      name: "Valid Signup - Special Characters in Name",
      data: {
        name: "José María O'Connor-Smith",
        email: `test${Date.now()}@example.com`,
        password: "securepass123"
      },
      expectedResult: "success"
    },
    {
      name: "Password Too Short",
      data: {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "12345"
      },
      expectedResult: "error"
    },
    {
      name: "Invalid Email Format",
      data: {
        name: "Test User",
        email: "invalid-email-format",
        password: "password123"
      },
      expectedResult: "error"
    },
    {
      name: "Invalid Name - Numbers",
      data: {
        name: "John123",
        email: `test${Date.now()}@example.com`,
        password: "password123"
      },
      expectedResult: "error"
    },
    {
      name: "Invalid Name - Special Characters",
      data: {
        name: "John@Doe",
        email: `test${Date.now()}@example.com`,
        password: "password123"
      },
      expectedResult: "error"
    }
  ];

  const runTest = async (testCase) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: testCase.data.name,
          email: testCase.data.email,
          password: testCase.data.password
        }),
      });

      const result = await response.json();
      
      return {
        name: testCase.name,
        expected: testCase.expectedResult,
        actual: response.ok ? "success" : "error",
        status: response.status,
        message: result.message || "Success",
        passed: (response.ok && testCase.expectedResult === "success") || 
                (!response.ok && testCase.expectedResult === "error")
      };
    } catch (error) {
      return {
        name: testCase.name,
        expected: testCase.expectedResult,
        actual: "error",
        status: 0,
        message: error.message,
        passed: testCase.expectedResult === "error"
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    for (const testCase of testCases) {
      const result = await runTest(testCase);
      setTestResults(prev => [...prev, result]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }
    
    setTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Signup Testing Dashboard
        </h2>
        
        <button
          onClick={runAllTests}
          disabled={testing}
          className="mb-6 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {testing ? 'Running Tests...' : 'Run All Tests'}
        </button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Test Results
            </h3>
            
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.passed 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      result.passed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Expected: {result.expected}</p>
                    <p>Actual: {result.actual}</p>
                    <p>Status: {result.status}</p>
                    <p>Message: {result.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Summary
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Passed: {testResults.filter(r => r.passed).length} / {testResults.length}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SignupTest;
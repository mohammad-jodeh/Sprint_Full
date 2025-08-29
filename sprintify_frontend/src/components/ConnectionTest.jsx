import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/config';
import { login } from '../api/auth';
import { fetchProjects } from '../api/project';
import useAuthStore from '../store/authstore';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuthStore();

  const runTests = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Basic API Health Check
    try {
      const response = await api.get('/health-check');
      results.healthCheck = { 
        success: true, 
        message: 'API server is running',
        data: response.data 
      };
    } catch (error) {
      results.healthCheck = { 
        success: false, 
        message: `Health check failed: ${error.message}` 
      };
    }

    // Test 2: Authentication Check (if user is logged in)
    if (token) {
      try {
        const response = await fetchProjects();
        results.authentication = { 
          success: true, 
          message: 'Authentication working',
          data: `Fetched ${response?.length || 0} projects`
        };
      } catch (error) {
        results.authentication = { 
          success: false, 
          message: `Auth test failed: ${error.message}` 
        };
      }
    } else {
      results.authentication = { 
        success: false, 
        message: 'No authentication token found. Please login first.' 
      };
    }

    // Test 3: CORS Check
    try {
      const response = await api.options('/health-check');
      results.cors = { 
        success: true, 
        message: 'CORS is properly configured' 
      };
    } catch (error) {
      // OPTIONS might not be implemented, so we'll consider any response as success
      if (error.response) {
        results.cors = { 
          success: true, 
          message: 'CORS appears to be working (server responded)' 
        };
      } else {
        results.cors = { 
          success: false, 
          message: `CORS test failed: ${error.message}` 
        };
      }
    }

    setTestResults(results);
    setIsLoading(false);

    // Show summary toast
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;
    
    if (successCount === totalTests) {
      toast.success(`All ${totalTests} tests passed! ✅`);
    } else {
      toast.error(`${successCount}/${totalTests} tests passed. Check the results below.`);
    }
  };

  const TestResult = ({ title, result }) => (
    <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? '✅' : '❌'}
        </span>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
        {result.message}
      </p>
      {result.data && (
        <p className="text-xs text-gray-600 mt-1">
          Data: {JSON.stringify(result.data)}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Frontend-Backend Connection Test
          </h1>
          <p className="text-gray-600">
            This tool tests the connection between your React frontend and Node.js backend.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Running Tests...' : 'Run Connection Tests'}
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results:</h2>
              
              {testResults.healthCheck && (
                <TestResult title="API Health Check" result={testResults.healthCheck} />
              )}
              
              {testResults.authentication && (
                <TestResult title="Authentication Test" result={testResults.authentication} />
              )}
              
              {testResults.cors && (
                <TestResult title="CORS Configuration" result={testResults.cors} />
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current Configuration:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Frontend URL: http://localhost:5173</li>
              <li>• Backend URL: http://localhost:4000</li>
              <li>• API Base URL: http://localhost:4000/api/v1</li>
              <li>• User Status: {user ? `Logged in as ${user.email}` : 'Not logged in'}</li>
              <li>• Token Status: {token ? 'Token available' : 'No token'}</li>
            </ul>
          </div>

          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> To test authentication, please log in first. 
                You can create a test account or use existing credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;

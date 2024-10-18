import axios from 'axios';

// Base headers for every request
const baseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Credentials': true,
  'Authorization': 'Bearer YourNew32CharacterSecretKeyHere123456', // If using JWT authentication, replace 'your_jwt_token' with dynamic token fetching.
};

const request = {
  config: {
    useCredentials: true, // For API requests that require credentials (cookies or headers)
    method: 'get', // Default method
    url: null,
    headers: {}, // Headers will be set dynamically
    data: null, // Request body data for POST/PUT requests
    timeout: 120000, // Request timeout in milliseconds (120 seconds)
    responseType: 'json', // Expected response format
  },

  // Function to set headers dynamically
  setHeaders(customHeaders = {}) {
    this.config.headers = {
      ...baseHeaders,
      ...customHeaders,
    };
  },

  // Function to customize the configuration for each request
  setConfig({
    method = 'get', url, data = null, customHeaders = {},
  }) {
    this.config.method = method;
    this.config.url = url;
    this.config.data = data;
    this.setHeaders(customHeaders);
  },

  // Function to send the request
  async sendRequest() {
    try {
      axios.defaults.withCredentials = this.config.useCredentials;
      const response = await axios(this.config);
      return response.data;
    } catch (error) {
      console.error('API call failed', error);
      throw error;
    }
  },
};

export default request;

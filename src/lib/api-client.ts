class ApiClient {
    private baseURL = 'http://localhost:3001';
  
    private async request(endpoint: string, options: RequestInit = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      return response.json();
    }
  
    // Products API
    async getProducts() {
      return this.request('/products');
    }
  
    async searchProducts(query: string) {
      return this.request(`/products/search?q=${encodeURIComponent(query)}`);
    }
  
    // Categories API  
    async getCategories() {
      return this.request('/categories');
    }
  
    async getCategoriesFlat() {
      return this.request('/categories/flat');
    }
  
    // Brands API
    async getBrands() {
      return this.request('/brands');
    }
  }
  
  export const apiClient = new ApiClient();
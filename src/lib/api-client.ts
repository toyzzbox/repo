class ApiClient {
    private baseURL = process.env.NODE_ENV === 'production' 
      ? 'http://backend:3001'  // Production: container ismi
      : 'http://localhost:3001'; // Development: localhost
  
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
  
    // Diğer methodlarınız aynı kalacak...
    async getProducts() {
      return this.request('/products');
    }
    
    async searchProducts(query: string) {
      return this.request(`/products/search?q=${encodeURIComponent(query)}`);
    }
    
    async getDiscountedProducts() {
      return this.request('/products/discounted');
    }
    
    async getCategories() {
      return this.request('/categories');
    }
    
    async getCategoriesFlat() {
      return this.request('/categories/flat');
    }
    
    async getBrands() {
      return this.request('/brands');
    }
    
    async getPopularProducts() {
      return this.request('/products/popular');
    }
  }
  
  export const apiClient = new ApiClient();
class ApiClient {
    private baseURL = 'http://nestjs_backend:3001'; // Container ismi kullanın
  
    private async request(endpoint: string, options: RequestInit = {}) {
      const url = `${this.baseURL}${endpoint}`;
      console.log('🔗 API Request:', url); // Debug için
  
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });
  
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        console.error('❌ API Request failed:', error);
        throw error;
      }
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

    async getAttributes() {
        return this.request('/attributes');
      }
  }
  
  export const apiClient = new ApiClient();
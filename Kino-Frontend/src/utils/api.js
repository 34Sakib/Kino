const BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // If unauthorized, clear local token
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API Request failed');
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
  resolveImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://localhost:8000/storage/${url}`;
  }

  mapProduct(prod) {
    if (!prod) return null;
    
    // Extrapolate image urls from database relation or fallback
    const urls = prod.images && prod.images.length > 0
      ? prod.images.map(img => {
          const path = typeof img === 'string' ? img : img.url;
          return this.resolveImageUrl(path);
        })
      : ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'];

    // Accumulate total variant stock levels
    let stockTotal = 0;
    if (prod.variants) {
      stockTotal = prod.variants.reduce((acc, curr) => acc + (curr.inventory?.stock || 0), 0);
    }

    return {
      ...prod,
      id: prod.id,
      slug: prod.slug,
      originalPrice: prod.original_price ? parseFloat(prod.original_price) : null,
      price: parseFloat(prod.price),
      images: urls,
      category: prod.category?.slug || 'accessories',
      stock: stockTotal,
      rating: prod.rating_summary?.average || prod.reviews_avg_rating ? parseFloat(prod.reviews_avg_rating) : 5.0,
      reviewCount: prod.rating_summary?.count || prod.reviews_count || 0,
      colors: prod.colors || [
        { name: 'Cream White', hex: '#F5F0EA' },
        { name: 'Charcoal', hex: '#1E1E1E' }
      ],
      sizes: prod.sizes || ['Small', 'Medium', 'Grande']
    };
  }

  mapProducts(list) {
    if (!list) return [];
    const items = Array.isArray(list) ? list : (list.data || []);
    return items.map(p => this.mapProduct(p));
  }

  mapCategory(cat) {
    if (!cat) return null;
    return {
      ...cat,
      image: this.resolveImageUrl(cat.image)
    };
  }

  mapCategories(list) {
    if (!list) return [];
    const items = Array.isArray(list) ? list : (list.data || []);
    return items.map(c => this.mapCategory(c));
  }
}

export const api = new ApiClient();
export default api;

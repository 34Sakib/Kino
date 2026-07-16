import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const syncToggleWithServer = async (productId) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    try {
      await api.post('/wishlist/toggle', { product_id: productId });
    } catch (e) {
      console.error("Wishlist toggle sync failed:", e);
    }
  }
};

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      loadWishlistFromServer: async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const serverWishlist = await api.get('/wishlist');
            const mapped = api.mapProducts(serverWishlist);
            set({ items: mapped });
          } catch (e) {
            console.error("Failed to load server wishlist:", e);
          }
        }
      },

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);

        let newItems;
        if (exists) {
          newItems = items.filter((item) => item.id !== product.id);
        } else {
          newItems = [...items, product];
        }
        set({ items: newItems });
        syncToggleWithServer(product.id);
      },

      hasItem: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'wishlist-storage'
    }
  )
);

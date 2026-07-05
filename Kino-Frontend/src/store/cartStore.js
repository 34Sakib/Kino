import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const syncCartWithServer = async (items) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    try {
      await api.post('/cart/update', { cart: items });
    } catch (e) {
      console.error("Cart sync failed:", e);
    }
  }
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      loadCartFromServer: async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const serverCart = await api.get('/cart');
            set({ items: serverCart });
          } catch (e) {
            console.error("Failed to load server cart:", e);
          }
        }
      },

      addItem: (product, color = null, size = null, qty = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => 
            item.id === product.id && 
            (!color || item.selectedColor?.name === color.name) &&
            (!size || item.selectedSize === size)
        );

        let newItems;
        if (existingIndex > -1) {
          newItems = [...items];
          newItems[existingIndex].qty += qty;
        } else {
          newItems = [
            ...items,
            {
              ...product,
              selectedColor: color || (product.colors && product.colors[0]) || null,
              selectedSize: size || (product.sizes && product.sizes[0]) || null,
              qty
            }
          ];
        }
        
        set({ items: newItems, isDrawerOpen: true });
        syncCartWithServer(newItems);
      },

      removeItem: (id, colorName = null, size = null) => {
        const newItems = get().items.filter(
          (item) => !(
            item.id === id && 
            (!colorName || item.selectedColor?.name === colorName) &&
            (!size || item.selectedSize === size)
          )
        );
        set({ items: newItems });
        syncCartWithServer(newItems);
      },

      updateQty: (id, colorName, size, qty) => {
        if (qty <= 0) {
          get().removeItem(id, colorName, size);
          return;
        }
        const newItems = get().items.map((item) =>
          item.id === id && 
          (!colorName || item.selectedColor?.name === colorName) &&
          (!size || item.selectedSize === size)
            ? { ...item, qty }
            : item
        );
        set({ items: newItems });
        syncCartWithServer(newItems);
      },

      clearCart: () => {
        set({ items: [] });
        syncCartWithServer([]);
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }) 
    }
  )
);

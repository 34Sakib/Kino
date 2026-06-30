import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (product, color = null, size = null, qty = 1) => {
        const items = get().items;
        
        // Find if this specific product variation already exists
        const existingIndex = items.findIndex(
          (item) => 
            item.id === product.id && 
            (!color || item.selectedColor?.name === color.name) &&
            (!size || item.selectedSize === size)
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].qty += qty;
          set({ items: newItems });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                selectedColor: color || (product.colors && product.colors[0]) || null,
                selectedSize: size || (product.sizes && product.sizes[0]) || null,
                qty
              }
            ]
          });
        }
        
        // Open drawer on add for immediate visual feedback
        set({ isDrawerOpen: true });
      },

      removeItem: (id, colorName = null, size = null) => {
        set({
          items: get().items.filter(
            (item) => !(
              item.id === id && 
              (!colorName || item.selectedColor?.name === colorName) &&
              (!size || item.selectedSize === size)
            )
          )
        });
      },

      updateQty: (id, colorName, size, qty) => {
        if (qty <= 0) {
          get().removeItem(id, colorName, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && 
            (!colorName || item.selectedColor?.name === colorName) &&
            (!size || item.selectedSize === size)
              ? { ...item, qty }
              : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }) // Only persist cart items
    }
  )
);

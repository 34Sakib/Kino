import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      shippingAddress: null,

      login: (email, name = 'Valued Guest') => {
        set({
          user: {
            name,
            email,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
          }
        });
      },

      logout: () => {
        set({ user: null });
      },

      updateShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      addOrder: (order) => {
        const currentOrders = get().orders;
        const newOrder = {
          ...order,
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        set({ orders: [newOrder, ...currentOrders] });
        return newOrder;
      }
    }),
    {
      name: 'user-storage'
    }
  )
);

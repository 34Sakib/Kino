import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { useCartStore } from './cartStore';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      shippingAddress: null,
      error: null,
      loading: false,

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          localStorage.setItem('auth_token', res.access_token);
          
          // Merge guest cart items to DB profile
          const guestCart = useCartStore.getState().items;
          const mergeRes = await api.post('/cart/merge', { guest_cart: guestCart });
          useCartStore.setState({ items: mergeRes.cart });

          set({ user: res.user, loading: false });
          return res.user;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          localStorage.setItem('auth_token', res.access_token);

          // Merge guest cart items to DB profile
          const guestCart = useCartStore.getState().items;
          const mergeRes = await api.post('/cart/merge', { guest_cart: guestCart });
          useCartStore.setState({ items: mergeRes.cart });

          set({ user: res.user, loading: false });
          return res.user;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (e) {
          // Ignore logout error if token was already expired
        }
        localStorage.removeItem('auth_token');
        set({ user: null, orders: [], shippingAddress: null });
      },

      updateShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      addOrder: (order) => {
        const currentOrders = get().orders;
        const newOrder = {
          ...order,
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

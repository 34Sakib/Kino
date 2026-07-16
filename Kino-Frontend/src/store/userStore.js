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

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;
        set({ loading: true, error: null });
        try {
          const res = await api.get('/auth/me');
          set({ user: res, loading: false });
          // Load orders after successful session recovery
          get().loadOrders();
          return res;
        } catch (err) {
          localStorage.removeItem('auth_token');
          set({ user: null, orders: [], loading: false });
          return null;
        }
      },

      loadOrders: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        try {
          const res = await api.get('/orders');
          set({ orders: res });
        } catch (err) {
          console.error("Failed to load user orders:", err);
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/auth/register', { name, email, password });
          localStorage.setItem('auth_token', res.access_token);
          
          // Merge guest cart items to DB profile if present
          const guestCart = useCartStore.getState().items || [];
          if (guestCart.length > 0) {
            const mergeRes = await api.post('/cart/merge', { guest_cart: guestCart });
            useCartStore.setState({ items: mergeRes.cart || [] });
          } else {
            const dbCart = await api.get('/cart');
            useCartStore.setState({ items: dbCart || [] });
          }

          set({ user: res.user, loading: false });
          get().loadOrders();
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

          // Merge guest cart items to DB profile if present
          const guestCart = useCartStore.getState().items || [];
          if (guestCart.length > 0) {
            const mergeRes = await api.post('/cart/merge', { guest_cart: guestCart });
            useCartStore.setState({ items: mergeRes.cart || [] });
          } else {
            const dbCart = await api.get('/cart');
            useCartStore.setState({ items: dbCart || [] });
          }

          set({ user: res.user, loading: false });
          get().loadOrders();
          return res.user;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      updateProfile: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post('/profile/update', formData);
          set({ user: res, loading: false });
          return res;
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

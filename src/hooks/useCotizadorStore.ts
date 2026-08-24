import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  producto_id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio_unitario: number;
  imagen_url?: string;
  cantidad_minima: number;
  incremento: number;
}

interface CotizadorState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (producto_id: number) => void;
  updateQuantity: (producto_id: number, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCotizadorStore = create<CotizadorState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.producto_id === item.producto_id);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.producto_id === item.producto_id ? { ...i, cantidad: i.cantidad + item.cantidad } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (producto_id) => set((state) => ({
        items: state.items.filter(i => i.producto_id !== producto_id)
      })),
      updateQuantity: (producto_id, cantidad) => set((state) => ({
        items: state.items.map(i =>
          i.producto_id === producto_id ? { ...i, cantidad } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
      },
      getItemCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'cotizador-storage',
    }
  )
);

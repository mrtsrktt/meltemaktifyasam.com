import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name_tr: string;
  price: number;
  originalPrice?: number;
  image_url: string | null;
  quantity: number;
  type?: "product" | "set";
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const itemId = item.type === "set" ? `set-${item.id}` : item.id;
        set((state) => {
          const existing = state.items.find((i) =>
            i.type === "set" ? `set-${i.id}` === itemId : i.id === itemId
          );
          if (existing) {
            return {
              items: state.items.map((i) => {
                const currentId = i.type === "set" ? `set-${i.id}` : i.id;
                return currentId === itemId ? { ...i, quantity: i.quantity + 1 } : i;
              }),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => {
            const currentId = i.type === "set" ? `set-${i.id}` : i.id;
            return currentId !== id;
          }),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => {
            const currentId = i.type === "set" ? `set-${i.id}` : i.id;
            return currentId === id ? { ...i, quantity } : i;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "meltem-cart",
    }
  )
);

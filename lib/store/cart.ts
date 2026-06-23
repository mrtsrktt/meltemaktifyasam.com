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

export type PaymentMethod = "havale" | null;

type PendingAdd = {
  item: Omit<CartItem, "quantity">;
  quantity: number;
} | null;

interface CartStore {
  items: CartItem[];
  // Müşterinin seçtiği ödeme yöntemi (ilk seçim hatırlanır; sepet temizlenince sıfırlanır)
  paymentMethod: PaymentMethod;
  // "Sepete Ekle" sonrası ödeme yöntemi sorulurken bekleyen ürün
  pendingAdd: PendingAdd;

  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  // "Sepete Ekle": yöntem seçilmişse direkt ekler, değilse modal açar
  requestAdd: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  // Modal'da "Havale" seçilince: yöntemi kaydet + bekleyen ürünü ekle
  confirmHavale: () => void;
  closeModal: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;

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
      paymentMethod: null,
      pendingAdd: null,

      addItem: (item, quantity = 1) => {
        const itemId = item.type === "set" ? `set-${item.id}` : item.id;
        set((state) => {
          const existing = state.items.find((i) =>
            i.type === "set" ? `set-${i.id}` === itemId : i.id === itemId
          );
          if (existing) {
            return {
              items: state.items.map((i) => {
                const currentId = i.type === "set" ? `set-${i.id}` : i.id;
                return currentId === itemId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i;
              }),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      requestAdd: (item, quantity = 1) => {
        // Havale daha önce seçildiyse sormadan sepete ekle
        if (get().paymentMethod === "havale") {
          get().addItem(item, quantity);
          return;
        }
        // Henüz yöntem seçilmedi → modal aç
        set({ pendingAdd: { item, quantity } });
      },

      confirmHavale: () => {
        const pending = get().pendingAdd;
        set({ paymentMethod: "havale", pendingAdd: null });
        if (pending) {
          get().addItem(pending.item, pending.quantity);
        }
      },

      closeModal: () => set({ pendingAdd: null }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

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

      // Sepet temizlenince ödeme yöntemi seçimi de sıfırlanır (yeni alışverişte tekrar sorulur)
      clearCart: () => set({ items: [], paymentMethod: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "meltem-cart",
      // pendingAdd (modal state) kalıcı olmamalı — yalnızca sepet ve yöntem saklanır
      partialize: (state) => ({
        items: state.items,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);

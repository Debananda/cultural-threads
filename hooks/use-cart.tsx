import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

import { CartItemType } from "@/types";
import { AlertTriangle } from "lucide-react";

interface CartStore {
  items: CartItemType[];
  addItem: (data: CartItemType) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItemType) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === data.product.id
        );

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      updateItemQuantity(id: string, quantity: number) {
        const currentItems = get().items;
        if (quantity < 1) {
          return toast("Invalid quantity");
        } else {
          const modifiedItems = currentItems.map((item) => {
            if (item.product.id === id) {
              return { ...item, quantity };
            }
            return { ...item };
          });
          set({ items: modifiedItems });
          return toast("Quantity updated");
        }
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.product.id !== id)],
        });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;

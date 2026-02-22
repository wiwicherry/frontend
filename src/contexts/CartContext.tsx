import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "@/lib/api"; // Added to make backend calls

export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartContextType {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void; // <-- NEW: To inject cart on login
  saveShippingAddress: (address: ShippingAddress) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const stored = localStorage.getItem("shippingAddress");
    return stored ? JSON.parse(stored) : { address: "", city: "", postalCode: "", country: "" };
  });

  const persist = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  // --- NEW: Auto-save cart to database in the background ---
  useEffect(() => {
    const syncCart = async () => {
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          try {
            // We use the api instance, but explicitly pass the token just in case
            await api.put('/users/cart', { cartItems }, {
              headers: { Authorization: `Bearer ${userInfo.token}` }
            });
          } catch (error) {
            console.error("Failed to sync cart to database");
          }
        }
      }
    };
    
    // Only run the sync if there's an actual change to prevent unnecessary API calls
    syncCart();
  }, [cartItems]);
  // ---------------------------------------------------------

  const addToCart = (item: CartItem) => {
    const exists = cartItems.find((x) => x._id === item._id);
    const updated = exists
      ? cartItems.map((x) => (x._id === item._id ? { ...x, qty: x.qty + item.qty > x.countInStock ? x.countInStock : x.qty + item.qty } : x))
      : [...cartItems, item];
    persist(updated);
  };

  const removeFromCart = (id: string) => {
    persist(cartItems.filter((x) => x._id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    persist(cartItems.map((x) => (x._id === id ? { ...x, qty } : x)));
  };

  const clearCart = () => {
    persist([]);
  };

  const saveShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address);
    localStorage.setItem("shippingAddress", JSON.stringify(address));
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        shippingAddress, 
        addToCart, 
        removeFromCart, 
        updateQty, 
        clearCart, 
        setCart: persist, // <-- NEW: Expose persist as setCart
        saveShippingAddress, 
        totalItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
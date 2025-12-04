// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, customization = null) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          customization,
        },
      ];
    });
  };

  const removeFromCart = (productId, customization = null) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (customization == null ||
              JSON.stringify(item.customization) ===
                JSON.stringify(customization))
          )
      )
    );
  };

  const updateQuantity = (productId, newQuantity, customization = null) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId, customization);
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          (customization == null ||
            JSON.stringify(item.customization) ===
              JSON.stringify(customization))
        ) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const basePrice = Number(item.product.precioBase || item.product.price || 0);
      const extra =
        (item.customization?.precioExtra != null
          ? Number(item.customization.precioExtra)
          : 0);
      const unit = basePrice + extra;
      return total + unit * Number(item.quantity || 1);
    }, 0);
  };

  const itemCount = cart.reduce(
    (acc, item) => acc + Number(item.quantity || 1),
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};

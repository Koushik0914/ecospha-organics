// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Create the CartProvider component
export const CartProvider = ({ children }) => {
  // State to hold cart items. Each item will be { product, quantity }.
  // Initialize from localStorage for persistence across sessions (basic persistence).
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('ecospha_cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ecospha_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);

  // Function to add a product to the cart or increase its quantity
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);

      if (existingItemIndex > -1) {
        // If product already exists, increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // If product is new, add it with quantity 1
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  // Function to remove a product from the cart or decrease its quantity
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === productId);

      if (existingItemIndex > -1) {
        if (prevItems[existingItemIndex].quantity > 1) {
          // If quantity > 1, decrease quantity
          const newItems = [...prevItems];
          newItems[existingItemIndex].quantity -= 1;
          return newItems;
        } else {
          // If quantity is 1, remove the item entirely
          return prevItems.filter(item => item.product.id !== productId);
        }
      }
      return prevItems; // No change if item not found
    });
  };

  // Function to remove an item completely from the cart
  const removeItemCompletely = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
  };

  // Calculate total number of items in cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate total cart value
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeItemCompletely, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to easily use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
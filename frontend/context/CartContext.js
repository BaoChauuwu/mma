import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const exist = cart.find(i => i._id === product._id);

    if (exist) {
      setCart(cart.map(i =>
        i._id === product._id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setCart(cart.map(i =>
      i._id === id ? { ...i, quantity: qty } : i
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeItem, total, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
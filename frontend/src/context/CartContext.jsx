import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addToCart, getCart, removeFromCart, updateCart } from '../services/api.js';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartItems(response.data || []);
      setSummary(response.summary || { subtotal: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      await addToCart({ productId, quantity });
      await refreshCart();
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      await removeFromCart(cartItemId);
      await refreshCart();
    },
    [refreshCart]
  );

  const updateItemQuantity = useCallback(
    async (cartItemId, quantity) => {
      await updateCart(cartItemId, { quantity });
      await refreshCart();
    },
    [refreshCart]
  );

  const itemCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const value = {
    cartItems,
    summary,
    loading,
    itemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

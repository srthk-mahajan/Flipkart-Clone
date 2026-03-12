import { createContext, useContext, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'flipkartCloneWishlist';

const readWishlistFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(Number).filter((id) => Number.isFinite(id));
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(() => readWishlistFromStorage());

  const persist = (nextIds) => {
    setWishlistIds(nextIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    }
  };

  const toggleWishlist = (productId) => {
    const normalizedId = Number(productId);
    const exists = wishlistIds.includes(normalizedId);
    const nextIds = exists
      ? wishlistIds.filter((id) => id !== normalizedId)
      : [normalizedId, ...wishlistIds];

    persist(nextIds);
  };

  const isWishlisted = (productId) => wishlistIds.includes(Number(productId));

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      toggleWishlist,
      isWishlisted
    }),
    [wishlistIds]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

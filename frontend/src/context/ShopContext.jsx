import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  return []; // Array of cart items {itemId, size, quantity}
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [all_product, setAll_Product] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("auth-token"));

  // Fetch products and cart data on mount
  useEffect(() => {
    fetch("https://e-commerce-8j0j.onrender.com/all-products")
      .then((res) => res.json())
      .then((data) => setAll_Product(data))
      .catch((err) => console.error("Error fetching products:", err));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetchCartData(token);
    }
  }, []);

  // Fetch cart from backend
  const fetchCartData = (token) => {
    fetch("https://e-commerce-8j0j.onrender.com/getcart", {
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
      body: "",
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data || []))
      .catch((err) => console.error("Error fetching cart:", err));
  };

  // Sync the whole cart to backend
  const syncCartWithBackend = (cart) => {
    if (isLoggedIn) {
      fetch("https://e-commerce-8j0j.onrender.com/update-cart", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartData: cart }),
      }).catch((err) => console.error("Error syncing cart:", err));
    }
  };

  const addToCart = (itemId, size) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.itemId === itemId && item.size === size
      );
      let updatedItems;
      if (existingIndex >= 0) {
        updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
      } else {
        updatedItems = [...prevItems, { itemId, size, quantity: 1 }];
      }
      syncCartWithBackend(updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.itemId === itemId && item.size === size
      );
      if (existingIndex < 0) return prevItems;

      let updatedItems = [...prevItems];
      if (updatedItems[existingIndex].quantity > 1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity - 1,
        };
      } else {
        updatedItems.splice(existingIndex, 1);
      }
      syncCartWithBackend(updatedItems);
      return updatedItems;
    });
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => {
      const product = all_product.find((p) => p.id === item.itemId);
      return total + (product?.new_price || 0) * item.quantity;
    }, 0);
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogin = async (token) => {
    localStorage.setItem("auth-token", token);
    setIsLoggedIn(true);
    await fetchCartData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setIsLoggedIn(false);
    setCartItems(getDefaultCart());
  };

  const contextValue = {
    all_product,
    cartItems,
    isLoggedIn,
    addToCart,
    removeFromCart,
    getTotalCartValue,
    getTotalCartItems,
    handleLogin,
    handleLogout,
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;

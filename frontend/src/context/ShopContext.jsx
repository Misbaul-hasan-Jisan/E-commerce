import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    return []; // Now we'll use an array of cart items instead of an object
}

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_product, setAll_Product] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth-token'));

    // Fetch products and cart data
    useEffect(() => {
        // Fetch products
        fetch('http://localhost:3000/all-products')
            .then(res => res.json())
            .then(data => setAll_Product(data));

        // Fetch cart if logged in
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetchCartData(token);
        }
    }, []);

    const fetchCartData = (token) => {
        fetch('http://localhost:3000/getcart', {
            method: 'POST',
            headers: {
                'auth-token': token,
                'Content-Type': 'application/json'
            },
            body: ""
        })
        .then(res => res.json())
        .then(data => setCartItems(data || []))
        .catch(err => console.error('Error fetching cart:', err));
    }

    const getTotalCartValue = () => {
        return cartItems.reduce((total, item) => {
            const product = all_product.find(p => p.id === item.itemId);
            return total + (product?.new_price || 0) * item.quantity;
        }, 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const addToCart = (itemId, size) => {
        setCartItems(prevItems => {
            // Check if item with same ID and size already exists in cart
            const existingItemIndex = prevItems.findIndex(
                item => item.itemId === itemId && item.size === size
            );
            
            if (existingItemIndex >= 0) {
                // If exists, increase quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return updatedItems;
            } else {
                // If new, add to cart with quantity 1
                return [...prevItems, { itemId, size, quantity: 1 }];
            }
        });

        if (isLoggedIn) {
            fetch('http://localhost:3000/addtocart', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId, size })
            })
            .catch(err => console.error('Error adding to cart:', err));
        }
    };

    const removeFromCart = (itemId, size) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.itemId === itemId && item.size === size
            );
            
            if (existingItemIndex >= 0) {
                const updatedItems = [...prevItems];
                if (updatedItems[existingItemIndex].quantity > 1) {
                    // Decrease quantity if more than 1
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: updatedItems[existingItemIndex].quantity - 1
                    };
                } else {
                    // Remove item if quantity is 1
                    updatedItems.splice(existingItemIndex, 1);
                }
                return updatedItems;
            }
            return prevItems;
        });

        if (isLoggedIn) {
            fetch('http://localhost:3000/removefromcart', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId, size })
            })
            .catch(err => console.error('Error removing from cart:', err));
        }
    };

    const handleLogin = async (token) => {
        localStorage.setItem('auth-token', token);
        setIsLoggedIn(true);
        await fetchCartData(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
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
        handleLogout
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
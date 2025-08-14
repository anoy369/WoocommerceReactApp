// App.jsx
import "./Api.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Loader from "./layouts/Loader";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyAccount from "./pages/MyAccount";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import SingleProduct from "./pages/SingleProduct";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import "./assets/loader.css";
import { useEffect, useState } from "react";
import { onLoadingChange } from "./Api";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("auth_token"));
  const [loggedInUserData, setLoggedInUserData] = useState(() => {
    const data = localStorage.getItem("user_data");
    return data ? JSON.parse(data) : {};
  });

  // Subscribe to loader changes
  useEffect(() => {
    const unsubscribe = onLoadingChange(setLoading);

    // Sync auth state on load
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true);
    }

    const userData = localStorage.getItem("user_data");
    if (userData) {
      setLoggedInUserData(JSON.parse(userData));
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Add to Cart Function
  const addProductsToCart = (productToAdd) => {
    const quantityToAdd = productToAdd.quantity || 1;

    // Get current cart from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if same product and variation already exists
    const existingItem = cartItems.find((item) => {
      const isSameProduct = item.id === productToAdd.id;
      const isSameVariation =
        !productToAdd.variation_id || item.variation_id === productToAdd.variation_id;
      return isSameProduct && isSameVariation;
    });

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantityToAdd;
    } else {
      const newItem = { ...productToAdd, quantity: quantityToAdd };
      cartItems.push(newItem);
    }

    // Update state and localStorage
    setCart([...cartItems]);
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // Show success toast
    toast.success(`${quantityToAdd}x ${productToAdd.name} added to cart!`);
  };

  // Remove from Cart Function
  const removeItemsFromCart = (product) => {
  const updatedCart = cart.filter((item) => {
    const isSameProduct = item.id === product.id;
    const isSameVariation =
      (item.variation_id && product.variation_id && item.variation_id === product.variation_id) ||
      (!item.variation_id && !product.variation_id);
    return !(isSameProduct && isSameVariation);
  });

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  toast.success("Product removed from cart!");
};

  // Update login status
  const setUserLoggedinStatus = (status) => {
    setIsAuthenticated(status);
  };

  // User Logout
  const setUserLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("orderItems");
    setIsAuthenticated(false);
    setLoggedInUserData({});
    toast.info("You've been logged out.");
  };

  // Clear Cart (e.g., after checkout)
  const clearCartItem = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <>
      <Router>
        <NavBar
          setUserLogout={setUserLogout}
          isAuthenticated={isAuthenticated}
          cartItem={cart}
        />
        <div className="h-100">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          {loading && <Loader />}
          <Routes>
            <Route path="/" element={<Home onAddToCart={addProductsToCart} />} />
            <Route
              path="/cart"
              element={
                <Cart
                  isAuthenticated={isAuthenticated}
                  onRemoveProduct={removeItemsFromCart}
                  cart={cart}
                  setCart={setCart}
                />
              }
            />
            <Route
              path="/my-account"
              element={<MyAccount loggedInUserData={loggedInUserData} />}
            />
            <Route
              path="/my-orders"
              element={
                <MyOrders
                  setLoading={setLoading}
                  loggedInUserData={loggedInUserData}
                />
              }
            />
            <Route
              path="/products"
              element={<Products onAddToCart={addProductsToCart} />}
            />
            <Route
              path="/login"
              element={
                <Auth
                  setLoggedInUserData={setLoggedInUserData}
                  isAuthenticated={setUserLoggedinStatus}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  loggedInUserData={loggedInUserData}
                  clearCartItem={clearCartItem}
                />
              }
            />
            <Route
              path="/product/:id"
              element={<SingleProduct onAddToCart={addProductsToCart} />}
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
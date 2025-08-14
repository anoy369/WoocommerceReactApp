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
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loggedInUserData, setLoggedInUserData] = useState({})

  // Subscribe to loader changes
  useEffect(() => {
    const unsubscribe = onLoadingChange(setLoading);

    const token = localStorage.getItem("auth_token")

    if (token){
      setUserLoggedinStatus(true)
    }

    // const cartItems = JSON.parse(localStorage.getItem("cart")) || []
    // setCart(cartItems)

    const userData = localStorage.getItem("user_data")
    setLoggedInUserData(userData)

    return () => {
      unsubscribe();
    };
  }, []);


  // Add to cart Function
  const addProductsToCart = (productToAdd) => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if same product AND same variation (if applicable) already in cart
  const existingItem = cartItems.find(item => {
    const isSameProduct = item.id === productToAdd.id;
    const isSameVariation = !productToAdd.variation_id || item.variation_id === productToAdd.variation_id;
    return isSameProduct && isSameVariation;
  });

  if (existingItem) {
    existingItem.quantity += productToAdd.quantity;
  } else {
    const newItem = { ...productToAdd };
    cartItems.push(newItem);
  }

  setCart([...cartItems]);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  toast.success(`${productToAdd.quantity}x ${productToAdd.name} added to cart!`);
};

  //Remove from cart function
  const removeItemsFromCart = (product) => {
    if(window.confirm("Are you Sure, You want to remove this item from cart?")){
      const updatedCart = cart.filter(item => item.id !== product.id)

      setCart(updatedCart)

      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast.success("Product has been removed from the Cart!")
    }
  }

  // Set login status after login 
  const setUserLoggedinStatus = (status) => {
    setIsAuthenticated(status)
  }

  // User Logout 
  const setUserLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data") 
    localStorage.removeItem("orderItems")
    setUserLoggedinStatus(false)
  }

  const clearCartItem = () =>{
    localStorage.removeItem("cart")
    setCart([])
  }

  return (
    <>
      <Router>
        <NavBar setUserLogout={setUserLogout} isAuthenticated={isAuthenticated} cartItem={cart} />
        <div className="h-100">
          <ToastContainer />
          {loading && <Loader />}
          <Routes>
            <Route path="/" element={<Home onAddToCart={addProductsToCart}/>}/>
            <Route path="/cart" element={<Cart isAuthenticated={isAuthenticated} onRemoveProduct={removeItemsFromCart} cart={cart} setCart={setCart}/>} />
            <Route path="/my-account" element={<MyAccount loggedInUserData={loggedInUserData} />} />
            <Route path="/my-orders" element={<MyOrders setLoading={setLoading} loggedInUserData={loggedInUserData} />} />
            <Route path="/products" element={<Products onAddToCart={ addProductsToCart } />} />
            <Route path="/login" element={<Auth setLoggedInUserData={setLoggedInUserData} isAuthenticated={setUserLoggedinStatus} />} />
            <Route path="/checkout" element={<Checkout loggedInUserData={loggedInUserData} clearCartItem={clearCartItem} />} />
            <Route path="/product/:id" element={<SingleProduct onAddToCart={ addProductsToCart } />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
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

  // Subscribe to loader changes
  useEffect(() => {
    const unsubscribe = onLoadingChange(setLoading);
    return () => {
      unsubscribe();
    };
  }, []);


  // Add to cart Function
  const addProductsToCart = (product) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    const productExists = cart.find( item => item.id === product.id )

    if(productExists){

      productExists.quantity += 1
    
    } else {  
    
      product.quantity = 1
      cart.push(product)
    
    }    

    setCart([...cart])
    localStorage.setItem("cart", JSON.stringify(cart))

    toast.success("Product added to Cart!")
    console.log(product)
  }

  //Remove from cart function
  const removeItemsFromCart = (product) => {
    if(window.confirm("Are you Sure, You want to remove this item from cart?")){
      const updatedCart = cart.filter(item => item.id !== product.id)

      setCart(updatedCart)

      localStorage.setItem("cart", JSON.stringify(updatedCart))

      toast.success("Product has been removed from the Cart!")
    }
  }
  return (
    <>
      <Router>
        <NavBar cartItem={cart} />
        <div className="container h-100">
          <ToastContainer />
          {loading && <Loader />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart onRemoveProduct={removeItemsFromCart} cart={cart} />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/products" element={<Products onAddToCart={ addProductsToCart } />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<SingleProduct onAddToCart={ addProductsToCart } />} />
          </Routes>
        </div>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
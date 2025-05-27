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

import "./App.css";
import "./assets/loader.css";
import { useEffect, useState } from "react";
import { onLoadingChange } from "./Api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(false);

  // Subscribe to loader changes
  useEffect(() => {
    const unsubscribe = onLoadingChange(setLoading);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Router>
        <NavBar />
        <div className="container">
          {loading && <Loader />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<SingleProduct />} />
          </Routes>
        </div>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
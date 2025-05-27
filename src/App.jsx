import './Api.js'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import NavBar from './layouts/Navbar'
import Footer from './layouts/Footer'
import Home from './pages/Home'
import Cart from './pages/Cart'
import MyAccount from './pages/MyAccount'
import MyOrders from './pages/MyOrders'
import Checkout from './pages/Checkout'
import Products from './pages/Products'
import Auth from './pages/Auth'


import './App.css'
import SingleProduct from './pages/SingleProduct'

function App() {

  return (
    <>
      <Router>
        <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<SingleProduct />} />
          </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App

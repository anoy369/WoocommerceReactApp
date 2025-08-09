import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productImage from "../assets/placeholder-image.jpg";
import { FiPlusCircle, FiMinusCircle, FiTrash2 } from "react-icons/fi";

const Cart = ({ onRemoveProduct, cart, isAuthenticated, setCart }) => {
  const navigate = useNavigate();

  // Render product price
  const renderProductPrice = (product) => {
    if (product.sale_price) {
      return <>${product.sale_price}</>;
    }
    return <>${product.regular_price || product.price}</>;
  };

  // Calculate total price
  const calculateTotalItemsPrice = () => {
    return cart
      .reduce((total, item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Load cart from localStorage (helper)
  const getCartFromStorage = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };

  // Increase quantity
  const increaseQuantity = (product) => {
    const updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); // Update App state
  };

  // Decrease quantity
  const decreaseQuantity = (product) => {
    const updatedCart = cart
      .map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); // Update App state
  };

  const goToCheckoutPage = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container" style={{ minHeight: "50vh" }}>
      <h1 className="my-4">Cart</h1>

      {cart.length > 0 ? (
        <div id="cart-items">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className="rounded"
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].src
                          : productImage
                      }
                      alt={product.name}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{renderProductPrice(product)}</td>
                  <td className="text-center">
                    <span className="d-flex align-items-center justify-content-between">
                    <FiMinusCircle role="button" onClick={() => decreaseQuantity(product)}/>
                    {product.quantity}
                    <FiPlusCircle role="button" onClick={() => increaseQuantity(product)}/>
                    </span>                    
                  </td>
                  <td className="text-center">
                    <FiTrash2 role="button" onClick={() => onRemoveProduct(product)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row align-items-center">
            <div className="col">
              <h3>Total: ${calculateTotalItemsPrice()}</h3>
            </div>
            <div className="col text-end">
              <button className="btn btn-success" onClick={goToCheckoutPage}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div id="empty-cart-message">
          <h2 className="text-danger">Your cart is empty.</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
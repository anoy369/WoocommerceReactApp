// pages/Cart.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productImage from "../assets/placeholder-image.jpg";
import { FiPlusCircle, FiMinusCircle, FiTrash2 } from "react-icons/fi";
import { Button, Table } from "react-bootstrap";
import swal from "sweetalert";

const Cart = ({ onRemoveProduct, cart, isAuthenticated, setCart }) => {
  const navigate = useNavigate();

  // Calculate total price
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Increase quantity
  const increaseQuantity = (product) => {
    const updatedCart = cart.map((item) => {
      const isSameProduct = item.id === product.id;
      const isSameVariation =
        (item.variation_id &&
          product.variation_id &&
          item.variation_id === product.variation_id) ||
        (!item.variation_id && !product.variation_id);

      return isSameProduct && isSameVariation
        ? { ...item, quantity: item.quantity + 1 }
        : item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (product) => {
    const updatedCart = cart
      .map((item) => {
        const isSameProduct = item.id === product.id;
        const isSameVariation =
          (item.variation_id &&
            product.variation_id &&
            item.variation_id === product.variation_id) ||
          (!item.variation_id && !product.variation_id);

        return isSameProduct && isSameVariation
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item;
      })
      .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Remove item with SweetAlert
  const removeItem = (product) => {
    swal({
      title: "Remove Item?",
      text: `Are you sure you want to remove "${product.name}" from your cart?`,
      icon: "warning",
      buttons: ["Cancel", "Yes, Remove"],
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        const updatedCart = cart.filter((item) => {
          const isSameProduct = item.id === product.id;
          const isSameVariation =
            (item.variation_id &&
              product.variation_id &&
              item.variation_id === product.variation_id) ||
            (!item.variation_id && !product.variation_id);
          return !(isSameProduct && isSameVariation);
        });

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        onRemoveProduct?.(product);

        swal(
          "Removed!",
          `${product.name} has been removed from your cart.`,
          "success"
        );
      }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    swal({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Clear All"],
      dangerMode: true,
    }).then((willClear) => {
      if (willClear) {
        localStorage.removeItem("cart");
        setCart([]);
        swal("Cart Cleared", "Your shopping cart is now empty.", "info");
      }
    });
  };

  // Go to checkout
  const goToCheckoutPage = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      swal({
        title: "Login Required",
        text: "You need to log in to proceed to checkout.",
        icon: "info",
        buttons: "OK",
      }).then(() => {
        navigate("/login");
      });
    }
  };

  if (!cart || cart.length === 0) {
    swal({
      title: "Your cart is empty",
      text: "Looks like you haven't added any products yet.",
      icon: "info",
      buttons: "Start Shopping",
    }).then(() => {
      navigate("/products");
    });

    return null;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Shopping Cart</h2>
        <Button variant="outline-danger" size="sm" onClick={clearCart}>
          <FiTrash2 /> Clear Cart
        </Button>
      </div>

      <Table hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => {
            const itemTotal = (
              parseFloat(product.price) * product.quantity
            ).toFixed(2);

            // ✅ Use the image stored in the cart (from variation if available)
            // In Cart.js
            const displayImage =
              product.image?.src ||
              product.images?.[0]?.src ||
              "/placeholder.jpg";

            return (
              <tr key={product.variation_id || product.id}>
                <td>
                  <div className="d-flex align-items-center">
                    {/* Show variation image if available */}
                    <img
                      src={displayImage}
                      alt={product.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div className="ms-3">
                      <h6 className="mb-1">{product.name}</h6>
                      {product.attributes && product.attributes.length > 0 && (
                        <small className="text-muted d-block">
                          {product.attributes.map((a) => (
                            <span key={a.name}>
                              <strong>{a.name}:</strong> {a.option}
                              <br />
                            </span>
                          ))}
                        </small>
                      )}
                    </div>
                  </div>
                </td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td className="text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => decreaseQuantity(product)}
                      style={{ padding: "0", width: "34px", height: "34px" }}
                    >
                      <FiMinusCircle size={16} />
                    </Button>
                    <span
                      className="d-inline-block px-2"
                      style={{ minWidth: "24px" }}
                    >
                      {product.quantity}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => increaseQuantity(product)}
                      style={{ padding: "0", width: "34px", height: "34px" }}
                    >
                      <FiPlusCircle size={16} />
                    </Button>
                  </div>
                </td>
                <td className="fw-bold">${itemTotal}</td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeItem(product)}
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Order Summary */}
      <div className="row justify-content-end mt-4">
        <div className="col-md-5">
          <div className="border p-4 rounded shadow-sm">
            <h4 className="mb-4">Order Summary</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>
                Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </span>
              <strong>${calculateTotal()}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5">
              <strong>Total</strong>
              <strong>${calculateTotal()}</strong>
            </div>
            <Button
              size="lg"
              className="w-100 mt-3"
              disabled={!isAuthenticated}
              onClick={goToCheckoutPage}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

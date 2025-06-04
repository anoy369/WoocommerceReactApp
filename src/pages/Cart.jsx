import { useEffect, useState } from "react";
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";
import productImage from "../assets/placeholder-image.jpg";

const Cart = ({onRemoveProduct, cart}) => {

  const [cartItems, setCartItem] = useState(cart)
  const navigate = useNavigate();


  useEffect(() => {
    
    setCartItem(cart)
  }, [cart]);


  const goToCheckoutPage = () => {
    navigate("/checkout")
  }

  const renderProductPrice = (product) => {
    if(product.sale_price){
      return <>
        ${product.sale_price}
      </>
    }
    return <>
      ${product.regular_price || product.price }
    </>
  }

  const calculateTotalItemsPrice = () => {
    return cartItems.reduce( (total, item) => {
      const price = item.price ? parseFloat(item.price) : 0
      return total + (price * item.quantity)
    }, 0).toFixed(2)
  }

  return (
    <>
      <div className="container" style={{"minHeight": "50vh"}}>
        <h1 className="my-4">Cart</h1>
        {
          cartItems.length > 0 ? (
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
                    {
                        cartItems.map ((singleProduct, index) => 
                            <tr key={index}>
                                <td>
                                <img
                                    src={singleProduct?.images && singleProduct.images.length > 0 
                                          ? singleProduct.images[0].src 
                                          : productImage}
                                    alt={singleProduct.name}
                                    style={{ width: '50px' }}
                                />
                                </td>
                                <td>{singleProduct.name}</td>
                                <td>{renderProductPrice(singleProduct)}</td>
                                <td>{singleProduct.quantity}</td>
                                <td>
                                <button className="btn btn-danger" onClick={ () => onRemoveProduct(singleProduct)}>Remove</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
              </table>
              <div className="row align-items-center">
                <div className="col">
                  <h3>Total: ${calculateTotalItemsPrice()}</h3>
                </div>
                <div className="col text-end">
                  <button className="btn btn-success" onClick={goToCheckoutPage}>Checkout</button>
                </div>
              </div>
            </div>

          ) : (
            <div id="empty-cart-message">
              <h2 className="text-danger">Your cart is empty.</h2>
            </div>
          )
        }
      </div>
    </>
  );
};

export default Cart;

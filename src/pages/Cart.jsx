import { useEffect, useState } from "react";
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const totalPrice = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  useEffect(() => {
    setProducts([
      {
        image: "../src/assets/washing-machine-2.jpg",
        title: "Product 1",
        price: 59,
        quantity: 2,
      },
      {
        image: "../src/assets/washing-machine-2.jpg",
        title: "Product 2",
        price: 69,
        quantity: 1,
      },
      {
        image: "../src/assets/washing-machine-2.jpg",
        title: "Product 3",
        price: 999,
        quantity: 4,
      },
    ]);
  }, []);


  const goToCheckoutPage = () => {
    navigate("/checkout")
  }

  return (
    <>
      <div className="container">
        <h1 className="my-4">Cart</h1>
        <div id="cart-items">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {
                    products.map ((SingleProduct, index) => 
                        <tr key={index}>
                            <td>
                            <img
                                src={SingleProduct.image}
                                alt={SingleProduct.title}
                                style={{ width: '50px' }}
                            />
                            </td>
                            <td>{SingleProduct.title}</td>
                            <td>{SingleProduct.price}</td>
                            <td>{SingleProduct.quantity}</td>
                            <td>
                            <button className="btn btn-danger">Remove</button>
                            </td>
                        </tr>
                    )
                }
            </tbody>
          </table>
          <div className="row align-items-center">
            <div className="col">
              <h3>Total: ${totalPrice}</h3>
            </div>
            <div className="col text-end">
              <button className="btn btn-success" onClick={goToCheckoutPage}>Checkout</button>
            </div>
          </div>
        </div>

        <div id="empty-cart-message">
          <p>Your cart is empty.</p>
        </div>
      </div>
    </>
  );
};

export default Cart;

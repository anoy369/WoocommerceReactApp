import { useState } from "react";
import { createAnOrder } from "../Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = ({clearCartItem}) => {
  const navigate = useNavigate()

  const [checkoutData, setCheckoutData] = useState({
    payment_details: {
      method_id: "bacs",
      method_title: "Cash on Delivery",
      paid: false,
    },
    billing_address: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: "",
      phone: "",
    },
  });

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;

    setCheckoutData((prevFormData) => ({
      ...prevFormData,
      billing_address: {
        ...prevFormData.billing_address,
        [name]: value,
      },
    }));
  };

  const handleCheckoutSubmit = (event) => {
    try {
      event.preventDefault();

      createAnOrder(checkoutData).then( () => {
        toast.success("Order placed successfully")
        clearCartItem()
        navigate("/products")
      } )

      setCheckoutData({
        payment_details: {
          method_id: "bacs",
          method_title: "Cash on Delivery",
          paid: false,
        },
        billing_address: {
          first_name: "",
          last_name: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          email: "",
          phone: "",
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
    console.log(checkoutData);
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="mb-4">Checkout</h1>
        <form onSubmit={handleCheckoutSubmit}>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="firstname" className="form-label">
                First Name:
              </label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.first_name}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="lastname" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.last_name}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="address" className="form-label">
                Address:
              </label>
              <input
                type="text"
                className="form-control"
                name="address_1"
                onChange={handleOnChangeInput}
                value={
                  checkoutData.billing_address.address_1 +
                  checkoutData.billing_address.address_2
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="city" className="form-label">
                City:
              </label>
              <input
                type="text"
                className="form-control"
                name="city"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.city}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="state" className="form-label">
                State:
              </label>
              <input
                type="text"
                className="form-control"
                name="state"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.state}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="postcode" className="form-label">
                Postcode:
              </label>
              <input
                type="text"
                className="form-control"
                name="postcode"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.postcode}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="country" className="form-label">
                Country:
              </label>
              <input
                type="text"
                className="form-control"
                name="country"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.country}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.email}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone:
              </label>
              <input
                type="text"
                className="form-control"
                name="phone"
                onChange={handleOnChangeInput}
                value={checkoutData.billing_address.phone}
              />
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;

import { useState } from "react";
import { createAnOrder } from "../Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = ({ clearCartItem, loggedInUserData }) => {
  const navigate = useNavigate();

  // Safely parse or use object
  const userData =
    typeof loggedInUserData === "string"
      ? JSON.parse(loggedInUserData)
      : loggedInUserData || {};

  const [checkoutData, setCheckoutData] = useState({
    customer_id: userData.id || 0,
    payment_method: "cod",
    payment_method_title: "Cash on Delivery",
    set_paid: false,
    billing: {
      first_name: "",
      last_name: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: userData.email || "",
      phone: "",
    },
  });

  const handleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: value,
      },
    }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!checkoutData.billing.first_name || !checkoutData.billing.last_name) {
        toast.error("Please enter your first and last name.");
        return;
      }
      if (!checkoutData.billing.address_1 || !checkoutData.billing.city) {
        toast.error("Please fill in address and city.");
        return;
      }
      if (!checkoutData.billing.email) {
        toast.error("Email is required.");
        return;
      }

      // Create order
      await createAnOrder(checkoutData);

      toast.success("Order placed successfully!");
      clearCartItem();
      navigate("/my-orders");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Checkout</h1>
      <form onSubmit={handleCheckoutSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="first_name" className="form-label">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={checkoutData.billing.first_name}
              onChange={handleOnChangeInput}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="last_name" className="form-label">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={checkoutData.billing.last_name}
              onChange={handleOnChangeInput}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="address_1" className="form-label">
              Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="address_1"
              value={checkoutData.billing.address_1}
              onChange={handleOnChangeInput}
              placeholder="Street address"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="city" className="form-label">
              City <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={checkoutData.billing.city}
              onChange={handleOnChangeInput}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="state" className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={checkoutData.billing.state}
              onChange={handleOnChangeInput}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="postcode" className="form-label">Postcode</label>
            <input
              type="text"
              className="form-control"
              name="postcode"
              value={checkoutData.billing.postcode}
              onChange={handleOnChangeInput}
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="country" className="form-label">
              Country <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={checkoutData.billing.country}
              onChange={handleOnChangeInput}
              placeholder="e.g. US, UK, BD"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={checkoutData.billing.email}
              onChange={handleOnChangeInput}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={checkoutData.billing.phone}
              onChange={handleOnChangeInput}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success btn-lg px-5">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
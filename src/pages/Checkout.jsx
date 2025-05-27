import { useState } from "react";

const Checkout = () => {
  const [checkoutData, setCheckoutData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    state: "",
    city: "",
    postcode: "",
    country: "",
    email: "",
    phone: "",
  });

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;

    setCheckoutData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    console.log(checkoutData);

    setCheckoutData({
      firstname: "",
      lastname: "",
      address: "",
      state: "",
      city: "",
      postcode: "",
      country: "",
      email: "",
      phone: "",
    });
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
                name="firstname"
                onChange={handleOnChangeInput}
                value={checkoutData.firstname}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="lastname" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                name="lastname"
                onChange={handleOnChangeInput}
                value={checkoutData.lastname}
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
                name="address"
                onChange={handleOnChangeInput}
                value={checkoutData.address}
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
                value={checkoutData.city}
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
                value={checkoutData.state}
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
                value={checkoutData.postcode}
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
                value={checkoutData.country}
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
                value={checkoutData.email}
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
                value={checkoutData.phone}
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

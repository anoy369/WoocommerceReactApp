import { useParams } from "react-router-dom";

import productImage from "../assets/washing-machine-2.jpg";
import { useEffect, useState } from "react";
import { getSingleProductData } from "../Api";

const SingleProduct = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const data = await getSingleProductData(id);
      setProductDetails(data);
      
      console.log(data);
    };

    fetchSingleProduct();
  }, [id]);

  // const imgsrc= productDetails?.images[0]?.src
  console.log(productDetails?.images)
  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <img
                className="card-img-top"
                src={productDetails?.images[0]?.src}
                alt={productDetails.name}
              />
            </div>
          </div>
          <div className="col-md-6">
            <h1 className="my-4">{productDetails.name}</h1>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: productDetails.description,
              }}
            ></div>
            <div className="mb-4">
              <h5>Price:</h5>
              <span
                className="card-text"
                style={{
                  textDecoration: productDetails.sale_price
                    ? "line-through"
                    : "none",
                  color: "red",
                }}
              >
                ${productDetails.regular_price || productDetails.price}
              </span>
              <span
                className="card-text"
                style={{
                  display: productDetails.sale_price ? "block" : "none",
                }}
              >
                ${productDetails.sale_price}
              </span>
            </div>
            <div className="mb-4">
              <h5>
                Category: {productDetails.categories.map((category) => category.name).join(", ")}
              </h5>
            </div>
            <button className="btn btn-primary mt-4">Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;

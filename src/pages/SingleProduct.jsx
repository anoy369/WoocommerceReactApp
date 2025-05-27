import { useParams } from "react-router-dom";

import productImage from "../assets/placeholder-image.jpg";
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
  // console.log(productDetails?.images)
  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <img
                className="card-img-top"
                src={productDetails?.images && productDetails.images.length > 0 
      ? productDetails.images[0].src 
      : productImage}
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
                  "margin-right": "10px"
                }}
              >
                ${productDetails.regular_price || productDetails.price}
              </span>
              <span
                className="card-text"
                style={{
                  display: productDetails.sale_price ? "unset" : "none"
                }}
              >
                ${productDetails.sale_price}
              </span>
            </div>
            <div className="mb-4">
              <h5>
                Category: {productDetails?.categories?.map((singleCategory) => singleCategory.name).join(", ")}
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

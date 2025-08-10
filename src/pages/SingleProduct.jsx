import { useParams } from "react-router-dom";

import productImage from "../assets/placeholder-image.jpg";
import { useEffect, useState } from "react";
import { getSingleProductData } from "../Api";
import { BsCart4 } from "react-icons/bs";

const SingleProduct = ({onAddToCart}) => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const data = await getSingleProductData(id);
      setProductDetails(data);
    };

    fetchSingleProduct();
  }, [id]);

  const renderProductPrice = (product) => {
    if(product.sale_price){
      return <>
        <span className="text-muted text-text-decoration-line-through">${product.regular_price}</span>
        <span className="text-danger">${product.sale_price}</span>
      </>
    }
    return <>
      ${product.regular_price || product.price }
    </>
  }


  return (
    <>
      <div className="container single-product-container my-5">
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
            <h1>{productDetails.name}</h1>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: productDetails.description,
              }}
            ></div>
            <div className="mb-4">
              <h5>Price:</h5>
                <div>
                  <span
                    className="fw-bold"
                    style={{
                      textDecoration: productDetails.sale_price ? "line-through" : "none",
                      color: productDetails.sale_price ? "red" : "black",
                      marginRight: productDetails.sale_price ? "10px" : "0",
                    }}
                  >
                    ${productDetails.regular_price || productDetails.price}
                  </span>
                  {productDetails.sale_price && (
                    <span className="fw-bold text-primary">${productDetails.sale_price}</span>
                  )}
                </div>
            </div>
            <div>
              <h5>
                Category: {productDetails?.categories?.map((singleCategory) => singleCategory.name).join(", ")}
              </h5>
            </div>
            <button className="btn btn-primary mt-4" onClick={ () => onAddToCart(SingleProduct) }><BsCart4/> Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Api";

const Products = ( {onAddToCart} ) => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleSingleProductPageRedirection = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <>
      <div className="container">
        <h1 className="my-4">Products</h1>
        <div className="row">
          {products.map((singleProduct, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
              <div className="card product-card">
                <img
                  className="card-img-top"
                  src={singleProduct.images[0].src}
                  alt={singleProduct.name}
                />
                <div className="card-body text-center">
                  <h5
                    className="card-title"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSingleProductPageRedirection(singleProduct.id)}
                  >
                    {singleProduct.name}
                  </h5>
                  <div className="d-flex align-items-center justify-content-center">
                  <span
                    className="card-text  fw-bold"
                    style={{
                      textDecoration: singleProduct.sale_price
                        ? "line-through"
                        : "none",
                        color: singleProduct.sale_price
                        ? "red"
                        : "none",
                        marginRight: singleProduct.sale_price
                        ? "10px"
                        : "none",
                    }}
                  >
                    ${singleProduct.regular_price || singleProduct.price}
                  </span>
                  <span
                    className="card-text fw-bold"
                    style={{
                      display: singleProduct.sale_price ? "block" : "none",
                    }}
                  >
                    ${singleProduct.sale_price}
                  </span>
                  </div>
                  <p className="card-text">
                    Category:{" "}
                    {singleProduct.categories
                      .map((category) => category.name)
                      .join(", ")}
                  </p>
                  <button className="btn btn-primary" onClick={ () => onAddToCart(singleProduct) }>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Api";
import { BsCart4 } from "react-icons/bs";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Products = ( {onAddToCart} ) => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const data = await getAllProducts();
      setProducts(data);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
    };
    fetchProducts();
  }, []);

  const handleSingleProductPageRedirection = (productId) => {
    navigate(`/product/${productId}`);
  };

  const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
    slidesToSlide: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  }
};
  return (
    <>
      <div className="product-hero container-fluid text-center h-75 d-flex align-items-center justify-content-center bg-dark">
        
        <h1 className="text-white z-index-2">Products</h1>
      </div>
      <div className="container">
        <h2 className="my-4">Popular Products</h2>
        <div className="row popular-products">          
          <Carousel responsive={responsive} >
            {products
              .filter(product => product.featured)
              .map((product) => (
                <div key={product.id}>
                  <div className="card product-card">
                    <img
                      className="card-img-top"
                      src={product.images[0]?.src || "placeholder.jpg"}
                      alt={product.name}
                    />
                    <div className="card-body text-center">
                      <h5
                        className="card-title"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSingleProductPageRedirection(product.id)}
                      >
                        {product.name}
                      </h5>
                      <div className="d-flex align-items-center justify-content-center">
                        <span
                          className="card-text fw-bold"
                          style={{
                            textDecoration: product.sale_price ? "line-through" : "none",
                            color: product.sale_price ? "red" : "black",
                            marginRight: product.sale_price ? "10px" : "0"
                          }}
                        >
                          ${product.regular_price || product.price}
                        </span>
                        {product.sale_price && (
                          <span className="card-text fw-bold">
                            ${product.sale_price}
                          </span>
                        )}
                      </div>
                      <p className="card-text">
                        Category:{" "}
                        {product.categories.map(cat => cat.name).join(", ")}
                      </p>
                      <button
                        className="btn btn-primary lh-1"
                        onClick={() => onAddToCart(product)}
                      >
                        <BsCart4 /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </Carousel>
        </div>
        <h2 className="my-4">All Products</h2>
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
                  <button className="btn btn-primary lh-1" onClick={ () => onAddToCart(singleProduct) }><BsCart4 /> Add to Cart</button>
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

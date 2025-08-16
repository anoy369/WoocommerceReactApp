// components/BestSellersCarousel.js
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BsCart4 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const BestSellersCarousel = ({ products = [], onAddToCart }) => {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      setIsLoading(false);
      return;
    }

    // Use featured products as best sellers
    let sellers = products.filter((p) => p.featured === true);

    // Fallback: if no featured products, show latest products (by ID)
    if (sellers.length === 0) {
      sellers = [...products].sort((a, b) => b.id - a.id);
    }

    // Limit to 8 items
    setBestSellers(sellers.slice(0, 8));
    setIsLoading(false);
  }, [products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1800 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1800, min: 1200 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1200, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    smallMobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (isLoading) {
    return (
      <section className="my-5">
        <div className="text-center">
          <p className="text-muted">Loading best sellers...</p>
        </div>
      </section>
    );
  }

  if (bestSellers.length === 0) {
    return (
      <section className="my-5">
        <div className="text-center">
          <p className="text-muted">No best sellers available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-5">
      <h2 className="mb-4 text-center">Best Sellers</h2>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        showDots={false}
        className="best-sellers-carousel"
      >
        {bestSellers.map((product) => (
          <div key={product.id} className="p-2">
            <div
              className="card h-100 d-flex flex-column shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.images[0]?.src || "/placeholder.jpg"}
                alt={product.name}
                style={{ height: "180px", objectFit: "cover" }}
                className="card-img-top"
              />
              <div className="card-body d-flex flex-column">
                <h6
                  className="card-title"
                  
                  title={product.name}
                >
                  {product.name}
                </h6>

                {/* Price */}
                <div className="d-flex align-items-center mt-1">
                  <span
                    className="fw-bold"
                    style={{
                      textDecoration: product.sale_price ? "line-through" : "none",
                      color: product.sale_price ? "#dc3545" : "black",
                      fontSize: "0.95rem",
                    }}
                  >
                    ${parseFloat(product.regular_price || product.price).toFixed(2)}
                  </span>
                  {product.sale_price && (
                    <span className="fw-bold ms-2">
                      ${parseFloat(product.sale_price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Category */}
                <p className="text-muted small mt-1 mb-2">
                  {product.categories.map((cat) => cat.name).join(", ")}
                </p>

                {/* Add to Cart Button */}
                <button
                  className="btn btn-outline-primary btn-sm mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  <BsCart4 size={14} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default BestSellersCarousel;
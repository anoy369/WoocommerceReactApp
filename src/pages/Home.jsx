import mallImage from "../assets/mall.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Api";
import { BsArrowRight, BsCart4, BsStarFill } from "react-icons/bs";
import BestSellersCarousel from "../layouts/BestSellersCarousel";

import { useCurrency } from "../hooks/useCurrency";

const Home = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const { symbol } = useCurrency();

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

  const handleShopNow = () => navigate("/products");
  const handleProductClick = (id) => navigate(`/product/${id}`);
  const handleCategoryClick = (categoryName) =>
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);

  // Memoize computed values
  const bestSellers = products
    .filter((p) => p.average_rating && parseFloat(p.average_rating) >= 4)
    .slice(0, 6);

  const newProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  // Extract unique categories
  const categories = (() => {
    const categoryMap = new Map();
    products.forEach((product) => {
      product.categories.forEach((cat) => {
        if (!categoryMap.has(cat.name)) {
          categoryMap.set(cat.name, {
            name: cat.name,
            image: product.images[0]?.src || "/placeholder.jpg",
          });
        }
      });
    });
    return Array.from(categoryMap.values());
  })();

  return (
    <>
      {/* === Hero Section === */}
      <section className="position-relative text-white text-center">
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage: `url(${mallImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
            filter: "brightness(0.5) saturate(1.2)",
          }}
        ></div>
        <div className="container" style={{ padding: "80px 0" }}>
          <h1 className="display-4 fw-bold mb-3">Style That Speaks Volumes</h1>
          <p
            className="lead mb-4"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            Discover the season’s most loved styles. Elegance, comfort, and
            confidence in every stitch.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-center justify-content-center">
            <button
              className="btn btn-light btn-lg px-4 d-flex align-items-center justify-content-center"
              onClick={handleShopNow}
            >
              Shop Now <BsArrowRight className="ms-2" />
            </button>
            <button
              className="btn btn-outline-light btn-lg px-4"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* === Category Slider === */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="mb-4 text-center">Shop by Category</h2>
          <div
            className="d-flex gap-4 overflow-x-auto pb-3 pe-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.length === 0 ? (
              <p className="text-muted mx-auto">Loading categories...</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.name}
                  className="text-center flex-shrink-0"
                  style={{ width: "140px", cursor: "pointer" }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div
                    className="rounded ratio ratio-1x1 shadow-sm"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <p className="mt-2 fw-medium">{cat.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* === Promo Banners (2-column) === */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* New Arrivals Banner */}
            <div className="col-md-6">
              <div
                className="p-4 rounded text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mallImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 className="h4">New Arrivals</h3>
                  <p style={{ fontSize: "0.9rem" }}>
                    Fresh styles just landed.
                  </p>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => navigate("/products?sort=newest")}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>

            {/* Sale Banner */}
            <div className="col-md-6">
              <div
                className="p-4 rounded text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${mallImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 className="h4">Mid-Season Sale</h3>
                  <p style={{ fontSize: "0.9rem" }}>
                    Up to 75% off selected items.
                  </p>
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => navigate("/products?on_sale=true")}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Best Sellers Carousel === */}
      {products.length > 0 ? (
        <BestSellersCarousel products={products} onAddToCart={onAddToCart} />
      ) : (
        <section className="my-5">
          <div className="text-center">
            <p className="text-muted">Loading best sellers...</p>
          </div>
        </section>
      )}

      {/* === New Arrivals === */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="mb-4 text-center">New Arrivals</h2>
          {newProducts.length === 0 ? (
            <p className="text-muted text-center">No new arrivals yet.</p>
          ) : (
            <div className="row g-4">
              {newProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-sm-6 col-lg-3"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card shadow-sm h-100">
                    <img
                      src={product.images[0]?.src || "/placeholder.jpg"}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{product.name}</h6>
                      <p className="text-muted small">
                        {product.categories.map((c) => c.name).join(", ")}
                      </p>
                      <div className="d-flex align-items-center mt-auto">
                        <span className="fw-bold">{ symbol }{product.price}</span>
                      </div>
                      <button
                        className="btn btn-outline-primary btn-sm mt-3"
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
            </div>
          )}
        </div>
      </section>

      {/* === Testimonials === */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Customer Love</h2>
          <div className="row g-4">
            {[
              {
                text: "The fit is perfect and the fabric feels luxurious. Will definitely buy again!",
                name: "Alex T.",
              },
              {
                text: "Fast delivery, beautiful packaging, and the clothes exceeded expectations.",
                name: "Jamie P.",
              },
              {
                text: "Finally, a brand that understands both style and sustainability.",
                name: "Taylor R.",
              },
            ].map((testimonial, i) => (
              <div className="col-md-4 text-center" key={i}>
                <div className="p-3">
                  <BsStarFill className="text-warning mb-2" />
                  <p className="small">{testimonial.text}</p>
                  <div className="text-muted">— {testimonial.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Newsletter CTA === */}
      <section
        className="bg-dark text-white text-center"
        style={{ padding: "50px 0" }}
      >
        <div className="container">
          <h3>Stay in the Loop</h3>
          <p
            className="mb-4"
            style={{ maxWidth: "500px", margin: "0 auto" }}
          >
            Subscribe to get updates on new collections, exclusive offers, and
            style tips.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 align-items-center justify-content-center">
            <input
              type="email"
              placeholder="Your email address"
              className="form-control form-control-lg bg-light text-dark px-3"
              style={{ maxWidth: "350px" }}
            />
            <button className="btn btn-primary btn-lg">Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
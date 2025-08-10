import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Api";
import { BsCart4 } from "react-icons/bs";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Products = ({ onAddToCart }) => {
  const navigate = useNavigate();

  // All products and filtered list
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch products and extract categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);

        // Extract unique categories
        const categories = new Set();
        data.forEach((product) => {
          product.categories.forEach((cat) => categories.add(cat.name));
        });
        setAvailableCategories([...categories]);

        // Initially show all products
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters whenever priceRange or selectedCategories change
  useEffect(() => {
    let result = [...products];

    // Filter by price
    result = result.filter((product) => {
      const price = parseFloat(product.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by category
    if (selectedCategories.size > 0) {
      result = result.filter((product) =>
        product.categories.some((cat) => selectedCategories.has(cat.name))
      );
    }

    setFilteredProducts(result);
  }, [products, priceRange, selectedCategories]);

  const handleSingleProductPageRedirection = (productId) => {
    navigate(`/product/${productId}`);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      {/* Hero Section with Background Overlay */}
      <div className="product-hero container-fluid text-center h-75 d-flex align-items-center justify-content-center">
        <h1 className="text-white z-index-2">Products</h1>
      </div>

      <div className="container my-5">
        {/* Popular Products Carousel */}
        <h2 className="my-4">Popular Products</h2>
        <div className="row">
          <Carousel responsive={responsive} className="featured-carousel">
            {products
              .filter((product) => product.featured)
              .map((product) => (
                <div key={product.id} className="p-2">
                  <div className="card product-card h-100">
                    <img
                      className="card-img-top"
                      src={product.images[0]?.src || "/placeholder.jpg"}
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column align-items-center">
                      <h5
                        className="card-title"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSingleProductPageRedirection(product.id)}
                      >
                        {product.name}
                      </h5>
                      <div className="d-flex align-items-center justify-content-center mt-auto">
                        <span
                          className="fw-bold"
                          style={{
                            textDecoration: product.sale_price ? "line-through" : "none",
                            color: product.sale_price ? "red" : "black",
                            marginRight: product.sale_price ? "10px" : "0",
                          }}
                        >
                          ${product.regular_price || product.price}
                        </span>
                        {product.sale_price && (
                          <span className="fw-bold text-primary">${product.sale_price}</span>
                        )}
                      </div>
                      <p className="card-text mt-2 text-muted small">
                        {product.categories.map((cat) => cat.name).join(", ")}
                      </p>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => onAddToCart(product)}
                      >
                        <BsCart4 size={16} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </Carousel>
        </div>

        {/* Filters & All Products Grid */}
        <div className="row mt-5">
          {/* Filters Sidebar */}
          <div className="col-lg-3 mb-4">
            <h5>Filter by</h5>

            {/* Price Range */}
            <div className="mb-4">
              <h6>Price Range</h6>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="form-range"
              />
              <small className="d-block mt-1">
                $0 - ${priceRange[1]}
              </small>
            </div>

            {/* Categories */}
            <div>
              <h6>Categories</h6>
              {availableCategories.length === 0 ? (
                <p className="text-muted">Loading...</p>
              ) : (
                <ul className="list-unstyled">
                  {availableCategories.map((category) => (
                    <li key={category} className="mb-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`cat-${category}`}
                          checked={selectedCategories.has(category)}
                          onChange={(e) => {
                            const newSet = new Set(selectedCategories);
                            if (e.target.checked) {
                              newSet.add(category);
                            } else {
                              newSet.delete(category);
                            }
                            setSelectedCategories(newSet);
                          }}
                        />
                        <label className="form-check-label" htmlFor={`cat-${category}`}>
                          {category}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Clear Filters */}
            <button
              className="btn btn-sm btn-outline-secondary mt-3"
              onClick={() => {
                setPriceRange([0, 1000]);
                setSelectedCategories(new Set());
              }}
            >
              Clear Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="col-lg-9">
            <h2>All Products ({filteredProducts.length})</h2>
            {filteredProducts.length === 0 ? (
              <p className="text-muted">No products match your filters.</p>
            ) : (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div className="col-6 col-md-4 col-lg-6 col-xl-4 mb-4" key={product.id}>
                    <div className="card product-card h-100">
                      <img
                        src={product.images[0]?.src || "/placeholder.jpg"}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6
                          className="card-title"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSingleProductPageRedirection(product.id)}
                        >
                          {product.name}
                        </h6>
                        <div className="d-flex align-items-center">
                          <span
                            className="fw-bold"
                            style={{
                              textDecoration: product.sale_price ? "line-through" : "none",
                              color: product.sale_price ? "red" : "black",
                              marginRight: product.sale_price ? "8px" : "0",
                            }}
                          >
                            ${product.regular_price || product.price}
                          </span>
                          {product.sale_price && (
                            <span className="fw-bold text-primary">${product.sale_price}</span>
                          )}
                        </div>
                        <p className="text-muted small mt-1 mb-2">
                          {product.categories.map((cat) => cat.name).join(", ")}
                        </p>
                        <button
                          className="btn btn-primary mt-auto"
                          onClick={() => onAddToCart(product)}
                        >
                          <BsCart4 size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
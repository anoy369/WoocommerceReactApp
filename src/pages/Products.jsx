import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../Api";
import { BsCart4, BsSearch, BsFilter, BsX } from "react-icons/bs";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { useCurrency } from "../hooks/useCurrency";

const Products = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const { symbol } = useCurrency();

  // All products and filtered list
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search state

  // Filters
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [availableCategories, setAvailableCategories] = useState([]);

  // New filters
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);

  // Modal visibility (for mobile)
  const [showModal, setShowModal] = useState(false);

  // Fetch products and extract categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Simulate best sellers and new arrivals
        const productsWithFlags = data.map((p) => ({
          ...p,
          best_seller: [139, 152].includes(p.id),
          is_new:
            new Date(p.date_created) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        }));
        setProducts(productsWithFlags);

        // Extract categories
        const categories = new Set();
        data.forEach((product) =>
          product.categories.forEach((cat) => categories.add(cat.name))
        );
        setAvailableCategories([...categories]);

        setFilteredProducts(productsWithFlags);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Apply all filters and search
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesDesc = (product.description || "")
          .toLowerCase()
          .includes(term);
        const matchesCategory = product.categories.some((cat) =>
          cat.name.toLowerCase().includes(term)
        );
        return matchesName || matchesDesc || matchesCategory;
      });
    }

    result = result.filter((product) => {
      const price = parseFloat(product.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedCategories.size > 0) {
      result = result.filter((product) =>
        product.categories.some((cat) => selectedCategories.has(cat.name))
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.stock_status === "instock");
    }

    if (newArrival) {
      result = result.filter((p) => p.is_new);
    }

    if (bestSeller) {
      result = result.filter((p) => p.best_seller);
    }

    setFilteredProducts(result);
  }, [
    products,
    searchTerm,
    priceRange,
    selectedCategories,
    inStockOnly,
    newArrival,
    bestSeller,
  ]);

  const handleSingleProductPageRedirection = (productId) => {
    navigate(`/product/${productId}`);
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 2 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <>
      {/* Hero Section */}
      <div className="product-hero container-fluid text-center h-75 d-flex align-items-center justify-content-center">
        <h1 className="text-white">Products</h1>
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
                  <div className="card h-100 d-flex">
                    <img
                      src={product.images[0]?.src || "/placeholder.jpg"}
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
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
                          {symbol}
                          {product.regular_price || product.price}
                        </span>
                        {product.sale_price && (
                          <span className="fw-bold">
                            {symbol}
                            {product.sale_price}
                          </span>
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
        <div className="row mt-4">
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <div className="d-none d-lg-block col-lg-3 mb-4">
            <h5>Filter by</h5>

            {/* In Stock Only */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="inStockOnly"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="inStockOnly">
                  In Stock Only
                </label>
              </div>
            </div>

            {/* New Arrival */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="newArrival"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="newArrival">
                  New Arrivals (Last 30 Days)
                </label>
              </div>
            </div>

            {/* Best Seller */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="bestSeller"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="bestSeller">
                  Best Sellers
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h6>Price Range</h6>
              <div className="d-block align-items-center mb-2">
                <label className="small me-2" style={{ minWidth: "50px" }}>
                  Min: {symbol}
                  {priceRange[0]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const min = Number(e.target.value);
                    if (min <= priceRange[1]) {
                      setPriceRange([min, priceRange[1]]);
                    }
                  }}
                  className="form-range flex-grow-1"
                  style={{ accentColor: "#0d6efd" }}
                />
              </div>
              <div className="d-block align-items-center">
                <label className="small me-2" style={{ minWidth: "50px" }}>
                  Max: {symbol}
                  {priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const max = Number(e.target.value);
                    if (max >= priceRange[0]) {
                      setPriceRange([priceRange[0], max]);
                    }
                  }}
                  className="form-range flex-grow-1"
                  style={{ accentColor: "#0d6efd" }}
                />
              </div>
              <small className="d-block mt-2 text-muted">
                Range: {symbol}
                {priceRange[0]} — {symbol}
                {priceRange[1]}
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
                            e.target.checked
                              ? newSet.add(category)
                              : newSet.delete(category);
                            setSelectedCategories(newSet);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`cat-${category}`}
                        >
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
                setInStockOnly(false);
                setNewArrival(false);
                setBestSeller(false);
              }}
            >
              Clear All
            </button>
          </div>

          {/* Mobile Filter Button */}
          <div className="d-lg-none mb-3">
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => setShowModal(true)}
              style={{ gap: "8px" }}
            >
              <BsFilter /> Filter
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {showModal && (
            <div
              className="modal show d-block"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1050,
              }}
              tabIndex="-1"
            >
              <div
                className="modal-dialog modal-dialog-scrollable modal-lg"
                style={{ margin: "2rem auto" }}
              >
                <div className="modal-content border-0 rounded-4 shadow-lg">
                  {/* Modal Header */}
                  <div className="modal-header bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
                    <h5 className="modal-title">Filters</h5>
                    <button
                      className="btn text-white"
                      onClick={() => setShowModal(false)}
                      style={{ background: "none", border: "none", fontSize: "1.5rem" }}
                    >
                      <BsX />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                    <h6>Filter by</h6>

                    {/* In Stock Only */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inStockOnly"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="inStockOnly">
                          In Stock Only
                        </label>
                      </div>
                    </div>

                    {/* New Arrival */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="newArrival"
                          checked={newArrival}
                          onChange={(e) => setNewArrival(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="newArrival">
                          New Arrivals (Last 30 Days)
                        </label>
                      </div>
                    </div>

                    {/* Best Seller */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="bestSeller"
                          checked={bestSeller}
                          onChange={(e) => setBestSeller(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="bestSeller">
                          Best Sellers
                        </label>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-4">
                      <h6>Price Range</h6>
                      <div className="d-block align-items-center mb-2">
                        <label className="small me-2" style={{ minWidth: "50px" }}>
                          Min: {symbol}
                          {priceRange[0]}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const min = Number(e.target.value);
                            if (min <= priceRange[1]) {
                              setPriceRange([min, priceRange[1]]);
                            }
                          }}
                          className="form-range flex-grow-1"
                          style={{ accentColor: "#0d6efd" }}
                        />
                      </div>
                      <div className="d-block align-items-center">
                        <label className="small me-2" style={{ minWidth: "50px" }}>
                          Max: {symbol}
                          {priceRange[1]}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const max = Number(e.target.value);
                            if (max >= priceRange[0]) {
                              setPriceRange([priceRange[0], max]);
                            }
                          }}
                          className="form-range flex-grow-1"
                          style={{ accentColor: "#0d6efd" }}
                        />
                      </div>
                      <small className="d-block mt-2 text-muted">
                        Range: {symbol}
                        {priceRange[0]} — {symbol}
                        {priceRange[1]}
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
                                    e.target.checked
                                      ? newSet.add(category)
                                      : newSet.delete(category);
                                    setSelectedCategories(newSet);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`cat-${category}`}
                                >
                                  {category}
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setPriceRange([0, 1000]);
                        setSelectedCategories(new Set());
                        setInStockOnly(false);
                        setNewArrival(false);
                        setBestSeller(false);
                      }}
                    >
                      Clear All
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowModal(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="col-lg-9 col-12">

        {/* Search Bar - Always Visible */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <BsSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSearchTerm("")}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

            <h2>
              All Products ({filteredProducts.length})
              {searchTerm && (
                <small className="text-muted ms-2"> · Search: "{searchTerm}"</small>
              )}
            </h2>
            {filteredProducts.length === 0 ? (
              <p className="text-muted">No products match your search or filters.</p>
            ) : (
              <div className="row">
                {filteredProducts.map((product) => (
                  <div
                    className="col-6 col-md-4 col-lg-6 col-xl-4 mb-4"
                    key={product.id}
                    onClick={() => handleSingleProductPageRedirection(product.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card product-card h-100">
                      {/* Badges */}
                      <div className="position-absolute top-0 start-0 m-2">
                        {product.best_seller && (
                          <span className="badge bg-danger text-white px-2 py-1 small">
                            Best Seller
                          </span>
                        )}
                        {product.is_new && !product.best_seller && (
                          <span className="badge bg-success text-white px-2 py-1 small">
                            New
                          </span>
                        )}
                      </div>

                      <img
                        src={product.images[0]?.src || "/placeholder.jpg"}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">{product.name}</h6>
                        <div className="d-flex align-items-center">
                          <span
                            className="fw-bold"
                            style={{
                              textDecoration: product.sale_price ? "line-through" : "none",
                              color: product.sale_price ? "red" : "black",
                              marginRight: product.sale_price ? "8px" : "0",
                            }}
                          >
                            {symbol}
                            {product.regular_price || product.price}
                          </span>
                          {product.sale_price && (
                            <span className="fw-bold">
                              {symbol}
                              {product.sale_price}
                            </span>
                          )}
                        </div>
                        <p className="text-muted small mt-1 mb-2">
                          {product.categories.map((cat) => cat.name).join(", ")}
                        </p>
                        <button
                          className="btn btn-primary mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
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
// pages/SingleProduct.js
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getSingleProductData, getVariations, getAllProducts } from "../Api";
import { BsCart4, BsStarFill, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const SingleProduct = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensX, setLensX] = useState(0);
  const [lensY, setLensY] = useState(0);
  const imageContainerRef = useRef(null);

  // Detect touch devices
  const isTouchDevice = "ontouchstart" in window;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRes = await getSingleProductData(id);
        let variationsRes = [];

        if (!productRes || productRes.status === "private") {
          navigate("/404");
          return;
        }

        // Fetch variations only for variable products
        if (productRes.type === "variable") {
          variationsRes = await getVariations(id);
          setVariations(variationsRes);
        }

        setProduct(productRes);
        setMainImage(productRes.images[0]?.src);

        // Initialize selected attributes
        const defaultAttrs = {};
        productRes.default_attributes?.forEach((attr) => {
          defaultAttrs[attr.name.toLowerCase()] = attr.option;
        });
        setSelectedAttributes(defaultAttrs);

        // Auto-select variation if possible
        if (productRes.type === "variable" && variationsRes.length > 0) {
          const matched = matchVariation(defaultAttrs, variationsRes);
          setSelectedVariation(matched);

          // Fallback: select first in-stock variation
          if (!matched) {
            const firstInStock = variationsRes.find((v) => v.stock_status === "instock");
            if (firstInStock) {
              const attrs = {};
              firstInStock.attributes.forEach((a) => {
                attrs[a.name.toLowerCase()] = a.option;
              });
              setSelectedAttributes(attrs);
              setSelectedVariation(firstInStock);
              setMainImage(firstInStock.image?.src || productRes.images[0]?.src);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product.");
        navigate("/products");
      }
    };

    fetchProductData();
  }, [id, navigate]);

  // Match selected attributes to a variation
  const matchVariation = (attrs, variationList) => {
    return variationList.find((v) =>
      v.attributes.every((attr) => {
        const selected = attrs[attr.name.toLowerCase()];
        return selected?.toLowerCase() === attr.option.toLowerCase();
      })
    ) || null;
  };

  // Handle attribute selection
  const handleAttributeSelect = (attrName, option) => {
    const newAttrs = { ...selectedAttributes, [attrName.toLowerCase()]: option };
    setSelectedAttributes(newAttrs);

    const matched = matchVariation(newAttrs, variations);
    setSelectedVariation(matched);
    setMainImage(matched?.image?.src || product.images[0]?.src);
  };

  // Quantity handlers
  const increaseQty = () => {
    if (selectedVariation && selectedVariation.stock_quantity !== null) {
      if (quantity < selectedVariation.stock_quantity) setQuantity((q) => q + 1);
    } else {
      setQuantity((q) => Math.min(q + 1, 10));
    }
  };

  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  // Image Zoom
  const handleZoomIn = () => {
    if (!isTouchDevice) setIsZoomed(true);
  };

  const handleZoomOut = () => setIsZoomed(false);

  const handleImageZoom = (e) => {
    if (!isZoomed || isTouchDevice) return;

    const container = imageContainerRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = x / width;
    const percentY = y / height;

    setLensX(x);
    setLensY(y);

    const img = container.querySelector("img");
    if (img) {
      img.style.transformOrigin = `${percentX * 100}% ${percentY * 100}%`;
      img.style.transform = "scale(2)";
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    const isSimpleProduct = product.type === "simple";
    const isVariableProduct = product.type === "variable";

    // For variable products: require valid variation
    if (isVariableProduct) {
      if (!selectedVariation) {
        toast.error("Please select all options.");
        return;
      }
      if (selectedVariation.stock_status !== "instock") {
        toast.error("This variation is out of stock.");
        return;
      }
    }

    // Build product to add
    const productToAdd = isVariableProduct
      ? {
          ...product,
          variation_id: selectedVariation.id,
          name: `${product.name} - ${Object.values(selectedAttributes).join(", ")}`,
          price: selectedVariation.price,
          regular_price: selectedVariation.regular_price,
          sale_price: selectedVariation.sale_price,
          image: selectedVariation.image?.src || product.images[0]?.src,
          quantity,
          attributes: Object.keys(selectedAttributes).map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            option: selectedAttributes[key],
          })),
        }
      : {
          ...product,
          quantity,
          image: product.images[0]?.src,
        };

    onAddToCart(productToAdd);
  };

  // Related Products
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    if (product?.related_ids?.length) {
      const fetchRelated = async () => {
        try {
          const data = await getAllProducts();
          const related = data
            .filter((p) => product.related_ids.includes(p.id))
            .slice(0, 8);
          setRelatedProducts(related);
        } catch (err) {
          console.error("Failed to load related products");
        }
      };
      fetchRelated();
    }
  }, [product?.related_ids]);

  if (loading || !product) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading product...</p>
      </div>
    );
  }

  const isSimpleProduct = product.type === "simple";
  const isVariableProduct = product.type === "variable";

  let currentPrice = product.price;
  let isInStock = product.stock_status === "instock";
  let isPurchasable = product.purchasable !== false;

  if (isVariableProduct) {
    if (selectedVariation) {
      currentPrice = selectedVariation.price;
      isInStock = selectedVariation.stock_status === "instock";
      isPurchasable = selectedVariation.purchasable !== false;
    } else {
      isPurchasable = false; // Wait for selection
    }
  }

  const responsive = {
    superLargeDesktop: { max: 4000, min: 1800, items: 5 },
    desktop: { max: 1800, min: 1200, items: 4 },
    tablet: { max: 1200, min: 768, items: 3 },
    mobile: { max: 768, min: 0, items: 2 },
  };

  return (
    <div className="container my-4 my-lg-5">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button onClick={() => navigate("/")} className="btn p-0 text-primary">Home</button>
          </li>
          <li className="breadcrumb-item">
            <button onClick={() => navigate("/products")} className="btn p-0 text-primary">Products</button>
          </li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Image Gallery */}
        <div className="col-md-6">
          <div className="position-relative mb-3">
            <div
              ref={imageContainerRef}
              className="position-relative rounded shadow-sm overflow-hidden"
              style={{ height: "500px", backgroundColor: "#f8f9fa", cursor: isTouchDevice ? "pointer" : "zoom-in" }}
              onMouseMove={handleImageZoom}
              onMouseEnter={handleZoomIn}
              onMouseLeave={handleZoomOut}
            >
              <img
                src={mainImage || "/placeholder.jpg"}
                alt={product.name}
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                  transform: isZoomed ? "scale(2)" : "scale(1)",
                }}
              />
              {isZoomed && (
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: `radial-gradient(circle at ${lensX}px ${lensY}px, transparent 10%, rgba(0,0,0,0.1))`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
              )}
            </div>

            {product.featured && (
              <span className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 m-2 small rounded">Featured</span>
            )}
            {selectedVariation?.on_sale && (
              <span className="position-absolute top-0 end-0 bg-success text-white px-3 py-1 m-2 small rounded">Sale</span>
            )}

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="d-flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.src}
                    alt={`${product.name} ${idx + 1}`}
                    className={`rounded border ${mainImage === img.src ? "border-primary border-2" : "border-secondary"}`}
                    style={{ height: "80px", width: "80px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setMainImage(img.src)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="display-6 fw-bold">{product.name}</h1>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="d-flex align-items-center mb-2">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(product.average_rating) ? <BsStarFill key={i} className="text-warning" /> : null
              )}
              <span className="ms-2 text-muted">({product.rating_count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-3">
            <h4 className="fw-bold">${parseFloat(currentPrice).toFixed(2)}</h4>
          </div>

          {/* SKU */}
          {selectedVariation?.sku && (
            <p className="text-muted small mb-3"><strong>SKU:</strong> {selectedVariation.sku}</p>
          )}

          {/* Attributes (Color, Size, etc.) */}
          {isVariableProduct &&
            product.attributes.map((attr) => (
              <div className="mb-3" key={attr.id}>
                <h6>{attr.name}</h6>
                <div className="d-flex flex-wrap gap-2">
                  {attr.options.map((option) => {
                    const otherAttrs = { ...selectedAttributes, [attr.name.toLowerCase()]: option };
                    const isAvailable = variations.some((v) =>
                      v.stock_status === "instock" &&
                      v.purchasable !== false &&
                      v.attributes.every((a) =>
                        otherAttrs[a.name.toLowerCase()]?.toLowerCase() === a.option.toLowerCase()
                      )
                    );
                    const isActive = selectedAttributes[attr.name.toLowerCase()] === option;

                    const buttonStyle = {
                      backgroundColor: attr.name.toLowerCase() === "color" ? option : undefined,
                      color: attr.name.toLowerCase() === "color" ? "#fff" : undefined,
                      opacity: isAvailable ? 1 : 0.5,
                      cursor: isAvailable ? "pointer" : "not-allowed",
                    };

                    return (
                      <button
                        key={option}
                        className={`btn btn-sm ${isActive ? "btn-primary" : isAvailable ? "btn-outline-secondary" : ""}`}
                        style={{ minWidth: "80px", minHeight: "30px", ...buttonStyle }}
                        onClick={() => isAvailable && handleAttributeSelect(attr.name, option)}
                        disabled={!isAvailable}
                        title={!isAvailable ? "Out of stock" : ""}
                      >
                        {attr.name.toLowerCase() === "color" ? "" : option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Quantity */}
          <div className="d-flex align-items-center mb-4">
            <label className="me-3"><strong>Quantity:</strong></label>
            <div className="d-flex align-items-center border rounded">
              <button
                className="btn btn-outline-secondary px-3"
                onClick={decreaseQty}
                disabled={quantity <= 1}
              >
                <BsChevronLeft size={14} />
              </button>
              <span className="px-3">{quantity}</span>
              <button
                className="btn btn-outline-secondary px-3"
                onClick={increaseQty}
                disabled={!isInStock}
              >
                <BsChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="btn btn-primary btn-lg px-4 py-2 d-flex align-items-center"
            onClick={handleAddToCart}
            disabled={!isPurchasable || !isInStock}
            style={{ minWidth: "220px" }}
          >
            <BsCart4 className="me-2" />
            {!isInStock
              ? "Out of Stock"
              : !isPurchasable
              ? "Select Options"
              : `Add to Cart - $${(currentPrice * quantity).toFixed(2)}`
            }
          </button>

          {/* Stock Status */}
          <p className="mt-3">
            <strong>Status:</strong>{" "}
            {isVariableProduct && !selectedVariation ? (
              <span className="text-warning">Please select options</span>
            ) : !isInStock ? (
              <span className="text-danger">Out of Stock</span>
            ) : (
              <span className="text-success">In Stock</span>
            )}
          </p>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="border-bottom pb-2 mb-4">Product Details</h3>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
  <section className="py-5">
    <h2 className="mb-4">Related Products</h2>

    {/* Define responsive config */}
    {(() => {
      const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1800 }, items: 5 },
        desktop: { breakpoint: { max: 1800, min: 1200 }, items: 4 },
        tablet: { breakpoint: { max: 1200, min: 768 }, items: 3 },
        mobile: { breakpoint: { max: 768, min: 464 }, items: 2 },
        smallMobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
      };

      return (
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          showDots={false}
          className="related-products-carousel"
        >
          {relatedProducts.map((p) => {
            const isInStock = p.stock_status === "instock";
            return (
              <div key={p.id} className="p-2" style={{ cursor: "pointer" }}>
                <div
                  className="card h-100 d-flex flex-column shadow-sm"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img
                    src={p.images[0]?.src || "/placeholder.jpg"}
                    alt={p.name}
                    style={{ height: "180px", objectFit: "cover" }}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="card-title text-truncate">{p.name}</h6>
                    <div className="d-flex align-items-center mt-1">
                      <span
                        className="fw-bold"
                        style={{
                          textDecoration: p.sale_price ? "line-through" : "none",
                          color: p.sale_price ? "#dc3545" : "black",
                        }}
                      >
                        ${parseFloat(p.regular_price || p.price).toFixed(2)}
                      </span>
                      {p.sale_price && (
                        <span className="fw-bold ms-2">${parseFloat(p.sale_price).toFixed(2)}</span>
                      )}
                    </div>
                    <p className="text-muted small mt-1 mb-2">
                      {p.categories.map((c) => c.name).join(", ")}
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        isInStock && onAddToCart({ ...p, quantity: 1 });
                      }}
                      disabled={!isInStock}
                    >
                      <BsCart4 size={14} /> {isInStock ? "Add" : "Out"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      );
    })()}
  </section>
)}

      {/* Back */}
      <div className="text-center my-5">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/products")}>
          ← Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
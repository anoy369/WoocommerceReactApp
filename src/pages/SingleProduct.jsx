import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleProductData, getVariations, getAllProducts } from "../Api";
import { BsCart4, BsStarFill, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, variationsRes] = await Promise.all([
          getSingleProductData(id),
          getVariations(id),
        ]);

        if (!productRes || productRes.status === "private") {
          navigate("/404");
          return;
        }

        setProduct(productRes);
        setVariations(variationsRes);
        setMainImage(productRes.images[0]?.src);

        // Initialize selected attributes from default_attributes
        const defaultAttrs = {};
        productRes.default_attributes.forEach((attr) => {
          defaultAttrs[attr.name.toLowerCase()] = attr.option;
        });
        setSelectedAttributes(defaultAttrs);

        // Auto-select variation if possible
        const matched = matchVariation(defaultAttrs, variationsRes);
        setSelectedVariation(matched);

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
      v.attributes.every(
        (attr) =>
          attrs[attr.name.toLowerCase()]?.toLowerCase() === attr.option.toLowerCase()
      )
    ) || null;
  };

  // Handle attribute selection (e.g., Color, Size)
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

  // Add to Cart
 const handleAddToCart = () => {
  if (!selectedVariation) {
    toast.error("Please select all options.");
    return;
  }

  if (selectedVariation.stock_status !== "instock") {
    toast.error("This variation is out of stock.");
    return;
  }

  const productToAdd = {
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
          const related = data.filter((p) => product.related_ids.includes(p.id));
          setRelatedProducts(related.slice(0, 4));
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

  const currentPrice = selectedVariation?.price || product.price;
  const isOutOfStock = !selectedVariation || selectedVariation.stock_status !== "instock";
  const purchasable = selectedVariation?.purchasable !== false && !isOutOfStock;

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
            <img
              src={mainImage || "/placeholder.jpg"}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ height: "500px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
            />
            {product.featured && (
              <span className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 m-2 small rounded">Featured</span>
            )}
            {selectedVariation?.on_sale && (
              <span className="position-absolute top-0 end-0 bg-success text-white px-3 py-1 m-2 small rounded">Sale</span>
            )}
          </div>

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
            <h4 className="fw-bold">
              ${parseFloat(currentPrice).toFixed(2)}
            </h4>
          </div>

          {/* SKU */}
          {selectedVariation?.sku && (
            <p className="text-muted small mb-3"><strong>SKU:</strong> {selectedVariation.sku}</p>
          )}

          {/* Attributes (Color, Size, etc.) */}
          {product.type === "variable" &&
            product.attributes.map((attr) => (
              <div className="mb-3" key={attr.id}>
                <h6>{attr.name}</h6>
                <div className="d-flex flex-wrap gap-2">
                  {attr.options.map((option) => {
                    const isActive = selectedAttributes[attr.name.toLowerCase()] === option;
                    return (
                      <button
                        key={option}
                        className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline-secondary"}`}
                        style={{ minWidth: "80px" }}
                        onClick={() => handleAttributeSelect(attr.name, option)}
                        disabled={!purchasable && !isActive}
                      >
                        {option}
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
                disabled={isOutOfStock}
              >
                <BsChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={`btn btn-primary btn-lg px-4 py-2 d-flex align-items-center ${!purchasable ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!purchasable}
            style={{ minWidth: "220px" }}
          >
            <BsCart4 className="me-2" />
            {purchasable ? `Add to Cart - $${(currentPrice * quantity).toFixed(2)}` : "Out of Stock"}
          </button>

          {/* Stock Status */}
          <p className="mt-3">
            <strong>Status:</strong>{" "}
            {isOutOfStock ? (
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
          <div className="row g-4">
            {relatedProducts.map((p) => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: "pointer" }}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={p.images[0]?.src || "/placeholder.jpg"}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="card-title text-truncate">{p.name}</h6>
                    <p className="fw-bold">${p.price}</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({ ...p, quantity: 1 });
                      }}
                    >
                      <BsCart4 size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
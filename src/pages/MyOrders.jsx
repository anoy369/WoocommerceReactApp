// pages/MyOrders.js
import { useEffect, useState } from "react";
import { getOrdersByUserId, getSingleOrderData, deleteOrderById } from "../Api";
import swal from 'sweetalert';

import { TbRefresh } from "react-icons/tb";

const MyOrders = ({ loggedInUserData, setLoading }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [singleOrderData, setSingleOrderData] = useState({});

  // Safely get user ID
  const getUserId = () => {
    if (!loggedInUserData) return null;

    const userData = typeof loggedInUserData === "string"
      ? JSON.parse(loggedInUserData)
      : loggedInUserData;

    return userData?.id || null;
  };

  const fetchAllorders = async () => {
    const userId = getUserId();
    if (!userId) {
      console.error("User not logged in or ID missing");
      setOrderItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getOrdersByUserId(userId);

      if (Array.isArray(response)) {
        // Sort by newest first
        const sorted = response.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        setOrderItems(sorted);
        localStorage.setItem("orderItems", JSON.stringify(sorted));
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage or fetch
  useEffect(() => {
    const saved = localStorage.getItem("orderItems");
    const cachedOrders = saved ? JSON.parse(saved) : null;

    if (cachedOrders && Array.isArray(cachedOrders) && cachedOrders.length > 0) {
      setOrderItems(cachedOrders);
    } else {
      fetchAllorders();
    }
  }, []);

  const handleRefreshOrders = () => {
    localStorage.removeItem("orderItems");
    fetchAllorders();
  };

  const getSingleOrderInformation = async (orderID) => {
    setLoading(true);
    try {
      const response = await getSingleOrderData(orderID);
      setSingleOrderData(response);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching order:", error);
      swal("Error", "Could not load order details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSingleOrderData = (orderID) => {
    swal({
      title: "Delete Order?",
      text: "Are you sure you want to permanently delete this order?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          await deleteOrderById(orderID);
          swal("Deleted!", "Order has been removed.", "success");
          handleRefreshOrders();
        } catch (error) {
          swal("Error", "Failed to delete order.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (orderItems.length === 0) {
    return (
      <div className="container my-5 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3575/3575784.png"
          alt="No orders"
          style={{ width: "100px", opacity: 0.3 }}
          className="mb-4"
        />
        <h4 className="text-muted">No Orders Found</h4>
        <p className="text-secondary">You haven't placed any orders yet.</p>
        <button className="btn btn-primary" onClick={handleRefreshOrders}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">My Orders</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={handleRefreshOrders}>
          <TbRefresh /> Refresh
        </button>
      </div>

      <div className="row g-4">
        {orderItems.map((order) => (
          <div key={order.id} className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">Order # {order.id}</h5>
                    <p className="text-muted mb-0">
                      {new Date(order.date_created).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      order.status === "completed"
                        ? "bg-success"
                        : order.status === "processing"
                        ? "bg-warning text-dark"
                        : order.status === "cancelled"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <strong>Total: </strong>
                  <span className="ms-2 fs-5">{order.currency_symbol}{order.total}</span>
                </div>

                <div className="mb-3">
                  <strong>Items:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {order.line_items.slice(0, 3).map((item) => (
                      <div key={item.id} className="d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                        <img
                          src={item.image?.src || "/placeholder.jpg"}
                          alt={item.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                        />
                        <div className="ms-2">
                          <div>{item.quantity}x</div>
                        </div>
                      </div>
                    ))}
                    {order.line_items.length > 3 && (
                      <span className="text-muted small">+{order.line_items.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => getSingleOrderInformation(order.id)}
                  >
                    View Details
                  </button>
                  {order.status === "completed" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteSingleOrderData(order.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header bg-primary text-white rounded-top-4">
                <h5 className="modal-title">Order Details # {singleOrderData.id}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Date:</strong> {new Date(singleOrderData.date_created).toLocaleString()}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          singleOrderData.status === "completed"
                            ? "bg-success"
                            : singleOrderData.status === "processing"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {singleOrderData.status}
                      </span>
                    </p>
                    <p><strong>Total:</strong> {singleOrderData.currency_symbol}{singleOrderData.total}</p>
                  </div>
                </div>

                <h6>Items:</h6>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      {singleOrderData.line_items?.map((item) => (
                        <tr key={item.id}>
                          <td style={{ width: "60px" }}>
                            <img
                              src={item.image?.src || "/placeholder.jpg"}
                              alt={item.name}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                            />
                          </td>
                          <td>
                            <strong>{item.name}</strong>
                            <br />
                            <small>Qty: {item.quantity} × {singleOrderData.currency_symbol}{item.price}</small>
                          </td>
                          <td className="text-end">
                            <strong>{singleOrderData.currency_symbol}{(item.price * item.quantity).toFixed(2)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
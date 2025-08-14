// pages/MyOrders.js
import { useEffect, useState } from "react";
import { getOrdersByUserId, getSingleOrderData, deleteOrderById } from "../Api";
import swal from 'sweetalert';

const MyOrders = ({ loggedInUserData, setLoading }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [singleOrderData, setSingleOrderData] = useState({});

  // Safely get user ID
  const getUserId = () => {
    if (!loggedInUserData) return null;

    // If it's a string, parse it
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
        setOrderItems(response);
        localStorage.setItem("orderItems", JSON.stringify(response));
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

  // Load orders from localStorage or fetch
  useEffect(() => {
    const saved = localStorage.getItem("orderItems");
    const cachedOrders = saved ? JSON.parse(saved) : null;

    if (cachedOrders && Array.isArray(cachedOrders) && cachedOrders.length > 0) {
      setOrderItems(cachedOrders);
    } else {
      fetchAllorders();
    }
  }, []);

  // Refresh orders
  const handleRefreshOrders = () => {
    localStorage.removeItem("orderItems");
    fetchAllorders();
  };

  // View single order
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

  // Delete order
  const deleteSingleOrderData = (orderID) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to DELETE this order?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          await deleteOrderById(orderID);
          swal("Deleted!", "Your order has been deleted successfully", "success");
          handleRefreshOrders(); // Refresh list
        } catch (error) {
          console.error("Delete error:", error);
          swal("Error", "Failed to delete order.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">My Orders</h1>

      <button className="btn btn-primary mb-3" onClick={handleRefreshOrders}>
        Refresh Orders
      </button>

      {orderItems.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No orders found</h5>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {new Date(order.date_created).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "completed"
                          ? "bg-success"
                          : order.status === "processing"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.currency_symbol} {order.total}
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.line_items.slice(0, 2).map((item) => (
                        <li key={item.id}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                      {order.line_items.length > 2 && (
                        <li>... +{order.line_items.length - 2} more</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => getSingleOrderInformation(order.id)}
                    >
                      View
                    </button>
                    {order.status === "completed" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteSingleOrderData(order.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Order ID:</strong> #{singleOrderData.id}</p>
                <p><strong>Date:</strong> {new Date(singleOrderData.date_created).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`badge ${singleOrderData.status === "completed" ? "bg-success" : "bg-warning text-dark"}`}>{singleOrderData.status}</span></p>
                <p><strong>Total:</strong> {singleOrderData.currency_symbol}{singleOrderData.total}</p>
                <p><strong>Items:</strong></p>
                <ul>
                  {singleOrderData.line_items?.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
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
import { useState } from "react";

const MyOrders = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      <div className="container">
        <h1>My Orders</h1>
        <button className="btn btn-primary mb-3 float-end">
          Refresh Orders
        </button>
        <div id="orders-container">
          <p>No orders found.</p>

          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="orders-list">
              <tr>
                <td>12345</td>
                <td>12/30/2024</td>
                <td>Completed</td>
                <td>$50.00</td>
                <td>
                  <ul>
                    <li>Item 1 (x2)</li>
                    <li>Item 2 (x1)</li>
                  </ul>
                </td>
                <td>
                  <button className="btn btn-info me-2" onClick={()=>setShowDetailsModal(true)}>View</button>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showDetailsModal && (
          <div
            id="order-details-modal"
            className="modal show d-block"
            style={{ display: "none" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details</h5>
                  <button type="button" className="btn-close" onClick={()=>setShowDetailsModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Order ID:</strong> 12345
                  </p>
                  <p>
                    <strong>Date:</strong> 12/30/2024
                  </p>
                  <p>
                    <strong>Status:</strong> Completed
                  </p>
                  <p>
                    <strong>Total:</strong> $50.00
                  </p>
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <ul>
                    <li>Item 1 (x2)</li>
                    <li>Item 2 (x1)</li>
                  </ul>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={()=>setShowDetailsModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;

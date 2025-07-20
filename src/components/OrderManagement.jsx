// src/components/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore database instance

const OrderManagement = ({ onBack }) => {
  const [orders, setOrders] = useState([]); // State to store the list of orders
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages

  // Effect to fetch orders from Firestore in real-time
  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Reference to the dedicated admin orders collection.
    // This collection is where PaymentSummary now also writes orders for admin viewing.
    const ordersCollectionRef = collection(db, `artifacts/${appId}/admin_orders`);
    const q = query(ordersCollectionRef);

    // Set up a real-time listener for orders
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp objects to a readable local string
          createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A'
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders for management:", err);
        setError("Failed to load orders for management.");
        setLoading(false);
      }
    );
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handles updating the status of an order
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setLoading(true); // Set loading state while updating
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Reference to the specific order document to update
    const orderDocRef = doc(db, `artifacts/${appId}/admin_orders`, orderId);

    try {
      await updateDoc(orderDocRef, { orderStatus: newStatus }); // Update the orderStatus field
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center p-8"><p className="text-lg text-eco-brown-dark">Loading orders...</p></div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center p-8 text-red-600"><p className="text-lg">{error}</p></div>;
  }

  return (
    <div className="bg-eco-cream p-6 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto border border-eco-green-light/20">
      <div className="flex justify-between items-center mb-6 border-b border-eco-green-light/30 pb-4">
        <h2 className="text-3xl font-heading font-bold text-eco-green-dark">Order Management</h2>
        {/* Button to go back to Admin Dashboard */}
        <button
          onClick={onBack}
          className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        // Message if no orders are found
        <p className="text-eco-brown-light text-center py-8">No orders placed yet.</p>
      ) : (
        // Table to display orders
        <div className="overflow-x-auto">
          <table className="min-w-full bg-eco-cream rounded-lg shadow-eco-soft border border-eco-green-light/20">
            <thead className="bg-eco-green-light/30">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Order ID</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Items</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Total</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Status</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-eco-green-light/10 hover:bg-eco-off-white">
                  <td className="py-3 px-4 text-eco-brown-dark text-xs font-mono">{order.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 text-eco-brown-dark">{order.customerInfo.fullName}</td>
                  <td className="py-3 px-4 text-eco-brown-dark">
                    {/* Display ordered items */}
                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-eco-brown-dark">₹{order.cartTotal.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {/* Dropdown to update order status */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`py-1 px-2 rounded-md text-xs font-semibold
                        ${order.orderStatus === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                          order.orderStatus === 'Processing' ? 'bg-blue-200 text-blue-800' :
                          order.orderStatus === 'Shipped' ? 'bg-indigo-200 text-indigo-800' :
                          order.orderStatus === 'Delivered' ? 'bg-eco-green-light/50 text-eco-green-dark' : 'bg-red-200 text-red-800' // For Cancelled
                        }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-eco-brown-dark text-sm">{order.createdAt}</td>
                  <td className="py-3 px-4">
                    {/* Placeholder for additional actions like "View Details" */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

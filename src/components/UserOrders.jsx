// src/components/UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Import db and auth
import { onAuthStateChanged } from 'firebase/auth';

const UserOrders = ({ onBackToShop }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for auth state changes to get the current user's ID
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setOrders([]); // Clear orders if user logs out
        setLoading(false);
      }
    });

    return () => authUnsubscribe(); // Cleanup auth listener
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      setOrders([]);
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Reference to the user's private orders collection
    const userOrdersCollectionRef = collection(db, `artifacts/${appId}/users/${currentUserId}/orders`);

    // Query to fetch orders for the current user, ordered by creation date
    // Note: Firestore requires an index for orderBy. If you encounter an error,
    // Firebase console will provide a link to create the necessary index.
    const q = query(userOrdersCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'N/A' // Convert timestamp
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user orders:", err);
        setError("Failed to load your orders. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup Firestore listener
  }, [currentUserId]); // Re-run when currentUserId changes

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-eco-brown-dark">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p className="text-lg">{error}</p>
        <button onClick={onBackToShop} className="mt-4 bg-eco-green-medium text-white py-2 px-4 rounded-lg hover:bg-eco-green-dark transition-colors shadow-md">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto text-center border border-eco-green-light/20">
        <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6">Your Orders</h2>
        <p className="text-eco-brown-dark mb-4">Please log in to view your order history.</p>
        <button onClick={onBackToShop} className="mt-4 bg-eco-green-medium text-white py-2 px-4 rounded-lg hover:bg-eco-green-dark transition-colors shadow-md">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-eco-cream p-6 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto border border-eco-green-light/20">
      <div className="flex justify-between items-center mb-6 border-b border-eco-green-light/30 pb-4">
        <h2 className="text-3xl font-heading font-bold text-eco-green-dark">Your Orders</h2>
        <button onClick={onBackToShop} className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors">
          Back to Shop
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-eco-brown-light text-center py-8">You haven't placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-eco-cream rounded-lg shadow-eco-soft border border-eco-green-light/20">
            <thead className="bg-eco-green-light/30">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Order ID</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Date</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Total</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Status</th>
                <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-eco-green-light/10 hover:bg-eco-off-white">
                  <td className="py-3 px-4 text-eco-brown-dark text-xs font-mono">{order.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 text-eco-brown-dark text-sm">{order.createdAt}</td>
                  <td className="py-3 px-4 text-eco-brown-dark">₹{order.cartTotal.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.orderStatus === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                        order.orderStatus === 'Processing' ? 'bg-blue-200 text-blue-800' :
                        order.orderStatus === 'Shipped' ? 'bg-indigo-200 text-indigo-800' :
                        order.orderStatus === 'Delivered' ? 'bg-eco-green-light/50 text-eco-green-dark' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-eco-brown-dark text-sm">
                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
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

export default UserOrders;

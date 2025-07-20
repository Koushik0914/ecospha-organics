// src/components/PaymentSummary.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; // Import useCart hook for cart data
import { db, auth } from '../firebase'; // Import Firestore db and Auth instances
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore functions

const PaymentSummary = ({ shippingData, onBack, onOrderSuccess, onBackToCart }) => { // Added onBackToCart prop
  // Get cart items, total, and item removal function from CartContext
  const { cartItems, cartTotal, removeItemCompletely } = useCart();
  // State for selected payment method (default to Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState('cod');
  // State to indicate if order processing is in progress
  const [isProcessing, setIsProcessing] = useState(false);
  // State for displaying messages to the user (success/error)
  const [message, setMessage] = useState('');

  // Handles placing the order
  const handlePlaceOrder = async () => {
    setIsProcessing(true); // Set processing state to true
    setMessage(''); // Clear any previous messages

    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) {
        // If no user is authenticated, display an error
        setMessage('Authentication error. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Get the current application ID from the global variable.
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userId = user.uid; // Get the user's UID for storing user-specific orders

      // Prepare the order data object to be saved to Firestore
      const orderData = {
        userId: userId, // ID of the user who placed the order
        customerInfo: shippingData, // Shipping information from the previous step
        items: cartItems.map(item => ({ // Map cart items to a simplified format for the order
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          unit: item.product.unit,
          imageUrl: item.product.imageUrl,
        })),
        cartTotal: cartTotal, // Total value of the order
        paymentMethod: paymentMethod, // Selected payment method
        orderStatus: 'Pending', // Initial status
        createdAt: serverTimestamp(), // Firestore server timestamp for when the order was created
      };

      // Save order to user's private history (e.g., for "My Orders" section for the user)
      const userOrdersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/orders`);
      await addDoc(userOrdersCollectionRef, orderData);
      console.log("Order saved to user's private collection.");

      // Also save order to a dedicated admin-viewable collection.
      // This collection will be used by the OrderManagement component for the admin panel.
      const adminOrdersCollectionRef = collection(db, `artifacts/${appId}/admin_orders`);
      await addDoc(adminOrdersCollectionRef, orderData);
      console.log("Order saved to admin_orders collection.");

      // --- Conceptual: Trigger Email Notification ---
      // The Cloud Function listening for new documents in 'admin_orders'
      // will automatically trigger and send the email confirmation.
      console.log("Email notification (via Cloud Function) conceptually triggered.");

      // Clear the cart after a successful order
      cartItems.forEach(item => removeItemCompletely(item.product.id)); // Remove each item from the cart context

      setMessage('Order placed successfully! Redirecting to confirmation...');
      // Simulate a redirect to the order confirmation page after a short delay
      setTimeout(() => onOrderSuccess(), 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage(`Failed to place order: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-2xl mx-auto border border-eco-green-light/20">
      <h3 className="text-2xl font-heading font-bold text-eco-green-dark mb-6 text-center">Order Summary & Payment</h3>

      {/* Shipping Information Review Section */}
      <div className="mb-6 border-b border-eco-green-light/30 pb-4">
        <h4 className="text-xl font-semibold text-eco-brown-dark mb-3">Shipping To:</h4>
        <p className="text-eco-brown-dark">{shippingData.fullName}</p>
        <p className="text-eco-brown-dark">{shippingData.addressLine1}</p>
        {shippingData.addressLine2 && <p className="text-eco-brown-dark">{shippingData.addressLine2}</p>}
        <p className="text-eco-brown-dark">{shippingData.city}, {shippingData.state} - {shippingData.zipCode}</p>
        <p className="text-eco-brown-dark">Phone: {shippingData.phone}</p>
        <p className="text-eco-brown-dark">Email: {shippingData.email}</p>
        {/* Button to go back and edit shipping information */}
        <button onClick={onBack} className="text-eco-green-medium hover:underline mt-2 text-sm transition-colors">Edit Shipping Info</button>
      </div>

      {/* Cart Items Summary Section */}
      <div className="mb-6 border-b border-eco-green-light/30 pb-4">
        <h4 className="text-xl font-semibold text-eco-brown-dark mb-3">Items:</h4>
        {cartItems.length === 0 ? (
          <p className="text-eco-brown-light">No items in cart.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center text-eco-brown-dark mb-2">
              <span>{item.product.name} ({item.quantity} {item.product.unit})</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        {/* Display the total cart value */}
        <div className="flex justify-between items-center text-xl font-bold text-eco-green-dark mt-4">
          <span>Cart Total:</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection Section */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-eco-brown-dark mb-3">Select Payment Method:</h4>
        <div className="flex flex-col gap-3">
          {/* Cash on Delivery (COD) Option */}
          <label className="inline-flex items-center text-eco-brown-dark">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-eco-green-medium"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <span className="ml-2">Cash on Delivery (COD)</span>
          </label>
          {/* Online Payment Option (Disabled as a placeholder for future integration) */}
          <label className="inline-flex items-center text-eco-brown-light">
            <input
              type="radio"
              className="form-radio h-5 w-5 text-gray-400"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
              disabled // Keep disabled for now as actual integration is complex
            />
            <span className="ml-2">Online Payment (Credit Card / UPI) - Coming Soon</span>
          </label>
        </div>
      </div>

      {/* Message Display Area (for success or error messages) */}
      {message && (
        <div className={`p-3 rounded-lg text-center mb-4 ${message.includes('successfully') ? 'bg-eco-green-light/20 text-eco-green-dark' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Action Buttons: Back to Cart, Back to Shipping, Place Order */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={onBackToCart} // New: Back to Cart button
          className="w-full sm:w-1/2 bg-eco-brown-light text-white py-3 rounded-lg font-semibold text-lg hover:bg-eco-brown-dark transition-colors shadow-md"
        >
          Back to Cart
        </button>
        <button
          type="button"
          onClick={onBack} // Existing: Back to Shipping Info
          className="w-full sm:w-1/2 bg-eco-green-light text-eco-brown-dark py-3 rounded-lg font-semibold text-lg hover:bg-eco-green-medium hover:text-white transition-colors shadow-md"
        >
          Back to Shipping
        </button>
        <button
          onClick={handlePlaceOrder}
          className={`w-full sm:w-full py-3 rounded-lg font-semibold text-lg transition-colors shadow-md mt-4 sm:mt-0
            ${isProcessing || cartItems.length === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-eco-green-dark text-white hover:bg-eco-green-medium'
            }`}
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? 'Processing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;

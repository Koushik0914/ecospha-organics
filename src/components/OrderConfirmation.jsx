// src/components/OrderConfirmation.jsx
import React from 'react';

const OrderConfirmation = ({ onContinueShopping }) => {
  return (
    <div className="bg-eco-cream p-10 rounded-xl shadow-eco-soft w-full max-w-md mx-auto text-center border border-eco-green-light/20">
      {/* SVG icon for a successful order (checkmark in a circle) */}
      <svg
        className="mx-auto h-24 w-24 text-eco-green-medium"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {/* Confirmation message */}
      <h3 className="text-3xl font-heading font-bold text-eco-green-dark mt-4 mb-2">Order Placed!</h3>
      <p className="text-eco-brown-dark mb-6 leading-relaxed">Thank you for your purchase from Ecospha Organics. Your order has been successfully placed and will be processed soon.</p>
      {/* Button to continue shopping */}
      <button
        onClick={onContinueShopping} // Calls the prop function to navigate back to product list
        className="w-full bg-eco-green-dark text-white py-3 rounded-lg font-semibold text-lg hover:bg-eco-green-medium transition-colors shadow-md"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;

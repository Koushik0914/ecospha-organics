// src/components/ShoppingCart.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // Import the useCart hook to access cart state and functions

// Added onProceedToCheckout to props
const ShoppingCart = ({ onClose, onProceedToCheckout }) => {
  // Destructure cart state and functions from the useCart hook
  const { cartItems, addToCart, removeFromCart, removeItemCompletely, cartTotal } = useCart();

  return (
    // Fixed overlay to cover the entire screen when the cart is open
    <div className="fixed inset-0 bg-eco-brown-dark bg-opacity-75 flex justify-end z-50">
      {/* Cart sidebar container, slides in from the right */}
      <div className="bg-eco-cream w-full max-w-md h-full shadow-lg p-6 flex flex-col">
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-6 border-b border-eco-green-light/30 pb-4">
          <h2 className="text-3xl font-heading font-bold text-eco-green-dark">Your Cart</h2>
          {/* Close button for the cart sidebar */}
          <button
            onClick={onClose} // Calls the onClose prop to close the cart
            className="text-eco-brown-light hover:text-eco-brown-dark text-2xl font-semibold transition-colors"
            aria-label="Close cart" // Accessibility label
          >
            &times; {/* HTML entity for a multiplication sign, commonly used for close buttons */}
          </button>
        </div>

        {/* Cart Items List - scrollable area */}
        <div className="flex-grow overflow-y-auto pr-2">
          {cartItems.length === 0 ? (
            // Message displayed when the cart is empty
            <p className="text-eco-brown-light text-center py-8">Your cart is empty.</p>
          ) : (
            // Map through cart items and display each one
            cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between border-b border-eco-green-light/10 py-4">
                <div className="flex items-center">
                  {/* Product image in the cart */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md mr-4 border border-eco-green-light/20"
                    // Fallback for broken images: displays initials of product name
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/A38B7D/F8F5F0?text=${encodeURIComponent(item.product.name.substring(0,2))}`; }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-eco-brown-dark">{item.product.name}</h3>
                    <p className="text-eco-green-medium">₹{item.product.price.toFixed(2)} per {item.product.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Decrease quantity button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)} // Calls removeFromCart with product ID
                    className="bg-eco-off-white text-eco-brown-dark w-8 h-8 rounded-full flex items-center justify-center hover:bg-eco-green-light hover:text-white transition-colors border border-eco-green-light/30"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  {/* Current quantity display */}
                  <span className="font-bold text-lg text-eco-brown-dark">{item.quantity}</span>
                  {/* Increase quantity button */}
                  <button
                    onClick={() => addToCart(item.product)} // Calls addToCart with the product object
                    className="bg-eco-green-medium text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-eco-green-dark transition-colors shadow-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  {/* Remove item completely button (trash icon) */}
                  <button
                    onClick={() => removeItemCompletely(item.product.id)} // Calls removeItemCompletely
                    className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Remove item completely"
                  >
                    {/* SVG for trash icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer - Total and Checkout Button */}
        <div className="border-t border-eco-green-light/30 pt-6 mt-6">
          <div className="flex justify-between items-center text-xl font-bold mb-4 text-eco-green-dark">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span> {/* Display total cart value */}
          </div>
          {/* Checkout button (now calls onProceedToCheckout prop) */}
          <button
            onClick={onProceedToCheckout} // Calls the prop function to start checkout flow
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors shadow-md
              ${cartItems.length === 0 // Disable if cart is empty
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-eco-green-dark text-white hover:bg-eco-green-medium' // Green styling when enabled
              }`}
            disabled={cartItems.length === 0} // Disable if cart is empty
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

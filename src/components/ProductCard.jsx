// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart hook

const ProductCard = ({ product }) => {
  // Destructure product properties for easier access
  const { id, name, imageUrl, description, price, unit, availability, tags } = product; // Added 'tags'
  // Get the addToCart function from the cart context
  const { addToCart } = useCart();

  // Placeholder image URL in case the product's imageUrl is missing or broken.
  // Uses placehold.co for dynamic placeholder images based on product name.
  const placeholderImage = `https://placehold.co/300x200/A38B7D/F8F5F0?text=${encodeURIComponent(name || 'Product')}`; // Using eco-brown-light/eco-off-white

  // Event handler for the "Add to Cart" button click.
  const handleAddToCart = () => {
    // Only add to cart if the product is in stock.
    if (availability === 'In Stock') {
      addToCart(product); // Call the addToCart function with the current product object.
      console.log(`${name} added to cart!`); // Log a message to the console for feedback.
    }
  };

  return (
    <div className="bg-eco-cream rounded-xl shadow-eco-soft overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col h-full border border-eco-green-light/20">
      {/* Product Image Container */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          // Fallback mechanism for image loading errors: replaces broken image with a placeholder.
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
        {/* Display "Out of Stock" badge if the product is not available */}
        {availability === 'Out of Stock' && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            Out of Stock
          </div>
        )}
        {/* Product Tags (e.g., "Fresh", "In Season") */}
        {tags && tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="bg-eco-green-medium text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-heading font-bold text-eco-green-dark mb-2">{name}</h3>
        {/* Product description, allowing it to take up available space */}
        <p className="text-eco-brown-dark text-sm mb-3 flex-grow leading-relaxed">{description}</p>
        {/* Price and Unit Information */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-eco-green-light/30">
          {/* Display price formatted to two decimal places */}
          <span className="text-2xl font-bold text-eco-green-medium">₹{price.toFixed(2)}</span>
          <span className="text-eco-brown-light text-sm">per {unit}</span>
        </div>
        {/* Add to Cart Button */}
        <button
          className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md
            ${availability === 'In Stock'
              ? 'bg-eco-green-medium text-white hover:bg-eco-green-dark' // Green styling for in-stock
              : 'bg-gray-300 text-gray-600 cursor-not-allowed' // Gray styling for out-of-stock
            }`}
          disabled={availability === 'Out of Stock'} // Disable button if out of stock
          onClick={handleAddToCart} // Attach the click handler
        >
          {availability === 'In Stock' ? 'Add to Cart' : 'Notify Me'} {/* Button text changes based on availability */}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

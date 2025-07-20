// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 p-5 bg-eco-cream rounded-xl shadow-eco-soft mb-8 border border-eco-green-light/20">
      {/* Search Input Field */}
      <input
        type="text"
        placeholder="Search products..."
        className="flex-grow w-full sm:w-auto p-3 border border-eco-green-light rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green-medium transition-all duration-200 text-eco-brown-dark bg-eco-off-white shadow-eco-subtle"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} // Call onSearchChange with the new input value
      />

      {/* Category Filter Dropdown */}
      <select
        className="w-full sm:w-auto p-3 border border-eco-green-light rounded-lg bg-eco-off-white text-eco-brown-dark focus:outline-none focus:ring-2 focus:ring-eco-green-medium transition-all duration-200 shadow-eco-subtle"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)} // Call onCategoryChange with the new selected value
      >
        {/* Default option to show all categories */}
        <option value="">All Categories</option>
        {/* Map through the provided categories to create dropdown options */}
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;

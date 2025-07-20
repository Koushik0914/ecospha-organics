// src/components/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = ({ onNavigate }) => {
  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto text-center border border-eco-green-light/20">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6">Admin Dashboard</h2>
      <p className="text-eco-brown-dark mb-8">Manage your products, orders, and customer data.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added lg:grid-cols-3 for more options */}
        {/* Button to navigate to Product Management */}
        <button
          onClick={() => onNavigate('product-management')}
          className="bg-eco-green-medium text-white py-4 px-6 rounded-lg font-semibold text-xl hover:bg-eco-green-dark transition-colors shadow-md flex flex-col items-center justify-center"
        >
          {/* SVG icon for product management */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
          </svg>
          Product Management
        </button>
        {/* Button to navigate to Order Management */}
        <button
          onClick={() => onNavigate('order-management')}
          className="bg-eco-brown-dark text-white py-4 px-6 rounded-lg font-semibold text-xl hover:bg-eco-brown-light transition-colors shadow-md flex flex-col items-center justify-center"
        >
          {/* SVG icon for order management */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Order Management
        </button>
        {/* New: Button to navigate to Testimonial Management */}
        <button
          onClick={() => onNavigate('testimonial-management')}
          className="bg-eco-green-dark text-white py-4 px-6 rounded-lg font-semibold text-xl hover:bg-eco-green-medium transition-colors shadow-md flex flex-col items-center justify-center"
        >
          {/* SVG icon for testimonials (using a chat bubble/quote icon) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Testimonial Management
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

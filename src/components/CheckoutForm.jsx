// src/components/CheckoutForm.jsx
import React, { useState } from 'react';

const CheckoutForm = ({ onNext, initialData = {}, onBackToCart }) => { // Added onBackToCart prop
  // State to manage form data, initialized with any provided initialData (e.g., for going back)
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    addressLine1: initialData.addressLine1 || '',
    addressLine2: initialData.addressLine2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
  });
  // State to manage validation errors for each field
  const [errors, setErrors] = useState({});

  // Handles input changes and updates the formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear the specific error message for the field as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Validates the form fields
  const validateForm = () => {
    let newErrors = {};
    // Basic validation for required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required';
    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit Phone is required';
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid Email is required';

    setErrors(newErrors); // Update the errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      onNext(formData); // If form is valid, call the onNext prop with the form data
    }
  };

  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-2xl mx-auto border border-eco-green-light/20">
      <h3 className="text-2xl font-heading font-bold text-eco-green-dark mb-6 text-center">Shipping Information</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.fullName ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="John Doe"
          />
          {errors.fullName && <p className="text-red-500 text-xs italic mt-1">{errors.fullName}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.email ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="john.doe@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number Input */}
        <div>
          <label htmlFor="phone" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.phone ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="9876543210"
          />
          {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>}
        </div>

        {/* Address Line 1 Input */}
        <div className="md:col-span-2">
          <label htmlFor="addressLine1" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Address Line 1</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.addressLine1 ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="House No., Street Name"
          />
          {errors.addressLine1 && <p className="text-red-500 text-xs italic mt-1">{errors.addressLine1}</p>}
        </div>

        {/* Address Line 2 Input (Optional) */}
        <div className="md:col-span-2">
          <label htmlFor="addressLine2" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-eco-green-light/30 rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white"
            placeholder="Apartment, Suite, Building"
          />
        </div>

        {/* City Input */}
        <div>
          <label htmlFor="city" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.city ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="Mumbai"
          />
          {errors.city && <p className="text-red-500 text-xs italic mt-1">{errors.city}</p>}
        </div>

        {/* State Input */}
        <div>
          <label htmlFor="state" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.state ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="Maharashtra"
          />
          {errors.state && <p className="text-red-500 text-xs italic mt-1">{errors.state}</p>}
        </div>

        {/* Zip Code Input */}
        <div>
          <label htmlFor="zipCode" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-eco-brown-dark leading-tight focus:outline-none focus:ring-2 focus:ring-eco-green-medium bg-eco-off-white ${errors.zipCode ? 'border-red-500' : 'border-eco-green-light/30'}`}
            placeholder="400001"
          />
          {errors.zipCode && <p className="text-red-500 text-xs italic mt-1">{errors.zipCode}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-6 flex justify-between gap-4">
          <button
            type="button" // Change to type="button" to prevent form submission
            onClick={onBackToCart} // Call the new prop
            className="w-1/2 bg-eco-brown-light text-white py-3 rounded-lg font-semibold text-lg hover:bg-eco-brown-dark transition-colors shadow-md"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className="w-1/2 bg-eco-green-dark text-white py-3 rounded-lg font-semibold text-lg hover:bg-eco-green-medium transition-colors shadow-md"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

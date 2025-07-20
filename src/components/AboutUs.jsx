// src/components/AboutUs.jsx
import React from 'react';

const AboutUs = ({ onBackToShop }) => {
  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto text-center border border-eco-green-light/20">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6">About Ecospha Organics</h2>
      <p className="text-eco-brown-dark mb-4 leading-relaxed">
        At Ecospha Organics, we are deeply committed to bringing you the purest, most nutrient-rich organic produce directly from our farms to your doorstep. Our journey began with a simple yet profound vision: to foster a sustainable ecosystem where healthy food thrives, and conscious living flourishes.
      </p>
      <p className="text-eco-brown-dark mb-4 leading-relaxed">
        We believe in farming practices that respect the earth, nurture biodiversity, and eliminate harmful chemicals. We grow our own diverse range of field crops, millets, vegetables, fruits, pulses, and spices on eco-friendly farms. We also proudly partner with a network of trusted local farmers who share our unwavering commitment to organic integrity and sustainable agriculture.
      </p>
      <p className="text-eco-brown-dark mb-6 leading-relaxed">
        Every product from Ecospha Organics is a testament to our dedication to quality, authenticity, and environmental stewardship. Join us in cultivating a healthier planet, one organic harvest at a time.
      </p>
      <button onClick={onBackToShop} className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors shadow-md">
        Back to Shop
      </button>
    </div>
  );
};

export default AboutUs;

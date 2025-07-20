// src/components/OurFarms.jsx
import React from 'react';

const OurFarms = ({ onBackToShop }) => {
  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto text-center border border-eco-green-light/20">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6">Our Farms & Process</h2>
      <p className="text-eco-brown-dark mb-4 leading-relaxed">
        At Ecospha Organics, our farms are the heart of our operation. We are passionate about cultivating healthy, vibrant produce using methods that are kind to the earth and beneficial for you. Our practices go beyond just "organic" – they embody a holistic approach to sustainable agriculture.
      </p>
      <p className="text-eco-brown-dark mb-4 leading-relaxed">
        We utilize traditional farming techniques combined with modern ecological science. This includes natural pest control, crop rotation to enrich soil, water conservation methods, and avoiding any synthetic pesticides, herbicides, or fertilizers. We believe in working with nature, not against it.
      </p>
      <div className="my-6">
        <img
          src="https://placehold.co/800x300/4A7C59/F8F5F0?text=Our+Eco-Friendly+Farms"
          alt="Eco-Friendly Farms"
          className="rounded-lg shadow-md mx-auto mb-4"
        />
        <img
          src="https://placehold.co/800x300/8DBE98/2E473C?text=Farm+to+Doorstep"
          alt="Farm to Doorstep Process"
          className="rounded-lg shadow-md mx-auto"
        />
      </div>
      <p className="text-eco-brown-dark mb-6 leading-relaxed">
        From the moment seeds are sown in our nutrient-rich soil to the careful harvesting and packaging, we ensure every step maintains the integrity and freshness of our produce. We minimize waste, use eco-friendly packaging, and strive for the shortest possible journey from farm to your doorstep, ensuring you receive the freshest, most authentic organic goods.
      </p>
      <button onClick={onBackToShop} className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors shadow-md">
        Back to Shop
      </button>
    </div>
  );
};

export default OurFarms;

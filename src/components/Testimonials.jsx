// src/components/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase'; // Import db

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Testimonials will be public data, so use the public path
    const testimonialsCollectionRef = collection(db, `artifacts/${appId}/public/data/testimonials`);
    const q = query(testimonialsCollectionRef);

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(testimonialsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-eco-brown-dark">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-eco-brown-light">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-10 text-center">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-eco-cream p-6 rounded-xl shadow-eco-subtle border border-eco-green-light/20 flex flex-col">
            <p className="text-eco-brown-dark text-lg italic mb-4 flex-grow">"{testimonial.quote}"</p>
            <p className="text-eco-green-medium font-semibold text-right">- {testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

// src/components/TestimonialManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase'; // Import db

const TestimonialManagement = ({ onBack }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // Corrected typo here
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    author: '',
    quote: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Define the base path for the testimonials collection
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const TESTIMONIALS_COLLECTION_PATH = `artifacts/${appId}/public/data/testimonials`;

  useEffect(() => {
    const testimonialsCollectionRef = collection(db, TESTIMONIALS_COLLECTION_PATH);
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
        console.error("Error fetching testimonials for management:", err);
        setError("Failed to load testimonials for management.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.quote.trim()) newErrors.quote = 'Quote is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateTestimonial = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (currentTestimonial) {
        const testimonialDocRef = doc(db, TESTIMONIALS_COLLECTION_PATH, currentTestimonial.id);
        await updateDoc(testimonialDocRef, formData);
        console.log("Testimonial updated:", currentTestimonial.id);
      } else {
        await addDoc(collection(db, TESTIMONIALS_COLLECTION_PATH), formData);
        console.log("Testimonial added:", formData.author);
      }
      resetForm();
    } catch (err) {
      console.error("Error adding/updating testimonial:", err);
      setError("Failed to save testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      author: testimonial.author,
      quote: testimonial.quote,
    });
    setIsAdding(true);
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setLoading(true);
      try {
        const testimonialDocRef = doc(db, TESTIMONIALS_COLLECTION_PATH, testimonialId);
        await deleteDoc(testimonialDocRef);
        console.log("Testimonial deleted:", testimonialId);
      } catch (err) {
        console.error("Error deleting testimonial:", err);
        setError("Failed to delete testimonial.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      author: '',
      quote: '',
    });
    setCurrentTestimonial(null);
    setIsAdding(false);
    setFormErrors({});
  };

  if (loading) {
    return <div className="text-center p-8"><p className="text-lg text-eco-brown-dark">Loading testimonials...</p></div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600"><p className="text-lg">{error}</p></div>;
  }

  return (
    <div className="bg-eco-cream p-6 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto border border-eco-green-light/20">
      <div className="flex justify-between items-center mb-6 border-b border-eco-green-light/30 pb-4">
        <h2 className="text-3xl font-heading font-bold text-eco-green-dark">Testimonial Management</h2>
        <button
          onClick={onBack}
          className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Add/Edit Testimonial Form */}
      {isAdding ? (
        <div className="mb-8 p-4 border border-eco-green-light/30 rounded-lg bg-eco-off-white">
          <h3 className="text-xl font-semibold text-eco-green-dark mb-4">{currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
          <form onSubmit={handleAddOrUpdateTestimonial} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="author" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Author</label>
              <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.author ? 'border-red-500' : 'border-eco-green-light/30'}`} />
              {formErrors.author && <p className="text-red-500 text-xs italic mt-1">{formErrors.author}</p>}
            </div>
            <div>
              <label htmlFor="quote" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Quote</label>
              <textarea name="quote" id="quote" value={formData.quote} onChange={handleChange} rows="4" className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.quote ? 'border-red-500' : 'border-eco-green-light/30'}`}></textarea>
              {formErrors.quote && <p className="text-red-500 text-xs italic mt-1">{formErrors.quote}</p>}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button type="button" onClick={resetForm} className="bg-eco-brown-light text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-brown-dark transition-colors">Cancel</button>
              <button type="submit" className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors">
                {currentTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors mb-6 shadow-md"
        >
          Add New Testimonial
        </button>
      )}

      {/* Testimonial List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-eco-cream rounded-lg shadow-eco-soft border border-eco-green-light/20">
          <thead className="bg-eco-green-light/30">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Author</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Quote</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="border-b border-eco-green-light/10 hover:bg-eco-off-white">
                <td className="py-3 px-4 text-eco-brown-dark">{testimonial.author}</td>
                <td className="py-3 px-4 text-eco-brown-dark text-sm italic">"{testimonial.quote.substring(0, 100)}..."</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="bg-eco-green-medium text-white py-1 px-3 rounded-md text-sm hover:bg-eco-green-dark transition-colors shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md text-sm hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestimonialManagement;

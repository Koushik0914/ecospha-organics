// src/components/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore database instance

const ProductManagement = ({ onBack }) => {
  const [products, setProducts] = useState([]); // State to store the list of products
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [isAdding, setIsAdding] = useState(false); // State to control visibility of add/edit form
  const [currentProduct, setCurrentProduct] = useState(null); // State to hold product being edited
  // State for form data, initialized for new product or populated for editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '', // Price as string for input field
    unit: '',
    availability: 'In Stock',
    category: '',
  });
  const [formErrors, setFormErrors] = useState({}); // State for form validation errors

  // Define the base path for the products collection once
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const PRODUCTS_COLLECTION_PATH = `artifacts/${appId}/public/data/products`; // Consistent lowercase 'products'

  // Effect to fetch products from Firestore in real-time
  useEffect(() => {
    // Reference to the public products collection
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION_PATH);
    const q = query(productsCollectionRef);

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching products for management:", err);
        setError("Failed to load products for management.");
        setLoading(false);
      }
    );
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Handles changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validates the form data before submission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    // Validate price: must be a number and greater than 0
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) newErrors.price = 'Valid Price is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handles adding a new product or updating an existing one
  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true);

    try {
      const productToSave = {
        ...formData,
        price: parseFloat(formData.price), // Convert price string to number before saving to Firestore
      };

      if (currentProduct) {
        // If currentProduct exists, update the existing document
        // Correctly constructing the document reference using the full path and document ID
        const productDocRef = doc(db, PRODUCTS_COLLECTION_PATH, currentProduct.id);
        await updateDoc(productDocRef, productToSave);
        console.log("Product updated:", currentProduct.id);
      } else {
        // Otherwise, add a new document
        // Correctly adding a document to the collection using the full path
        await addDoc(collection(db, PRODUCTS_COLLECTION_PATH), productToSave);
        console.log("Product added:", productToSave.name);
      }
      resetForm(); // Reset the form after successful operation
    } catch (err) {
      console.error("Error adding/updating product:", err);
      setError("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  // Sets the form data for editing an existing product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price.toString(), // Convert number back to string for input field
      unit: product.unit,
      availability: product.availability,
      category: product.category,
    });
    setIsAdding(true); // Show the form
  };

  // Handles deleting a product
  const handleDeleteProduct = async (productId) => {
    // Use window.confirm for a simple confirmation in the admin panel
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        // Correctly constructing the document reference for deletion
        const productDocRef = doc(db, PRODUCTS_COLLECTION_PATH, productId);
        await deleteDoc(productDocRef); // Delete the document
        console.log("Product deleted:", productId);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Resets the form to its initial empty state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      price: '',
      unit: '',
      availability: 'In Stock',
      category: '',
    });
    setCurrentProduct(null); // Clear product being edited
    setIsAdding(false); // Hide the form
    setFormErrors({}); // Clear form errors
  };

  // Render loading state
  if (loading) {
    return <div className="text-center p-8"><p className="text-lg text-eco-brown-dark">Loading products...</p></div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center p-8 text-red-600"><p className="text-lg">{error}</p></div>;
  }

  return (
    <div className="bg-eco-cream p-6 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto border border-eco-green-light/20">
      <div className="flex justify-between items-center mb-6 border-b border-eco-green-light/30 pb-4">
        <h2 className="text-3xl font-heading font-bold text-eco-green-dark">Product Management</h2>
        {/* Button to go back to Admin Dashboard */}
        <button
          onClick={onBack}
          className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Add/Edit Product Form Section */}
      {isAdding ? (
        <div className="mb-8 p-4 border border-eco-green-light/30 rounded-lg bg-eco-off-white">
          <h3 className="text-xl font-semibold text-eco-green-dark mb-4">{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form fields for product details */}
            <div>
              <label htmlFor="name" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Product Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.name ? 'border-red-500' : 'border-eco-green-light/30'}`} />
              {formErrors.name && <p className="text-red-500 text-xs italic mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="category" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.category ? 'border-red-500' : 'border-eco-green-light/30'}`} />
              {formErrors.category && <p className="text-red-500 text-xs italic mt-1">{formErrors.category}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.description ? 'border-red-500' : 'border-eco-green-light/30'}`}></textarea>
              {formErrors.description && <p className="text-red-500 text-xs italic mt-1">{formErrors.description}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Image URL</label>
              <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.imageUrl ? 'border-red-500' : 'border-eco-green-light/30'}`} />
              {formErrors.imageUrl && <p className="text-red-500 text-xs italic mt-1">{formErrors.imageUrl}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Price (₹)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.price ? 'border-red-500' : 'border-eco-green-light/30'}`} step="0.01" />
              {formErrors.price && <p className="text-red-500 text-xs italic mt-1">{formErrors.price}</p>}
            </div>
            <div>
              <label htmlFor="unit" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Unit (e.g., kg, 500g)</label>
              <input type="text" name="unit" id="unit" value={formData.unit} onChange={handleChange} className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream ${formErrors.unit ? 'border-red-500' : 'border-eco-green-light/30'}`} />
              {formErrors.unit && <p className="text-red-500 text-xs italic mt-1">{formErrors.unit}</p>}
            </div>
            <div>
              <label htmlFor="availability" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Availability</label>
              <select name="availability" id="availability" value={formData.availability} onChange={handleChange} className="shadow-sm border border-eco-green-light/30 rounded-lg w-full py-2 px-3 text-eco-brown-dark bg-eco-cream">
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="button" onClick={resetForm} className="bg-eco-brown-light text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-brown-dark transition-colors">Cancel</button>
              <button type="submit" className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors">
                {currentProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Button to show the add product form
        <button
          onClick={() => setIsAdding(true)}
          className="bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors mb-6 shadow-md"
        >
          Add New Product
        </button>
      )}

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-eco-cream rounded-lg shadow-eco-soft border border-eco-green-light/20">
          <thead className="bg-eco-green-light/30">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Name</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Category</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Price</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Unit</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Availability</th>
              <th className="py-3 px-4 text-left text-sm font-body font-semibold text-eco-brown-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-eco-green-light/10 hover:bg-eco-off-white">
                <td className="py-3 px-4 text-eco-brown-dark">{product.name}</td>
                <td className="py-3 px-4 text-eco-brown-dark">{product.category}</td>
                <td className="py-3 px-4 text-eco-brown-dark">₹{product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-eco-brown-dark">{product.unit}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.availability === 'In Stock' ? 'bg-eco-green-light/50 text-eco-green-dark' : 'bg-red-200 text-red-800'}`}>
                    {product.availability}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-eco-green-medium text-white py-1 px-3 rounded-md text-sm hover:bg-eco-green-dark transition-colors shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
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

export default ProductManagement;

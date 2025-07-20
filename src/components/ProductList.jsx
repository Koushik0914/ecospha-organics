// src/components/ProductList.jsx
import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar'; // Import SearchBar

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]); // Store all fetched products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const productsCollectionRef = collection(db, `artifacts/${appId}/public/data/products`); // Assuming 'products' is the correct collection name

    const q = query(productsCollectionRef);

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllProducts(productsData); // Store all products
        setLoading(false);
        console.log("Products fetched:", productsData);
      },
      (err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Derive unique categories from all products
  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return [...uniqueCategories].sort(); // Convert Set to Array and sort alphabetically
  }, [allProducts]); // Recalculate only when allProducts changes

  // Filter products based on search term and selected category
  const filteredProducts = useMemo(() => {
    let currentProducts = allProducts;

    // Filter by category
    if (selectedCategory) {
      currentProducts = currentProducts.filter(product =>
        product.category === selectedCategory
      );
    }

    // Filter by search term (case-insensitive)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseSearchTerm)) // Allow searching by category name too
      );
    }

    return currentProducts;
  }, [allProducts, searchTerm, selectedCategory]); // Recalculate when these dependencies change

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-700">Loading products...</p>
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

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Organic Produce</h2>

      {/* Search and Filter Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Display message if no filtered products found */}
      {filteredProducts.length === 0 && (
        <div className="text-center p-8">
          <p className="text-lg text-gray-700">No products found matching your criteria.</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
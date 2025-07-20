// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  auth,
  setupFirebaseAuth,
  signInUser, // Import new auth functions
  registerUser, // Import new auth functions
  signInWithGoogle, // Import new auth functions
  signOutUser, // Import new auth functions
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import ProductList from './components/ProductList';
import ShoppingCart from './components/ShoppingCart';
import CheckoutForm from './components/CheckoutForm';
import PaymentSummary from './components/PaymentSummary';
import OrderConfirmation from './components/OrderConfirmation';
import AdminDashboard from './components/AdminDashboard';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import AuthForm from './components/AuthForm'; // Import AuthForm
import GoogleSignInButton from './components/GoogleSignInButton'; // Import GoogleSignInButton
import UserOrders from './components/UserOrders'; // Import UserOrders component
import Testimonials from './components/Testimonials'; // Import Testimonials component
import TestimonialManagement from './components/TestimonialManagement'; // New: Import TestimonialManagement component

// New: Import content pages
import AboutUs from './components/AboutUs';
import OurFarms from './components/OurFarms';
import Blog from './components/Blog';


import { CartProvider, useCart } from './context/CartContext';

// Define constants for checkout steps for better readability and maintainability
const CHECKOUT_STEPS = {
  CART: 'cart', // User is viewing the product list and cart
  SHIPPING: 'shipping', // User is filling out shipping information
  PAYMENT: 'payment', // User is reviewing order and selecting payment method
  CONFIRMATION: 'confirmation', // Order has been placed successfully
  MY_ORDERS: 'my-orders', // User is viewing their order history
  ABOUT_US: 'about-us', // New: About Us page
  OUR_FARMS: 'our-farms', // New: Our Farms page
  BLOG: 'blog', // New: Blog page
};

// Define constants for admin panel views
const ADMIN_VIEWS = {
  DASHBOARD: 'dashboard',
  PRODUCT_MANAGEMENT: 'product-management',
  ORDER_MANAGEMENT: 'order-management',
  TESTIMONIAL_MANAGEMENT: 'testimonial-management', // New: Testimonial Management view
};

// IMPORTANT: For demonstration, define an admin user ID.
// REPLACE 'YOUR_ADMIN_FIREBASE_UID_HERE' with your actual Firebase User ID
// to enable the admin panel for your authenticated user.
// You can find your UID in the browser's console (e.g., "User authenticated: YOUR_UID_HERE").
const ADMIN_USER_ID = 'hovKQ5i3utYM8T3hjyQYTggk5c13'; // <--- Make sure this is your actual UID

// AppContent is the main application logic, separated to allow CartProvider to wrap it.
function AppContent() {
  const [userId, setUserId] = useState(null); // State to store the authenticated user's ID
  const [loading, setLoading] = useState(true); // State to manage initial loading of authentication
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control the visibility of the shopping cart modal
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.CART); // State to manage the current step in the checkout flow
  const [shippingData, setShippingData] = useState({}); // State to store shipping form data across steps
  const [isAdminView, setIsAdminView] = useState(false); // State to toggle between customer and admin view
  const [currentAdminView, setCurrentAdminView] = useState(ADMIN_VIEWS.DASHBOARD); // State for current section within admin panel
  const [showAuthForm, setShowAuthForm] = useState(false); // New: State to control visibility of auth form
  const [isRegisterForm, setIsRegisterForm] = useState(false); // New: State to toggle between login/register
  const { totalItems, cartItems } = useCart(); // Get totalItems and cartItems from CartContext

  useEffect(() => {
    const initializeAppAndAuth = async () => {
      await setupFirebaseAuth(); // Call the setup function from firebase.js
      setLoading(false); // Once authentication setup is complete, set loading to false
    };

    initializeAppAndAuth();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User authenticated:", user.uid);
        // Basic admin check: if the authenticated user's UID matches the predefined ADMIN_USER_ID
        if (user.uid === ADMIN_USER_ID) {
          console.log("Admin user detected!");
        }
        setShowAuthForm(false); // Hide auth form if user logs in
      } else {
        setUserId(null);
        console.log("User not authenticated.");
      }
    });

    // Clean up the authentication listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // --- Checkout Flow Handlers ---
  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      setCurrentStep(CHECKOUT_STEPS.SHIPPING); // Change the current step to SHIPPING
      setIsCartOpen(false); // Close the cart modal when proceeding to checkout
    } else {
      console.log("Cart is empty. Cannot proceed to checkout.");
      // In a real app, you might show a user-friendly message here (e.g., a toast notification)
    }
  };

  const handleShippingSubmit = (data) => {
    setShippingData(data); // Store the collected shipping data
    setCurrentStep(CHECKOUT_STEPS.PAYMENT); // Move to the payment/summary step
  };

  const handleBackToShipping = () => {
    setCurrentStep(CHECKOUT_STEPS.SHIPPING); // Go back to the shipping step
  };

  const handleOrderSuccess = () => {
    setCurrentStep(CHECKOUT_STEPS.CONFIRMATION); // Move to the order confirmation step
  };

  const handleContinueShopping = () => {
    setCurrentStep(CHECKOUT_STEPS.CART); // Reset to the initial cart/product list view
    setShippingData({}); // Clear any stored shipping data
    setIsAdminView(false); // Ensure we're out of admin view when continuing shopping
    setShowAuthForm(false); // Ensure auth form is hidden
  };

  // Handler for going back to cart from Payment Summary or Checkout Form
  const handleBackToCart = () => {
    setCurrentStep(CHECKOUT_STEPS.CART); // Go back to the main product list view
    setIsCartOpen(true); // Re-open the cart modal
  };

  // --- Admin View Handlers ---
  const toggleAdminView = () => {
    setIsAdminView((prev) => !prev); // Toggle the boolean state
    // Reset relevant states when toggling views to ensure a clean transition
    setCurrentStep(CHECKOUT_STEPS.CART); // Always go back to main store view when exiting admin
    setCurrentAdminView(ADMIN_VIEWS.DASHBOARD); // Always go to admin dashboard when entering admin
    setIsCartOpen(false); // Close cart when toggling admin view
    setShowAuthForm(false); // Ensure auth form is hidden
  };

  const handleAdminNavigation = (view) => {
    setCurrentAdminView(view);
  };

  // --- Authentication Handlers ---
  const handleLogin = async (email, password) => {
    await signInUser(email, password);
    // onAuthStateChanged listener will handle setting userId and hiding form
  };

  const handleRegister = async (email, password) => {
    await registerUser(email, password);
    // onAuthStateChanged listener will handle setting userId and hiding form
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // onAuthStateChanged listener will handle setting userId and hiding form
  };

  const handleLogout = async () => {
    await signOutUser();
    // onAuthStateChanged listener will handle clearing userId
    setIsAdminView(false); // Exit admin view on logout
    setCurrentStep(CHECKOUT_STEPS.CART); // Go back to main store view
  };

  const openAuthForm = (isRegister) => {
    setShowAuthForm(true);
    setIsRegisterForm(isRegister);
    setIsCartOpen(false); // Close cart if open
  };

  // Handler for clicking the Ecospha Organics header to go home
  const handleGoHome = () => {
    setCurrentStep(CHECKOUT_STEPS.CART); // Go back to the main product list view
    setIsAdminView(false); // Ensure not in admin view
    setShowAuthForm(false); // Ensure auth form is hidden
    setIsCartOpen(false); // Ensure cart is closed
  };

  // Handler for navigating to My Orders page
  const handleViewMyOrders = () => {
    setCurrentStep(CHECKOUT_STEPS.MY_ORDERS);
    setIsAdminView(false); // Ensure not in admin view
    setShowAuthForm(false); // Ensure auth form is hidden
    setIsCartOpen(false); // Ensure cart is closed
  };

  // New: Handlers for content pages
  const handleViewAboutUs = () => {
    setCurrentStep(CHECKOUT_STEPS.ABOUT_US);
    setIsAdminView(false);
    setShowAuthForm(false);
    setIsCartOpen(false);
  };

  const handleViewOurFarms = () => {
    setCurrentStep(CHECKOUT_STEPS.OUR_FARMS);
    setIsAdminView(false);
    setShowAuthForm(false);
    setIsCartOpen(false);
  };

  const handleViewBlog = () => {
    setCurrentStep(CHECKOUT_STEPS.BLOG);
    setIsAdminView(false);
    setShowAuthForm(false);
    setIsCartOpen(false);
  };


  // Display a loading message while the application is initializing authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-eco-off-white flex items-center justify-center">
        <p className="text-xl text-eco-brown-dark">Loading application...</p>
      </div>
    );
  }

  // Once loading is complete, render the main application content based on current view (admin/customer)
  return (
    <div className="min-h-screen bg-eco-off-white flex flex-col items-center p-4 font-body">
      {/* Header section with site title and cart/admin/auth buttons */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 px-6 bg-eco-cream shadow-eco-soft rounded-xl mb-8">
        {/* Make the H1 clickable to go home */}
        <h1
          className="text-3xl font-heading font-bold text-eco-green-dark cursor-pointer"
          onClick={handleGoHome}
        >
          Ecospha Organics
        </h1>
        <div className="flex items-center gap-4">
          {userId && (
            <p className="text-sm text-eco-brown-light hidden md:block">
              Welcome, <span className="font-semibold">{auth.currentUser?.displayName || auth.currentUser?.email || 'Guest'}</span>!
              (ID: <span className="font-mono bg-eco-off-white p-1 rounded text-xs">{userId.substring(0, 8)}...</span>)
            </p>
          )}

          {/* New: My Orders Button (visible when logged in and not in admin view) */}
          {userId && !isAdminView && (currentStep !== CHECKOUT_STEPS.CONFIRMATION) && (
            <button
              onClick={handleViewMyOrders}
              className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors shadow-eco-subtle"
            >
              My Orders
            </button>
          )}

          {/* Admin Toggle Button (visible only to the defined ADMIN_USER_ID) */}
          {userId === ADMIN_USER_ID && (
            <button
              onClick={toggleAdminView}
              className={`py-2 px-4 rounded-lg font-semibold transition-colors shadow-eco-subtle
                ${isAdminView ? 'bg-eco-green-dark hover:bg-eco-green-medium text-white' : 'bg-eco-green-light text-eco-brown-dark hover:bg-eco-green-medium hover:text-white'}`}
            >
              {isAdminView ? 'Exit Admin' : 'Admin Panel'}
            </button>
          )}

          {/* Cart button - only show if not in admin view and not in confirmation step */}
          {!isAdminView && currentStep !== CHECKOUT_STEPS.CONFIRMATION && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors flex items-center gap-2 shadow-eco-subtle"
            >
              {/* Shopping cart SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {/* Display total items in cart as a badge if greater than 0 */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Login/Logout Buttons */}
          {userId ? (
            <button
              onClick={handleLogout}
              className="bg-eco-brown-light text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-brown-dark transition-colors shadow-eco-subtle"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => openAuthForm(false)} // Open login form
              className="bg-eco-green-light text-eco-brown-dark py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-medium hover:text-white transition-colors shadow-eco-subtle"
            >
              Login / Register
            </button>
          )}
        </div>
      </header>

      {/* New: Navigation for content pages */}
      {!isAdminView && !showAuthForm && (currentStep === CHECKOUT_STEPS.CART || currentStep === CHECKOUT_STEPS.ABOUT_US || currentStep === CHECKOUT_STEPS.OUR_FARMS || currentStep === CHECKOUT_STEPS.BLOG) && (
        <nav className="w-full max-w-6xl flex justify-center gap-6 py-3 px-6 bg-eco-cream shadow-eco-subtle rounded-xl mb-8">
          <button onClick={handleGoHome} className="text-eco-green-medium hover:text-eco-green-dark font-semibold transition-colors">Shop</button>
          <button onClick={handleViewAboutUs} className="text-eco-green-medium hover:text-eco-green-dark font-semibold transition-colors">About Us</button>
          <button onClick={handleViewOurFarms} className="text-eco-green-medium hover:text-eco-green-dark font-semibold transition-colors">Our Farms</button>
          <button onClick={handleViewBlog} className="text-eco-green-medium hover:text-eco-green-dark font-semibold transition-colors">Blog</button>
        </nav>
      )}

      {/* Conditional Rendering for Auth Form or Main Content */}
      {showAuthForm ? (
        <div className="w-full max-w-6xl flex justify-center py-8">
          <div className="flex flex-col gap-4 items-center">
            <AuthForm
              isRegister={isRegisterForm}
              onSubmit={isRegisterForm ? handleRegister : handleLogin}
              onToggleForm={() => setIsRegisterForm(!isRegisterForm)}
            />
            <div className="relative flex py-5 items-center w-full max-w-md">
                <div className="flex-grow border-t border-eco-green-light"></div>
                <span className="flex-shrink mx-4 text-eco-brown-light">OR</span>
                <div className="flex-grow border-t border-eco-green-light"></div>
            </div>
            <GoogleSignInButton onClick={handleGoogleSignIn} />
          </div>
        </div>
      ) : (
        // Main Application Content
        <>
          {/* Hero Section - Only visible on the main customer-facing view at the cart step */}
          {!isAdminView && currentStep === CHECKOUT_STEPS.CART && (
            <section
              className="relative w-full max-w-6xl h-64 md:h-80 bg-cover bg-center rounded-xl shadow-eco-soft mb-8 flex items-center justify-center p-4"
              style={{ backgroundImage: `url('https://placehold.co/1200x400/8DBE98/2E473C?text=Bringing+Nature%27s+Best+To+Your+Doorstep')` }} // Placeholder for farm/field image
            >
              <div className="absolute inset-0 bg-eco-green-dark opacity-50 rounded-xl"></div> {/* Semi-transparent overlay */}
              <h2 className="relative z-10 text-white text-4xl md:text-5xl font-heading font-bold text-center leading-tight drop-shadow-lg">
                Bringing Nature’s Best To Your Doorstep
              </h2>
            </section>
          )}

          {/* Main content area, conditionally rendering components based on isAdminView */}
          <main className="w-full max-w-6xl flex flex-col items-center flex-grow">
            {isAdminView ? (
              // Render Admin Panel Views
              <>
                {currentAdminView === ADMIN_VIEWS.DASHBOARD && (
                  <AdminDashboard onNavigate={handleAdminNavigation} />
                )}
                {currentAdminView === ADMIN_VIEWS.PRODUCT_MANAGEMENT && (
                  <ProductManagement onBack={() => handleAdminNavigation(ADMIN_VIEWS.DASHBOARD)} />
                )}
                {currentAdminView === ADMIN_VIEWS.ORDER_MANAGEMENT && (
                  <OrderManagement onBack={() => handleAdminNavigation(ADMIN_VIEWS.DASHBOARD)} />
                )}
                {currentAdminView === ADMIN_VIEWS.TESTIMONIAL_MANAGEMENT && ( // New: Testimonial Management view
                  <TestimonialManagement onBack={() => handleAdminNavigation(ADMIN_VIEWS.DASHBOARD)} />
                )}
              </>
            ) : (
              // Render Customer Facing Views
              <>
                {currentStep === CHECKOUT_STEPS.CART && (
                  <>
                    <ProductList />
                    <Testimonials /> {/* Display testimonials on the main page */}
                    {/* Render ShoppingCart modal if open, passing the onProceedToCheckout prop */}
                    {isCartOpen && (
                      <ShoppingCart
                        onClose={() => setIsCartOpen(false)}
                        onProceedToCheckout={handleProceedToCheckout}
                      />
                    )}
                  </>
                )}

                {currentStep === CHECKOUT_STEPS.SHIPPING && (
                  <CheckoutForm
                    onNext={handleShippingSubmit}
                    initialData={shippingData}
                    onBackToCart={handleBackToCart} // Pass the handler for back to cart
                  />
                )}

                {currentStep === CHECKOUT_STEPS.PAYMENT && (
                  <PaymentSummary
                    shippingData={shippingData}
                    onBack={handleBackToShipping}
                    onOrderSuccess={handleOrderSuccess}
                    onBackToCart={handleBackToCart} // Pass the handler for back to cart
                  />
                )}

                {currentStep === CHECKOUT_STEPS.CONFIRMATION && (
                  <OrderConfirmation onContinueShopping={handleContinueShopping} />
                )}

                {currentStep === CHECKOUT_STEPS.MY_ORDERS && (
                  <UserOrders onBackToShop={handleContinueShopping} />
                )}

                {currentStep === CHECKOUT_STEPS.ABOUT_US && ( // New: About Us page
                  <AboutUs onBackToShop={handleContinueShopping} />
                )}

                {currentStep === CHECKOUT_STEPS.OUR_FARMS && ( // New: Our Farms page
                  <OurFarms onBackToShop={handleContinueShopping} />
                )}

                {currentStep === CHECKOUT_STEPS.BLOG && ( // New: Blog page
                  <Blog onBackToShop={handleContinueShopping} />
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* Simple Footer */}
      <footer className="w-full max-w-6xl text-center py-6 mt-8 text-eco-brown-light text-sm border-t border-eco-green-light/30">
        <p className="mb-2">Connect with us on social media:</p>
        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="text-eco-green-medium hover:text-eco-green-dark transition-colors">Facebook</a>
          <a href="#" className="text-eco-green-medium hover:text-eco-green-dark transition-colors">Instagram</a>
          <a href="#" className="text-eco-green-medium hover:text-eco-green-dark transition-colors">Twitter</a>
        </div>
        <p className="mb-2">Subscribe to our newsletter for organic updates:</p>
        <div className="flex justify-center mb-4">
          <input
            type="email"
            placeholder="Your email address"
            className="p-2 rounded-l-lg border border-eco-green-light bg-eco-off-white text-eco-brown-dark focus:outline-none focus:ring-1 focus:ring-eco-green-medium"
          />
          <button className="bg-eco-green-medium text-white p-2 rounded-r-lg hover:bg-eco-green-dark transition-colors">Subscribe</button>
        </div>
        <div className="flex justify-center gap-4 mb-2">
          <a href="#" className="text-eco-brown-light hover:text-eco-brown-dark transition-colors">About Us</a>
          <a href="#" className="text-eco-brown-light hover:text-eco-brown-dark transition-colors">Contact</a>
          <a href="#" className="text-eco-brown-light hover:text-eco-brown-dark transition-colors">Privacy Policy</a>
        </div>
        &copy; {new Date().getFullYear()} Ecospha Organics. All rights reserved.
      </footer>
    </div>
  );
}

// App component acts as a wrapper to provide the CartContext to AppContent and its children.
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;

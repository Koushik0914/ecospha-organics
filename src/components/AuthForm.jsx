// src/components/AuthForm.jsx
import React, { useState } from 'react';

const AuthForm = ({ isRegister, onSubmit, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(email, password); // Call the onSubmit prop from parent
      // Success handled by parent (e.g., redirect or state update)
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      // Firebase error codes are helpful for user feedback
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        default:
          setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-md mx-auto border border-eco-green-light/20">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6 text-center">
        {isRegister ? 'Register' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-eco-green-light rounded-lg bg-eco-off-white text-eco-brown-dark focus:outline-none focus:ring-2 focus:ring-eco-green-medium shadow-eco-subtle"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-eco-green-light rounded-lg bg-eco-off-white text-eco-brown-dark focus:outline-none focus:ring-2 focus:ring-eco-green-medium shadow-eco-subtle"
            placeholder="********"
            required
          />
        </div>
        {isRegister && (
          <div>
            <label htmlFor="confirmPassword" className="block text-eco-brown-dark text-sm font-body font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-eco-green-light rounded-lg bg-eco-off-white text-eco-brown-dark focus:outline-none focus:ring-2 focus:ring-eco-green-medium shadow-eco-subtle"
              placeholder="********"
              required
            />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-eco-green-dark text-white py-3 rounded-lg font-semibold text-lg hover:bg-eco-green-medium transition-colors shadow-md"
          disabled={loading}
        >
          {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
        </button>
      </form>

      <p className="text-center text-eco-brown-dark mt-4">
        {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
        <button
          onClick={onToggleForm}
          className="text-eco-green-medium hover:underline ml-1 font-semibold"
          disabled={loading}
        >
          {isRegister ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
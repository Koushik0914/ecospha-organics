// src/components/Blog.jsx
import React from 'react';

const Blog = ({ onBackToShop }) => {
  const blogPosts = [
    {
      id: 1,
      title: "The Benefits of Organic Millets",
      date: "July 10, 2025",
      snippet: "Discover why millets are a superfood and how integrating them into your diet can boost your health and support sustainable farming.",
      link: "#" // Placeholder for actual blog post link
    },
    {
      id: 2,
      title: "Seasonal Eating: What's Fresh This Month?",
      date: "July 5, 2025",
      snippet: "Learn about the advantages of eating seasonally and what fresh, organic produce you can expect from Ecospha Organics this month.",
      link: "#"
    },
    {
      id: 3,
      title: "Our Commitment to Zero-Waste Farming",
      date: "June 28, 2025",
      snippet: "Explore the innovative methods we employ on our farms to minimize waste and maximize ecological efficiency.",
      link: "#"
    }
  ];

  return (
    <div className="bg-eco-cream p-8 rounded-xl shadow-eco-soft w-full max-w-4xl mx-auto text-center border border-eco-green-light/20">
      <h2 className="text-3xl font-heading font-bold text-eco-green-dark mb-6">Ecospha Organics Blog</h2>
      <p className="text-eco-brown-dark mb-8">
        Stay updated with our latest news, organic living tips, healthy recipes, and insights from our farms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {blogPosts.map(post => (
          <div key={post.id} className="bg-eco-off-white p-5 rounded-lg shadow-eco-subtle border border-eco-green-light/10">
            <h3 className="text-xl font-semibold text-eco-green-medium mb-2">{post.title}</h3>
            <p className="text-eco-brown-light text-sm mb-3">{post.date}</p>
            <p className="text-eco-brown-dark mb-4">{post.snippet}</p>
            <a href={post.link} className="text-eco-green-dark hover:underline font-semibold">Read More &rarr;</a>
          </div>
        ))}
      </div>

      <button onClick={onBackToShop} className="mt-8 bg-eco-green-medium text-white py-2 px-4 rounded-lg font-semibold hover:bg-eco-green-dark transition-colors shadow-md">
        Back to Shop
      </button>
    </div>
  );
};

export default Blog;

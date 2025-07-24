import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function NewsBlogsGrid() {
  const [articles, setArticles] = useState([]);

  // Fetch articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`);
        
        if (Array.isArray(response.data)) {
          const publishedArticles = response.data.filter(article => article.status === 'Published');
          setArticles(publishedArticles);
        } else {
          console.error('Invalid response format: Expected an array');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Latest News & Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div 
            key={article.slug}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={`${import.meta.env.VITE_API_URL}${article.image}`} 
                alt={article.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>by {article.author?.name || "Editorial Team"}</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
              <Link 
                to={`/news-blog/${article.slug}`} 
                className="inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                Read Article →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewsBlogsGrid;
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function NewsBlogs() {
  const [articles, setArticles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

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

  const nextSlide = () => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      const maxScroll = sliderRef.current.scrollWidth - slideWidth;
      const nextScrollPosition = Math.min(
        sliderRef.current.scrollLeft + slideWidth, 
        maxScroll
      );
      
      sliderRef.current.scrollTo({
        left: nextScrollPosition,
        behavior: 'smooth'
      });
      
      if (nextScrollPosition >= maxScroll) {
        setCurrentSlide(Math.ceil(maxScroll / slideWidth));
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      const prevScrollPosition = Math.max(
        sliderRef.current.scrollLeft - slideWidth, 
        0
      );
      
      sliderRef.current.scrollTo({
        left: prevScrollPosition,
        behavior: 'smooth'
      });
      
      setCurrentSlide(Math.floor(prevScrollPosition / slideWidth));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Latest News & Insights</h2>
        
        <div className="hidden md:flex space-x-2">
          <button 
            className={`p-2 rounded-full ${currentSlide === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className={`p-2 rounded-full ${articles.length <= 4 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            onClick={nextSlide}
            disabled={articles.length <= 4}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {articles.map((article) => (
            <div 
              key={article.slug}
              className="flex-none w-80 snap-start rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
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
      </div>
    </section>
  );
}

export default NewsBlogs;
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

function NewsBlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogsRes, blogRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/slug/${slug}`),
        ]);

        if (Array.isArray(blogsRes.data)) {
          setBlogs(blogsRes.data.filter((b) => b.status === "Published"));
        }
        setBlog(blogRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Blog not found
      </div>
    );
  }
// Add this right before your return statement
console.log("Blog data received:", {
  metaTitle: blog.metaTitle,
  metaDescription: blog.metaDescription,
  metaKeywords: blog.metaKeywords,
  content: blog.content
});
  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        {blog.metaDescription && (
          <meta name="description" content={blog.metaDescription} />
        )}
        {blog.metaKeywords && (
          <meta
            name="keywords"
            content={
              Array.isArray(blog.metaKeywords)
                ? blog.metaKeywords.join(", ")
                : blog.metaKeywords
            }
          />
        )}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="lg:w-2/3">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <header className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>By {blog.author?.name || "Admin"}</span>
                  <span>|</span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </header>

              {blog.tags?.length > 0 && (
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium">Tags:</span>
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {blog.image && (
                <div className="w-full h-96 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${blog.image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className="prose max-w-none p-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">
                Popular Stories
              </h3>
              <div className="space-y-6">
                {blogs
                  .filter((b) => b._id !== blog._id)
                  .slice(0, 5)
                  .map((relatedBlog) => (
                    <Link
                      to={`/news-blog/${relatedBlog.slug}`}
                      key={relatedBlog._id}
                      className="flex gap-4 group"
                    >
                      {relatedBlog.image && (
                        <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${
                              relatedBlog.image
                            }`}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Updated on{" "}
                          {new Date(relatedBlog.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          by {relatedBlog.author?.name || "Admin"}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default NewsBlogDetail;

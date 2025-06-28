import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Blog = () => {
  // Sample blog posts for testing
  const sampleBlogPosts = [
    {
      id: '1',
      title: 'Welcome to Our New E-commerce Platform',
      slug: 'welcome-to-our-platform',
      content: 'We are excited to launch our new e-commerce platform powered by modern technology...',
      excerpt: 'Discover our new e-commerce platform with modern features and seamless shopping experience.',
      featured_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      tags: 'announcement,platform,ecommerce',
      author: { name: 'Admin' },
      published_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Top 10 Tech Gadgets of 2024',
      slug: 'top-tech-gadgets-2024',
      content: 'Explore the most innovative and exciting technology gadgets that are defining 2024...',
      excerpt: 'Discover the most innovative tech gadgets that are shaping 2024.',
      featured_image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800',
      tags: 'technology,gadgets,2024',
      author: { name: 'Tech Editor' },
      published_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      id: '3',
      title: 'Sustainable Fashion: Making Better Choices',
      slug: 'sustainable-fashion-guide',
      content: 'Learn how to make more sustainable fashion choices that benefit both the environment...',
      excerpt: 'A complete guide to making sustainable fashion choices for a better future.',
      featured_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      tags: 'fashion,sustainability,environment',
      author: { name: 'Fashion Editor' },
      published_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
      id: '4',
      title: 'The Future of Remote Work Technology',
      slug: 'future-remote-work-tech',
      content: 'Exploring how technology is reshaping the way we work from home...',
      excerpt: 'How technology is transforming remote work and what to expect in the future.',
      featured_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      tags: 'remote work,technology,future',
      author: { name: 'Work Editor' },
      published_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
    },
    {
      id: '5',
      title: 'Home Office Setup Guide',
      slug: 'home-office-setup-guide',
      content: 'Create the perfect home office setup for maximum productivity...',
      excerpt: 'Essential tips for creating a productive and comfortable home office space.',
      featured_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      tags: 'home office,productivity,workspace',
      author: { name: 'Productivity Expert' },
      published_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
    },
    {
      id: '6',
      title: 'Photography Tips for Beginners',
      slug: 'photography-tips-beginners',
      content: 'Essential photography tips to help you take better photos...',
      excerpt: 'Learn the fundamentals of photography with these beginner-friendly tips.',
      featured_image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800',
      tags: 'photography,beginner,tips',
      author: { name: 'Photo Expert' },
      published_at: new Date(Date.now() - 432000000).toISOString() // 5 days ago
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover insights, tips, and stories from our team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBlogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/blog/${post.slug}`}>
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{post.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(post.published_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-primary-600 dark:hover:text-primary-400">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                  {post.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
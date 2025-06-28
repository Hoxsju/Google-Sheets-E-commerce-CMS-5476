import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dataService } from '../services/dataService';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiCalendar, FiUser, FiTag } = FiIcons;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await dataService.getBlogPost(slug);
        setPost(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h2>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {post.featured_image && (
          <div className="h-96 bg-gray-300 dark:bg-gray-700">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={post.featured_image ? 'text-white -mt-32 relative z-10' : ''}
          >
            <Link
              to="/blog"
              className={`inline-flex items-center mb-6 text-sm font-medium hover:underline ${
                post.featured_image ? 'text-white' : 'text-primary-600 dark:text-primary-400'
              }`}
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                </div>
              )}
            </div>

            {post.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      post.featured_image 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    }`}
                  >
                    <SafeIcon icon={FiTag} className="w-3 h-3 mr-1" />
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none dark:prose-invert"
        >
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>

        {/* Comments Section */}
        {post.comments && post.comments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({post.comments.length})
            </h3>
            
            <div className="space-y-6">
              {post.comments.map((comment, index) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {comment.user_name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(comment.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
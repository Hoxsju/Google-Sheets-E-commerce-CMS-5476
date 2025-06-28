import { supabase } from '../lib/supabase';

export const supabaseDataService = {
  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products_7h3n5p')
        .select('*')
        .eq('availability', 'in_stock')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from('products_7h3n5p')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products_7h3n5p')
        .select('*')
        .eq('featured', true)
        .eq('availability', 'in_stock')
        .order('name')
        .limit(8);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories_9m4w7q')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Blog Posts
  async getBlogPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts_6k8j3n')
        .select(`
          *,
          author:users_profiles_8x9k2m(name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  async getBlogPost(slug) {
    try {
      const { data, error } = await supabase
        .from('blog_posts_6k8j3n')
        .select(`
          *,
          author:users_profiles_8x9k2m(name),
          comments:comments_1m5v9x(
            *,
            user:users_profiles_8x9k2m(name)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Pages
  async getPages() {
    try {
      const { data, error } = await supabase
        .from('pages_5r2t8v')
        .select('*')
        .eq('status', 'published')
        .order('title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },

  async getPage(slug) {
    try {
      const { data, error } = await supabase
        .from('pages_5r2t8v')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },

  // Site Configuration
  async getSiteConfig() {
    try {
      const { data, error } = await supabase
        .from('site_config_8q3h6w')
        .select('key, value');

      if (error) throw error;
      
      // Convert array to object
      const config = {};
      data?.forEach(item => {
        config[item.key] = item.value;
      });
      
      return config;
    } catch (error) {
      console.error('Error fetching site config:', error);
      throw error;
    }
  },

  async updateSiteConfig(config) {
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_config_8q3h6w')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating site config:', error);
      throw error;
    }
  },

  // Shopping Cart
  async getCartItems(userId) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart_2n8r4t')
        .select(`
          *,
          product:products_7h3n5p(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  async addToCart(userId, productId, quantity = 1) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart_2n8r4t')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateCartItem(userId, productId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(userId, productId);
      }

      const { data, error } = await supabase
        .from('shopping_cart_2n8r4t')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(userId, productId) {
    try {
      const { error } = await supabase
        .from('shopping_cart_2n8r4t')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('shopping_cart_2n8r4t')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: order, error: orderError } = await supabase
        .from('orders_4p6m9s')
        .insert([{
          ...orderData,
          order_number: orderNumber,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          product_sku: item.sku,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          product_snapshot: item
        }));

        const { error: itemsError } = await supabase
          .from('order_items_3w7k5j')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders_4p6m9s')
        .select(`
          *,
          order_items:order_items_3w7k5j(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Reviews
  async getProductReviews(productId) {
    try {
      const { data, error } = await supabase
        .from('reviews_7j2k9p')
        .select(`
          *,
          user:users_profiles_8x9k2m(name)
        `)
        .eq('product_id', productId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async createReview(reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews_7j2k9p')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Wishlist
  async getWishlist(userId) {
    try {
      const { data, error } = await supabase
        .from('wishlists_5t8n3m')
        .select(`
          *,
          product:products_7h3n5p(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  async addToWishlist(userId, productId) {
    try {
      const { data, error } = await supabase
        .from('wishlists_5t8n3m')
        .insert([{
          user_id: userId,
          product_id: productId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  async removeFromWishlist(userId, productId) {
    try {
      const { error } = await supabase
        .from('wishlists_5t8n3m')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }
};
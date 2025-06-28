import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseAuthService } from '../services/supabaseAuthService';

const SupabaseAuthContext = createContext();

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await supabaseAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          try {
            const userProfile = await supabaseAuthService.getUserProfile(currentUser.id);
            setProfile(userProfile);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Profile might not exist yet, that's okay
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          try {
            const userProfile = await supabaseAuthService.getUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching profile:', error);
            // Profile might not exist yet, that's okay
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const result = await supabaseAuthService.signUp(email, password, userData);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await supabaseAuthService.signIn(email, password);
      return result;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabaseAuthService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      const updatedProfile = await supabaseAuthService.updateUserProfile(user.id, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin: profile?.is_admin || false
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
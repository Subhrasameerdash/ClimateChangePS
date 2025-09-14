
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  updateUserPreferences: () => {},
});

// Mock user data
const mockUser: User = {
  id: 'user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  phone: '+1234567890',
  preferences: {
    notificationMethod: ['push', 'email'],
    notificationRadius: 100,
    language: 'en',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('disaster-alert-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('disaster-alert-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, we would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll accept any credentials and return our mock user
      setUser(mockUser);
      localStorage.setItem('disaster-alert-user', JSON.stringify(mockUser));
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please check your credentials and try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('disaster-alert-user');
    toast.info('You have been logged out.');
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // In a real app, we would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user based on the registration info
      const newUser: User = {
        ...mockUser,
        email,
        name,
        id: 'user-' + Date.now(),
      };
      
      setUser(newUser);
      localStorage.setItem('disaster-alert-user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to create account. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('disaster-alert-user', JSON.stringify(updatedUser));
    toast.success('Preferences updated successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

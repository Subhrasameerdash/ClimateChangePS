
import { User } from '@/types';

/**
 * Mock authentication utilities
 * In a real app, these would interact with Firebase Auth or similar
 */

// Mock JWT functions
export const generateToken = (user: User): string => {
  // In a real app, this would create a proper JWT
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  return btoa(JSON.stringify(payload)); // Base64 encode for demo
};

export const verifyToken = (token: string): { valid: boolean; user?: Partial<User> } => {
  try {
    // In a real app, this would properly verify the JWT
    const decodedPayload = JSON.parse(atob(token));
    
    return {
      valid: true,
      user: {
        id: decodedPayload.id,
        email: decodedPayload.email,
        name: decodedPayload.name
      }
    };
  } catch (error) {
    return { valid: false };
  }
};

// Local storage helpers
export const saveAuthState = (user: User, token: string): void => {
  localStorage.setItem('disaster-alert-user', JSON.stringify(user));
  localStorage.setItem('disaster-alert-token', token);
};

export const loadAuthState = (): { user: User | null; token: string | null } => {
  try {
    const userJson = localStorage.getItem('disaster-alert-user');
    const token = localStorage.getItem('disaster-alert-token');
    
    return {
      user: userJson ? JSON.parse(userJson) : null,
      token
    };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return { user: null, token: null };
  }
};

export const clearAuthState = (): void => {
  localStorage.removeItem('disaster-alert-user');
  localStorage.removeItem('disaster-alert-token');
};

// User preferences
export const saveUserPreferences = (userId: string, preferences: User['preferences']): void => {
  try {
    const key = `disaster-alert-preferences-${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

export const loadUserPreferences = (userId: string): User['preferences'] | null => {
  try {
    const key = `disaster-alert-preferences-${userId}`;
    const prefsJson = localStorage.getItem(key);
    return prefsJson ? JSON.parse(prefsJson) : null;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return null;
  }
};

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        return;
      }

      // Verify token with server
      const response = await fetch(`${import.meta.env.VITE_API_URL || window.location.origin}/api/auth/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return;
        }
      }

      // Token invalid, remove it
      localStorage.removeItem('authToken');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${import.meta.env.VITE_API_URL || window.location.origin}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.token);
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return true;
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: data.error || 'Login failed'
        });
        
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Network error. Please try again.'
      });
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus
  };
};

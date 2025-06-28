import { createContext, ReactNode, useEffect, useState } from 'react';
import { User, AuthState } from '../types';

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  state: defaultState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('moviesmirror_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('moviesmirror_user');
        setState({
          ...defaultState,
          isLoading: false,
        });
      }
    } else {
      setState({
        ...defaultState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation - in a real app, this would be handled by your backend
      if (email && password.length >= 6) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0], // Use email prefix as name
        };

        localStorage.setItem('moviesmirror_user', JSON.stringify(user));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid email or password. Password must be at least 6 characters.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (email && password.length >= 6 && name.trim()) {
        const user: User = {
          id: Date.now().toString(),
          email,
          name: name.trim(),
        };

        localStorage.setItem('moviesmirror_user', JSON.stringify(user));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Please provide valid email, password (6+ characters), and name.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('moviesmirror_user');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
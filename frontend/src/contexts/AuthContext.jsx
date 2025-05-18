import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getAccessToken, getRefreshToken, setUserData } from '../hooks/user.actions';
import axiosService from '../helpers/axios'; // Import axiosService from the correct file

// Create the AuthContext
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext); // Custom hook to access AuthContext
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // State to store user details
  const navigate = useNavigate();

  // On initial load, check if there's user data in localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('auth'));

    if (storedUser) {
      setUser(storedUser); // If found, set user state
    }
  }, []);

  // Update user context and localStorage when the user profile is updated
  const updateUserState = (userData) => {
    localStorage.setItem('auth', JSON.stringify(userData)); // Store in localStorage
    setUser(userData); // Set user data in context
  };

  // Login function: Stores user details and tokens in localStorage and context
  const login = (userData) => {
    setUserData(userData); // Use setUserData function to update localStorage
    setUser(userData); // Set user data in context
  };

  // Logout function: Clears user data from localStorage and context
  const logout = () => {
    localStorage.removeItem('auth'); // Remove from localStorage
    setUser(null); // Clear user data from context
    navigate('/'); // Redirect to home or login page
  };

  // Axios refresh token logic
  axiosService.interceptors.response.use(
    response => response, 
    async (error) => {
      // Check if the error is because of an expired token
      if (error.response && error.response.status === 401) {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          try {
            // Attempt to refresh the token
            const response = await axiosService.post('/token/refresh/', { refresh: refreshToken });
            const { access, refresh } = response.data;
            // Update the context with the new access token
            const newUser = { ...getUser(), access, refresh };
            updateUserState(newUser);

            // Retry the failed request with the new token
            error.config.headers['Authorization'] = `Bearer ${access}`;
            return axiosService(error.config); // Retry the original request

          } catch (error) {
            // If refreshing the token fails, log the user out
            logout();
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

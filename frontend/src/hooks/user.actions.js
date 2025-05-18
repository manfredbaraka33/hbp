import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios"; // Make sure axiosService handles authorization logic properly
import axios from "axios";

// Your base URL for API calls
const baseURL = "http://localhost:8000/api";

function useUserActions() {
  const navigate = useNavigate();

  // Return functions
  return {
    login,
    logout,
    edit,
  };

  // Login the user
  function login(data) {
    return axios
      .post(`${baseURL}/token/`, data)
      .then((res) => {
        setUserData(res.data);
        navigate("/home"); // Redirect to homepage or dashboard after login
      })
      .catch((error) => {
        console.error("Login failed", error);
        // Handle error (e.g., show a message)
      });
  }

 

  // Edit the user profile
  function edit(data, userId) {
    return axiosService
      .patch(`${baseURL}/user/${userId}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setUserData({
          access: getAccessToken(),
          refresh: getRefreshToken(),
          user: res.data,
        });
      })
      .catch((error) => {
        console.error("Profile update failed", error);
        // Handle error (e.g., show a message)
      });
  }

  // Log out the user
  function logout() {
    localStorage.removeItem("auth");
    navigate("/"); // Redirect to login page after logout
  }
}

// Helper functions to get and set user data and tokens
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.user : null;
}

function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.access : null;
}

function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.refresh : null;
}

// Set user data in localStorage
function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    })
  );
}

export {
  useUserActions,
  getUser,
  getAccessToken,
  getRefreshToken,
  setUserData,
};

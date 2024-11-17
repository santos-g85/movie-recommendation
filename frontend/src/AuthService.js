import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";



//login
export const handleLogin = async (username, password) => {
  try {
    const response = await api.post("api/token/", { username, password });

    if (response.data) {
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      console.log("Token received:", response.data);
    } else {
      console.error("Token not received");
    }
    return response.data; 
  } catch (error) {
    console.error("Error during login:", error);
    throw error; 
  }
};

// refresh token
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh'); 
  
    try {
      const response = await api.post('/auth/refresh/', {refreshToken});
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.token);
        console.log('Token refreshed:', data);
      } else {
        console.error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };
  
//register
export const handleRegister = async (username, password) => {
    try {
        const response = await api.post("api/user/register/", { username, password });
        return response.data;
    } catch (error) {
        console.error("Registration failed: ", error);
        throw error; 
    }
};


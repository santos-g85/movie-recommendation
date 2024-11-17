import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componets/Login";
import Register from "./componets/Register";
import ProtectedRoute from "./componets/ProtectedRoute";
import Home from "./pages/Home";


function App() {

  function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
  }
  
  function RegisterAndLogout() {
    localStorage.clear()
    return <Register />
  }
  return (
    <BrowserRouter>
    <Routes>
    <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }
        />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

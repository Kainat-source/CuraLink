// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if user is logged in

  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login if no token
  }

  return children; // render the protected page
};

export default ProtectedRoute;

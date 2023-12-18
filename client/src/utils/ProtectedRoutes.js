import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("myTok");
  return token && token.trim() !== ""; // Check if the token exists and is not empty
};

function ProtectedRoutes({ children }) {
  const location = useLocation(); // Add parentheses to invoke useLocation
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate replace state={{ from: location }} to="/" />
  );
}

export default ProtectedRoutes;
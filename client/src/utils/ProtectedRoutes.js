import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.removeItem("myTok");
  return token ? true : false;
};
function ProtectedRoutes({ children }) {
  const location = useLocation;
  return isAuthenticated ? (
    children 
  ) : (
    <Navigate replace path="/login" state={{ from: location }} />
  );
}

export default ProtectedRoutes;

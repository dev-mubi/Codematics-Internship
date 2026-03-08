import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Renders children only when the user is authenticated.
 * Redirects to /login, preserving the attempted URL so we can
 * redirect back after a successful sign-in (future enhancement).
 */
const ProtectedRoute = ({ isLoggedIn, children }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

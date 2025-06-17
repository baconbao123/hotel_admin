import { Navigate, useLocation, Outlet } from "react-router";
import Cookies from "js-cookie";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = Cookies.get("token");
  const location = useLocation();

  useEffect(() => {
    // console.log("Protected Route - Token:", token);
    // console.log("Protected Route - Location:", location);
    // console.log("Current Path:", window.location.pathname);
  }, [token, location]);

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
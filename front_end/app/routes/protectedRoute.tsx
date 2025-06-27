import { fetchUserResources } from "@/components/service/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  const location = useLocation();
  const [userResources, setUserResources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const resources = await fetchUserResources();
        setUserResources(resources);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      loadResources();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const routeResourceMap: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/user": "User",
    "/role": "Role",
    "/permission": "Permissions",
    "/streets": "Street",
    "/hotels": "Hotel",
    "/facilities": "Facilities"
  };

  const requiredResource = routeResourceMap[location.pathname];
  if (requiredResource && !userResources.includes(requiredResource)) {
    console.log(
      `Access denied to ${location.pathname}. Required resource: ${requiredResource}`
    );
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

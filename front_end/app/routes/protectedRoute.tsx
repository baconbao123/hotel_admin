import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  selectHasPermission,
  selectPermissionsLoading,
} from "@/store/slices/permissionSlice";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import type { RootState } from "@/store";
import Loading from "@/components/shared/Loading";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  const location = useLocation();
  const isLoading = useSelector(selectPermissionsLoading);
  const permissions = useSelector(
    (state: RootState) => state.permissions.permissions
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const routeResourceMap: { [key: string]: string } = {
    "/": "Welcome",
    "/dashboard": "Dashboard",
    "/user": "User",
    "/role": "Role",
    "/permission": "Permissions",
    "/streets": "Street",
    "/hotels": "Hotel",
    "/facilities": "Facilities",
    // "/room/:hotelId": "Room",
    // "/booking/:roomId": "Booking",
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const resourceNameFromMap =
    routeResourceMap[location.pathname] || pathSegments[0] || "Welcome";
  const resourceName =
    resourceNameFromMap.charAt(0).toUpperCase() + resourceNameFromMap.slice(1);

  const hasPermission = useSelector((state: RootState) =>
    selectHasPermission(state, resourceName, "view")
  );

  const debugInfo = {
    timestamp: new Date().toISOString(),
    pathname: location.pathname,
    resourceName,
    hasPermission,
    permissions,
    isLoading,
    tokenPresent: !!token,
    permissionsLength: permissions.length,
  };
  console.log("ProtectedRoute Debug:", debugInfo);

  if (!isReady) {
    return <Loading />;
  }

  if (!token) {
    console.log("No token, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading || permissions.length === 0) {
    console.log("Waiting for permissions to load...");
    return <Loading />;
  }

  if (location.pathname === "/" && permissions.length > 0 && !hasPermission) {
    console.log("Root access denied, redirecting to /403");
    return <Navigate to="/403" replace />;
  }

  if (resourceName && !hasPermission && location.pathname !== "/") {
    console.log(
      `Access denied to ${location.pathname}. Required resource: ${resourceName}, Permission: view, Permissions:`,
      permissions
    );
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

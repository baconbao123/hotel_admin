import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./pages/home/Home.tsx"),
  layout("./layout/rootLayout.tsx", [
    route("/dashboard", "./pages/dashboard/Dashboard.tsx"),
    route("/user", "./pages/user/UserList.tsx"),
    route("/role", "./pages/role/RoleList.tsx"),
    route("/permission", "./pages/permission/PermissionList.tsx"),
    route("/street", "./pages/street/StreetList.tsx"),
    route("/hotels", "./pages/hotel/HotelList.tsx"),
    route("/facilities", "./pages/facilities/FacilityList.tsx"),
  ]),
  layout("./layout/authLayout.tsx", [
    route("/login", "./pages/login/Login.tsx"),
    route("/reset-password-profile", "./pages/reset-password/ResetPassword.tsx"),
  ]),
  route("/404", "./pages/error/NotFound.tsx"),
  route("/403", "./pages/error/Error403.tsx"),
  route("/500", "./pages/error/Error500.tsx"),
  route("*", "./pages/error/NotFound.tsx", { id: "catch-all" }),
] satisfies RouteConfig;
